"use client";

import { ChevronDown, ClipboardList, Lightbulb, Lock } from "lucide-react";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { PhotoViewer } from "@/components/media/PhotoViewer";
import { diagnosisTreatmentText } from "@/lib/cases/diagnoses";
import type { Answers, FindingsStep, HistoryStep, Question, QuestionsStep } from "@/lib/cases/types";
import { isAnswered } from "@/lib/scoring";
import { shuffled } from "@/lib/shuffle";
import { DocLines, Section, VitalsGrid } from "./ClinicalBlocks";

/** Больше вариантов — уже неудобно листать радиокнопками, компактнее выпадающий список. */
const DROPDOWN_THRESHOLD = 8;

/** Один пункт — абзацем, несколько — списком. */
function TextList({ items }: { items: string[] }) {
  if (items.length === 1) return <p className="text-sm leading-relaxed text-slate-700">{items[0]}</p>;
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function HistoryView({ step }: { step: HistoryStep }) {
  const t = useT();
  return (
    <div className="space-y-4">
      <VitalsGrid vitals={step.vitals} />
      <div className="grid gap-4 md:grid-cols-2">
        <Section title={t.history.complaints}>
          <TextList items={step.complaints} />
        </Section>
        <Section title={t.history.exam}>
          <TextList items={step.exam} />
        </Section>
      </div>
      <Section title={step.lifeHistory ? t.history.diseaseHistory : t.history.anamnesis}>
        <p className="text-sm leading-relaxed text-slate-700">{step.anamnesis}</p>
      </Section>
      {(step.lifeHistory || step.allergy) && (
        <div className="grid gap-4 md:grid-cols-2">
          {step.lifeHistory && (
            <Section title={t.history.lifeHistory}>
              <p className="text-sm leading-relaxed text-slate-700">{step.lifeHistory}</p>
            </Section>
          )}
          {step.allergy && (
            <Section title={t.history.allergy}>
              <p className="text-sm leading-relaxed text-slate-700">{step.allergy}</p>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

export function FindingsView({ step }: { step: FindingsStep }) {
  const t = useT();
  return (
    <div className="space-y-4">
      {step.intro && <p className="text-sm text-slate-600">{step.intro}</p>}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {step.labs && <DocLines title={t.findings.labs} lines={step.labs} />}
        {step.studies && <DocLines title={t.findings.studies} lines={step.studies} />}
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {step.photos.map((photo) => (
          <PhotoViewer key={photo.image.src} photo={photo} />
        ))}
      </div>
      {step.hint && (
        <details className="group rounded-2xl border border-gold/60 bg-gold-light p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-gold-dark">
            <Lightbulb className="h-4 w-4" aria-hidden /> {t.findings.hint}
            <span className="ml-auto text-xs font-normal group-open:hidden">{t.findings.showHint}</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{step.hint}</p>
        </details>
      )}
    </div>
  );
}

export function QuestionsView({
  step,
  answers,
  onAnswer,
  showErrors,
  seed,
}: {
  step: QuestionsStep;
  answers: Answers;
  onAnswer: (questionId: string, value: string | string[]) => void;
  showErrors: boolean;
  /** Порядок вариантов на это прохождение; null — пока не известен, показываем как в кейсе. */
  seed: number | null;
}) {
  const locale = useLocale();
  const [diagnosisQuestion, ...rest] = step.questions;
  // Шаг «Диагноз и лечение»: тест по лечению открывается только после того, как выбран диагноз.
  const isDiagnosisAndTreatment = diagnosisQuestion?.id === "diagnosis" && rest.length > 0;

  if (!isDiagnosisAndTreatment) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{step.intro}</p>
        {step.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            index={i + 1}
            question={q}
            value={answers[q.id]}
            onAnswer={onAnswer}
            showError={showErrors}
            seed={seed}
          />
        ))}
      </div>
    );
  }

  const text = diagnosisTreatmentText(locale);
  const diagnosisAnswered = isAnswered(diagnosisQuestion, answers[diagnosisQuestion.id]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{step.intro}</p>
      <QuestionCard
        index={1}
        question={diagnosisQuestion}
        value={answers[diagnosisQuestion.id]}
        onAnswer={onAnswer}
        showError={showErrors}
        seed={seed}
      />
      {diagnosisAnswered ? (
        <div className="reveal space-y-4">
          <div className="flex items-center gap-2 border-t border-slate-200 pt-4">
            <ClipboardList className="h-4 w-4 text-sky" aria-hidden />
            <h3 className="font-heading text-sm font-bold text-ink">{text.txHeading}</h3>
          </div>
          <p className="text-sm text-slate-600">{text.txIntro}</p>
          {rest.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i + 2}
              question={q}
              value={answers[q.id]}
              onAnswer={onAnswer}
              showError={showErrors}
              seed={seed}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          <Lock className="h-4 w-4 shrink-0" aria-hidden />
          {text.txLocked}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  index,
  question,
  value,
  onAnswer,
  showError,
  seed,
}: {
  index: number;
  question: Question;
  value: string | string[] | undefined;
  onAnswer: (questionId: string, value: string | string[]) => void;
  showError: boolean;
  seed: number | null;
}) {
  const t = useT();
  const multi = question.type === "multi";
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);
  const missing = showError && selected.size === 0;
  // Длинный список (например, все 26 диагнозов) неудобно листать радиокнопками — выпадающий список компактнее.
  const asDropdown = !multi && question.options.length > DROPDOWN_THRESHOLD;
  const options = seed === null ? question.options : shuffled(question.options, seed, question.id);

  const toggle = (id: string) => {
    if (!multi) return onAnswer(question.id, id);
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onAnswer(question.id, [...next]);
  };

  return (
    <fieldset className={`rounded-2xl border bg-white p-4 ${missing ? "border-rose-300" : "border-slate-200"}`}>
      <legend className="sr-only">{question.text}</legend>
      <p className="font-heading text-sm font-bold text-ink" aria-hidden>
        {index}. {question.text}
      </p>
      {!asDropdown && <p className="mb-3 text-xs text-slate-500">{multi ? t.question.multi : t.question.single}</p>}
      {asDropdown ? (
        <div className="relative mt-2">
          <select
            aria-label={question.text}
            value={value && !Array.isArray(value) ? value : ""}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            className={`w-full appearance-none truncate rounded-xl border bg-white py-3 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-sky/20 ${
              missing ? "border-rose-300" : "border-slate-300 focus:border-sky"
            } ${value ? "text-ink" : "text-slate-400"}`}
          >
            <option value="" disabled>
              {t.question.selectPlaceholder}
            </option>
            {options.map((o) => (
              <option key={o.id} value={o.id} className="text-ink">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        </div>
      ) : (
        <div className="space-y-2">
          {options.map((o) => {
            const checked = selected.has(o.id);
            return (
              <label
                key={o.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${
                  checked ? "border-sky bg-sky-light text-ink" : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={question.id}
                  value={o.id}
                  checked={checked}
                  onChange={() => toggle(o.id)}
                  className="mt-0.5 h-4 w-4 accent-sky"
                />
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
      )}
      {missing && <p className="mt-2 text-xs font-semibold text-rose-600">{t.question.choose}</p>}
    </fieldset>
  );
}
