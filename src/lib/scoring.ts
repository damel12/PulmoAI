import { caseQuestions } from "./cases";
import type { Answers, ChoiceOption, ClinicalCase, Question } from "./cases/types";

export type Verdict = "correct" | "partial" | "wrong" | "unanswered";

export interface QuestionResult {
  questionId: string;
  text: string;
  verdict: Verdict;
  earned: number;
  weight: number;
  chosen: ChoiceOption[];
  /** Для single — правильный вариант; для multi — обязательные, которые студент пропустил. */
  missed: ChoiceOption[];
}

export interface CaseResult {
  score: number;
  questions: QuestionResult[];
}

function asArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function scoreQuestion(q: Question, answer: string | string[] | undefined): QuestionResult {
  const byId = new Map(q.options.map((o) => [o.id, o]));
  // Неизвестные id отбрасываем: ответ приходит от клиента и может быть подделан.
  const chosenIds = [...new Set(asArray(answer))].filter((id) => byId.has(id));
  const chosen = chosenIds.map((id) => byId.get(id)!);
  const base = { questionId: q.id, text: q.text, weight: q.weight, chosen };

  if (q.type === "single") {
    const correct = byId.get(q.correctId)!;
    if (chosenIds.length === 0) return { ...base, verdict: "unanswered", earned: 0, missed: [correct] };
    const ok = chosenIds.length === 1 && chosenIds[0] === q.correctId;
    return { ...base, verdict: ok ? "correct" : "wrong", earned: ok ? q.weight : 0, missed: ok ? [] : [correct] };
  }

  const missed = q.requiredIds.filter((id) => !chosenIds.includes(id)).map((id) => byId.get(id)!);
  if (chosenIds.length === 0) return { ...base, verdict: "unanswered", earned: 0, missed };
  const found = q.requiredIds.length - missed.length;
  const earned = (q.weight * found) / q.requiredIds.length;
  const verdict: Verdict = missed.length === 0 ? "correct" : found > 0 ? "partial" : "wrong";
  return { ...base, verdict, earned, missed };
}

export function scoreCase(c: ClinicalCase, answers: Answers): CaseResult {
  const questions = caseQuestions(c).map((q) => scoreQuestion(q, answers[q.id]));
  const total = questions.reduce((sum, r) => sum + r.weight, 0);
  const earned = questions.reduce((sum, r) => sum + r.earned, 0);
  return { score: total === 0 ? 0 : Math.round((earned / total) * 100), questions };
}

export function isAnswered(q: Question, answer: string | string[] | undefined): boolean {
  return asArray(answer).length > 0 && (q.type === "multi" || asArray(answer).length === 1);
}
