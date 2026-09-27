"use client";

import { ArrowRight, CheckCircle2, CircleAlert, CircleX, CloudUpload, Loader2, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { authClient } from "@/lib/auth-client";
import { getCases } from "@/lib/cases";
import type { ClinicalCase } from "@/lib/cases/types";
import type { Dict } from "@/lib/i18n/dictionaries";
import { clearDiagnosisNote, loadDiagnosisNote, saveDiagnosisNote, type Attempt } from "@/lib/progress";
import { loginHref } from "@/lib/redirect";
import type { Review } from "@/lib/review";
import type { CaseResult, QuestionResult, Verdict } from "@/lib/scoring";
import { uploadAttempts } from "@/lib/sync";

const VERDICT: Record<Verdict, { icon: typeof CheckCircle2; className: string }> = {
  correct: { icon: CheckCircle2, className: "text-emerald-700" },
  partial: { icon: CircleAlert, className: "text-amber-600" },
  wrong: { icon: CircleX, className: "text-rose-600" },
  unanswered: { icon: CircleX, className: "text-slate-500" },
};

function headline(score: number, t: Dict): string {
  if (score >= 90) return t.result.headline.great;
  if (score >= 60) return t.result.headline.good;
  return t.result.headline.poor;
}

type ReviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; review: Review }
  | { status: "error"; message: string };

type SaveState = "idle" | "saving" | "saved" | "error";

export function ResultView({
  clinicalCase,
  result,
  attempt,
  autoReview,
  onRestart,
}: {
  clinicalCase: ClinicalCase;
  result: CaseResult;
  attempt: Attempt;
  /** Пользователь нажал «Получить разбор» до входа — после входа запускаем сам. */
  autoReview: boolean;
  onRestart: () => void;
}) {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const { data: session, isPending } = authClient.useSession();
  const loggedIn = Boolean(session);
  const [review, setReview] = useState<ReviewState>({ status: "idle" });
  const [save, setSave] = useState<SaveState>("idle");
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState(false);
  const autoStarted = useRef(false);

  // Черновик формулировки диагноза переживает переход на страницу входа и обратно.
  useEffect(() => {
    setNote(loadDiagnosisNote(attempt.id));
  }, [attempt.id]);
  const resultPath = `/cases/${clinicalCase.slug}?attempt=${attempt.id}`;
  const cases = getCases(locale);
  const nextCase = cases[cases.findIndex((c) => c.slug === clinicalCase.slug) + 1];

  // Вошедшему пользователю сразу сохраняем результат в аккаунт.
  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    setSave("saving");
    uploadAttempts([attempt])
      .then(() => !cancelled && setSave("saved"))
      .catch(() => !cancelled && setSave("error"));
    return () => {
      cancelled = true;
    };
  }, [loggedIn, attempt]);

  const requestReview = useCallback(async () => {
    if (!note.trim()) {
      setNoteError(true);
      return;
    }
    setNoteError(false);
    if (!loggedIn) {
      saveDiagnosisNote(attempt.id, note);
      router.push(loginHref(`${resultPath}&review=1`));
      return;
    }
    setReview({ status: "loading" });
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: attempt.id, diagnosisNote: note.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 401) {
        saveDiagnosisNote(attempt.id, note);
        router.push(loginHref(`${resultPath}&review=1`));
        return;
      }
      if (!res.ok) throw new Error(body.error ?? t.result.aiFailed);
      clearDiagnosisNote(attempt.id);
      setReview({ status: "done", review: body.review });
    } catch (err) {
      setReview({ status: "error", message: err instanceof Error ? err.message : t.result.aiFailed });
    }
  }, [loggedIn, router, resultPath, attempt.id, note, t]);

  // Разбор после возврата со входа: ждём, пока попытка сохранится в аккаунте.
  useEffect(() => {
    if (!autoReview || autoStarted.current || save !== "saved") return;
    autoStarted.current = true;
    window.history.replaceState(null, "", resultPath);
    void requestReview();
  }, [autoReview, save, requestReview, resultPath]);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-ink text-white">
        <div className="ornament opacity-60" />
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">{t.result.rubric}</p>
            <h2 className="mt-1 font-heading text-2xl font-extrabold sm:text-3xl">{headline(result.score, t)}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">{clinicalCase.takeaway}</p>
          </div>
          <div className="text-center md:border-l md:border-slate-700 md:pl-8">
            <p className="text-xs text-slate-400">{t.result.score}</p>
            <p className="font-heading text-6xl font-extrabold text-gold tabular-nums">{result.score}</p>
            <p className="text-xs text-slate-400">{t.result.of100}</p>
          </div>
        </div>
      </div>

      {!isPending && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" aria-live="polite">
          <CloudUpload className="h-4 w-4 shrink-0 text-sky-dark" aria-hidden />
          {!loggedIn ? (
            <span className="text-slate-600">
              {t.result.savedLocal}{" "}
              <Link href={loginHref(resultPath)} className="font-bold text-sky-dark underline">
                {t.result.loginToSave}
              </Link>
            </span>
          ) : save === "saved" ? (
            <span className="font-semibold text-emerald-700">{t.result.savedAccount}</span>
          ) : save === "error" ? (
            <span className="text-rose-700">{t.result.saveError}</span>
          ) : (
            <span className="text-slate-500">{t.result.saving}</span>
          )}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-ink">{t.result.answers}</h2>
        {result.questions.map((q) => (
          <QuestionReview key={q.questionId} result={q} t={t} />
        ))}
      </div>

      <div className="rounded-2xl border border-sky/40 bg-sky-light p-5">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-ink">
          <Sparkles className="h-4 w-4 text-sky-dark" aria-hidden /> {t.result.aiTitle}
        </h2>
        <p className="text-sm text-slate-600">
          {loggedIn || isPending ? t.result.aiDescription : t.result.aiDescriptionGuest}
        </p>

        {review.status !== "done" && (
          <div className="mt-4">
            <label htmlFor="diagnosis-note" className="text-sm font-bold text-ink">
              {t.result.diagnosisNoteAsk}
            </label>
            <p className="mb-2 mt-1 text-xs text-slate-500">{t.result.diagnosisNoteAskHint}</p>
            <textarea
              id="diagnosis-note"
              rows={3}
              maxLength={600}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.result.diagnosisNoteAskPlaceholder}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky/20 ${
                noteError ? "border-rose-300" : "border-slate-300 focus:border-sky"
              }`}
            />
            {noteError && <p className="mt-2 text-xs font-semibold text-rose-600">{t.result.diagnosisNoteAskRequired}</p>}
            <button
              type="button"
              onClick={requestReview}
              disabled={review.status === "loading" || isPending || (loggedIn && save === "saving")}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-sky px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-dark disabled:opacity-70"
            >
              {review.status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {review.status === "loading" ? t.result.aiLoading : loggedIn || isPending ? t.result.aiGet : t.result.aiLoginGet}
            </button>
          </div>
        )}
        {review.status === "error" && (
          <p className="mt-3 rounded-xl bg-white p-3 text-sm text-rose-700" role="alert">
            {review.message}
          </p>
        )}
        {review.status === "done" && <AiReview review={review.review} t={t} />}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-ink hover:border-slate-400"
        >
          <RotateCcw className="h-4 w-4" /> {t.result.restart}
        </button>
        <Link
          href="/cases"
          className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-ink hover:border-slate-400"
        >
          {t.result.toList}
        </Link>
        {nextCase && (
          <Link
            href={`/cases/${nextCase.slug}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white sm:ml-auto"
          >
            {t.result.nextCase(nextCase.number)} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function QuestionReview({ result, t }: { result: QuestionResult; t: Dict }) {
  const verdict = VERDICT[result.verdict];
  const Icon = verdict.icon;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-heading text-sm font-bold text-ink">{result.text}</p>
        <span className={`flex shrink-0 items-center gap-1 text-xs font-bold ${verdict.className}`}>
          <Icon className="h-4 w-4" aria-hidden /> {t.result.verdict[result.verdict]} · {Math.round(result.earned)}/{result.weight}
        </span>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {result.chosen.map((o) => (
          <li key={o.id} className="rounded-xl bg-slate-50 p-3">
            <p className="font-semibold text-ink">{t.result.yourAnswer}: {o.label}</p>
            {o.feedback && <p className="mt-1 leading-relaxed text-slate-600">{o.feedback}</p>}
          </li>
        ))}
        {result.missed.map((o) => (
          <li key={o.id} className="rounded-xl bg-emerald-50 p-3">
            <p className="font-semibold text-emerald-800">
              {result.chosen.length && result.verdict !== "partial" ? t.result.correctAnswer : t.result.shouldChoose}: {o.label}
            </p>
            {o.feedback && <p className="mt-1 leading-relaxed text-slate-600">{o.feedback}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AiReview({ review, t }: { review: Review; t: Dict }) {
  return (
    <div className="mt-4 space-y-4 rounded-xl bg-white p-4 text-sm leading-relaxed text-slate-700">
      <p>{review.summary}</p>
      {review.diagnosisNote && (
        <div className="rounded-xl border border-sky/30 bg-sky-light/50 p-3">
          <h3 className="font-semibold text-sky-dark">{t.result.diagnosisNoteTitle}</h3>
          {review.diagnosisNote.whatsRight.length > 0 && (
            <>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                {t.result.diagnosisNoteRight}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {review.diagnosisNote.whatsRight.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
          {review.diagnosisNote.whatsMissing.length > 0 && (
            <>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
                {t.result.diagnosisNoteMissing}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {review.diagnosisNote.whatsMissing.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink">{t.result.diagnosisNoteCorrected}</p>
          <p className="mt-1">{review.diagnosisNote.corrected}</p>
        </div>
      )}
      {review.strengths.length > 0 && (
        <div>
          <h3 className="font-semibold text-emerald-800">{t.result.strengths}</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {review.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {review.mistakes.length > 0 && (
        <div>
          <h3 className="font-semibold text-rose-700">{t.result.mistakes}</h3>
          <ul className="mt-1 space-y-2">
            {review.mistakes.map((m) => (
              <li key={m.topic}>
                <span className="font-semibold text-ink">{m.topic}. </span>
                {m.explanation}
              </li>
            ))}
          </ul>
        </div>
      )}
      {review.nextSteps.length > 0 && (
        <div>
          <h3 className="font-semibold text-sky-dark">{t.result.nextSteps}</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {review.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-slate-400">{t.result.aiNote}</p>
    </div>
  );
}
