"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { authClient } from "@/lib/auth-client";
import type { Answers, ClinicalCase } from "@/lib/cases/types";
import { type Attempt, findAttempt, saveAttempt } from "@/lib/progress";
import { type CaseResult, isAnswered, scoreCase } from "@/lib/scoring";
import { PatientCard } from "./ClinicalBlocks";
import { ResultView } from "./ResultView";
import { FindingsView, HistoryView, QuestionsView } from "./StepViews";

export function CasePlayer({ clinicalCase }: { clinicalCase: ClinicalCase }) {
  const { steps } = clinicalCase;
  const t = useT();
  const [index, setIndex] = useState(0);
  const [reached, setReached] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showErrors, setShowErrors] = useState(false);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  // Случайный порядок вариантов выбираем в браузере после загрузки, иначе серверная
  // и клиентская разметка разойдутся. Вопросы начинаются не с первого шага, так что к ним он уже готов.
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => setSeed(Math.floor(Math.random() * 2 ** 31)), []);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt");
  const autoReview = searchParams.get("review") === "1";
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user.id;

  // Возврат на экран результата по ссылке ?attempt=… (например, после входа).
  // Сначала ищем попытку в браузере, затем — в аккаунте.
  useEffect(() => {
    if (!attemptId || attempt?.id === attemptId || isPending) return;
    let cancelled = false;
    const show = (a: Attempt) => {
      if (cancelled || a.slug !== clinicalCase.slug) return;
      setAnswers(a.answers);
      setResult(scoreCase(clinicalCase, a.answers));
      setAttempt(a);
    };
    const local = findAttempt(attemptId);
    if (local) show(local);
    else if (userId) {
      fetch(`/api/attempts?id=${encodeURIComponent(attemptId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((body) => body?.attempt && show({ ...body.attempt, synced: true }))
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [attemptId, attempt?.id, isPending, userId, clinicalCase]);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const goTo = (i: number) => {
    setIndex(i);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (step.kind === "questions" && !step.questions.every((q) => isAnswered(q, answers[q.id]))) {
      setShowErrors(true);
      return;
    }
    if (isLast) {
      const scored = scoreCase(clinicalCase, answers);
      const finished: Attempt = {
        id: crypto.randomUUID(),
        slug: clinicalCase.slug,
        score: scored.score,
        answers,
        finishedAt: new Date().toISOString(),
      };
      saveAttempt(finished);
      setAttempt(finished);
      setResult(scored);
      // Ссылка на результат: обновление страницы или вход не потеряют его.
      window.history.replaceState(null, "", `${pathname}?attempt=${finished.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setReached((r) => Math.max(r, index + 1));
    goTo(index + 1);
  };

  const restart = () => {
    setAnswers({});
    setSeed(Math.floor(Math.random() * 2 ** 31));
    setResult(null);
    setAttempt(null);
    window.history.replaceState(null, "", pathname);
    setReached(0);
    goTo(0);
  };

  const progress = result ? 100 : Math.round((index / steps.length) * 100);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sky-dark">
            {t.player.caseLabel(clinicalCase.number, clinicalCase.topic)}
          </p>
          <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{clinicalCase.title}</h1>
        </div>
        <div className="w-full md:w-64">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>{t.player.progress}</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-sky transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {t.player.translationNote && (
        <p className="rounded-xl border border-gold/60 bg-gold-light px-4 py-2.5 text-sm text-gold-dark">{t.player.translationNote}</p>
      )}

      <PatientCard patient={clinicalCase.patient} />

      <ol className="grid grid-cols-2 gap-2 sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none" aria-label={t.player.steps}>
        {[...steps.map((s) => s.title), t.player.reviewStep].map((title, i) => {
          const isResult = i === steps.length;
          const current = result ? isResult : i === index;
          const done = result ? !isResult : i < reached || i < index;
          const clickable = !result && !isResult && i <= reached;
          return (
            <li key={title}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => goTo(i)}
                aria-current={current ? "step" : undefined}
                className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left text-xs font-semibold transition-colors ${
                  current
                    ? "border-sky bg-sky-light text-sky-dark"
                    : done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                    current ? "bg-sky text-white" : done ? "bg-emerald-600 text-white" : "bg-slate-100"
                  }`}
                >
                  {done && !current ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {title}
              </button>
            </li>
          );
        })}
      </ol>

      {result && attempt ? (
        <ResultView clinicalCase={clinicalCase} result={result} attempt={attempt} autoReview={autoReview} onRestart={restart} />
      ) : (
        <>
          {step.kind === "history" && <HistoryView step={step} />}
          {step.kind === "findings" && <FindingsView step={step} />}
          {step.kind === "questions" && (
            <QuestionsView
              step={step}
              answers={answers}
              showErrors={showErrors}
              seed={seed}
              onAnswer={(id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))}
            />
          )}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:text-ink disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" /> {t.player.back}
            </button>
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 rounded-xl bg-sky px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-dark"
            >
              {isLast ? t.player.finish : t.player.next(steps[index + 1].title)}
              {isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
          {showErrors && (
            <p className="text-right text-xs font-semibold text-rose-600" role="alert">
              {t.player.answerAll}
            </p>
          )}
        </>
      )}
    </div>
  );
}
