import { z } from "zod";
import { getCase } from "./cases";
import type { Answers } from "./cases/types";
import { pool } from "./db";
import type { Locale } from "./i18n/config";
import type { Review } from "./review";
import { scoreCase } from "./scoring";

export interface StoredAttempt {
  id: string;
  slug: string;
  score: number;
  answers: Answers;
  finishedAt: string;
}

export const AttemptInputSchema = z.object({
  id: z.uuid(),
  slug: z.string().max(100),
  answers: z.record(z.string().max(100), z.union([z.string().max(100), z.array(z.string().max(100)).max(20)])),
  finishedAt: z.iso.datetime(),
});
export type AttemptInput = z.infer<typeof AttemptInputSchema>;

/**
 * Сохраняет попытки пользователя. Балл пересчитывается на сервере — присланному
 * клиентом не доверяем. Повторная отправка той же попытки ничего не меняет.
 * Возвращает число реально добавленных записей.
 */
export async function saveAttempts(userId: string, attempts: AttemptInput[]): Promise<number> {
  let inserted = 0;
  for (const a of attempts) {
    const clinicalCase = getCase(a.slug);
    if (!clinicalCase) continue;
    const score = scoreCase(clinicalCase, a.answers).score;
    const res = await pool.query(
      `INSERT INTO attempts (id, user_id, slug, score, answers, finished_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, userId, a.slug, score, JSON.stringify(a.answers), a.finishedAt],
    );
    inserted += res.rowCount ?? 0;
  }
  return inserted;
}

function toStored(row: { id: string; slug: string; score: number; answers: Answers; finished_at: Date }): StoredAttempt {
  return { id: row.id, slug: row.slug, score: row.score, answers: row.answers, finishedAt: row.finished_at.toISOString() };
}

export async function listAttempts(userId: string): Promise<StoredAttempt[]> {
  const res = await pool.query(
    `SELECT id, slug, score, answers, finished_at FROM attempts WHERE user_id = $1 ORDER BY finished_at ASC LIMIT 500`,
    [userId],
  );
  return res.rows.map(toStored);
}

export async function getAttempt(userId: string, id: string): Promise<StoredAttempt | null> {
  const res = await pool.query(
    `SELECT id, slug, score, answers, finished_at FROM attempts WHERE user_id = $1 AND id = $2`,
    [userId, id],
  );
  return res.rows[0] ? toStored(res.rows[0]) : null;
}

/** Разбор кешируется отдельно на каждый язык: переключивший язык получает разбор на новом языке. */
export async function getCachedReview(attemptId: string, locale: Locale): Promise<Review | null> {
  const res = await pool.query(`SELECT review FROM ai_reviews WHERE attempt_id = $1 AND locale = $2`, [attemptId, locale]);
  return res.rows[0]?.review ?? null;
}

export async function saveReview(userId: string, attemptId: string, locale: Locale, review: Review): Promise<void> {
  await pool.query(
    `INSERT INTO ai_reviews (attempt_id, locale, user_id, review) VALUES ($1, $2, $3, $4) ON CONFLICT (attempt_id, locale) DO NOTHING`,
    [attemptId, locale, userId, JSON.stringify(review)],
  );
}

export async function reviewsInLastDay(userId: string): Promise<number> {
  const res = await pool.query(
    `SELECT count(*)::int AS n FROM ai_reviews WHERE user_id = $1 AND created_at > now() - interval '24 hours'`,
    [userId],
  );
  return res.rows[0].n;
}
