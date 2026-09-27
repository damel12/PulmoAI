import OpenAI from "openai";
import { LengthFinishReasonError } from "openai/error";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getAttempt, getCachedReview, reviewsInLastDay, saveReview } from "@/lib/attempts-db";
import { getCase } from "@/lib/cases";
import { pool } from "@/lib/db";
import { getDict } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/server";
import { ReviewSchema, buildReviewPrompt, reviewSystemPrompt } from "@/lib/review";
import { scoreCase } from "@/lib/scoring";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 120;

const DAILY_LIMIT = 20;
// Первое число — постоянный "неймспейс" для advisory-локов этого модуля (произвольное, лишь бы
// не совпало с другим использованием pg_advisory_lock в проекте), второе — hashtext(userId).
const LOCK_NAMESPACE = 2147300001;

// Клиент присылает id своей попытки и, опционально, свободную формулировку диагноза,
// которую студент пишет сам на экране разбора. Ответы, текст кейса и балл сервер всё
// равно берёт из БД и своих данных — доверяем только этому одному текстовому полю.
const RequestSchema = z.object({ attemptId: z.uuid(), diagnosisNote: z.string().trim().max(600).optional() });

function error(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const locale = await getLocale();
  const e = getDict(locale).api;
  const session = await getSession();
  if (!session) return error(401, e.loginForReview);

  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error(400, e.badRequest);

  const attempt = await getAttempt(session.user.id, parsed.data.attemptId);
  if (!attempt) return error(404, e.attemptNotFound);
  const clinicalCase = getCase(attempt.slug, locale);
  if (!clinicalCase) return error(404, e.caseNotFound);

  const cached = await getCachedReview(attempt.id, locale);
  if (cached) return Response.json({ review: cached });

  if (!process.env.OPENAI_API_KEY) {
    return error(503, e.notConfigured);
  }

  // Лочим на пользователя на всё время запроса: без этого два параллельных запроса (две вкладки,
  // двойной клик) читают reviewsInLastDay ещё до того, как первый успеет записать свой разбор,
  // и оба проходят проверку DAILY_LIMIT — лимит платных вызовов Claude не срабатывает.
  // pg_try_advisory_lock не ждёт: если пользователь уже внутри другого запроса, сразу отказываем.
  const lockClient = await pool.connect();
  try {
    const {
      rows: [{ locked }],
    } = await lockClient.query<{ locked: boolean }>("SELECT pg_try_advisory_lock($1, hashtext($2)) AS locked", [
      LOCK_NAMESPACE,
      session.user.id,
    ]);
    if (!locked) return error(429, e.reviewInProgress);

    try {
      if ((await reviewsInLastDay(session.user.id)) >= DAILY_LIMIT) {
        return error(429, e.dailyLimit(DAILY_LIMIT));
      }

      const result = scoreCase(clinicalCase, attempt.answers);
      const client = new OpenAI();

      try {
        const completion = await client.chat.completions.parse({
          model: process.env.PULMOAI_MODEL || "gpt-5.5",
          max_completion_tokens: 4096,
          messages: [
            { role: "system", content: reviewSystemPrompt(locale) },
            { role: "user", content: buildReviewPrompt(clinicalCase, result, locale, parsed.data.diagnosisNote) },
          ],
          response_format: zodResponseFormat(ReviewSchema, "review"),
        });

        const message = completion.choices[0].message;
        if (message.refusal) return error(502, e.refusal);
        if (!message.parsed) return error(502, e.incomplete);
        await saveReview(session.user.id, attempt.id, locale, message.parsed);
        return Response.json({ review: message.parsed });
      } catch (err) {
        if (err instanceof OpenAI.AuthenticationError) return error(503, e.badKey);
        if (err instanceof OpenAI.RateLimitError) return error(429, e.rateLimit);
        if (err instanceof OpenAI.APIConnectionError) return error(502, e.noConnection);
        if (err instanceof LengthFinishReasonError) return error(502, e.incomplete);
        if (err instanceof OpenAI.APIError) {
          console.error("OpenAI API error", err.status, err.message);
          return error(502, e.serviceError);
        }
        throw err;
      }
    } finally {
      await lockClient.query("SELECT pg_advisory_unlock($1, hashtext($2))", [LOCK_NAMESPACE, session.user.id]);
    }
  } finally {
    lockClient.release();
  }
}
