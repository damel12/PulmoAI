import { z } from "zod";
import type { ClinicalCase } from "./cases/types";
import type { Locale } from "./i18n/config";
import { getDict } from "./i18n/dictionaries";
import type { CaseResult } from "./scoring";

export const ReviewSchema = z.object({
  summary: z.string().describe("2–3 предложения: общая оценка решения студента"),
  strengths: z.array(z.string()).describe("Что студент сделал правильно, конкретно по его ответам"),
  mistakes: z
    .array(z.object({ topic: z.string(), explanation: z.string() }))
    .describe("Разбор каждой ошибки: почему неверно и как рассуждать правильно. Пусто, если ошибок нет"),
  nextSteps: z.array(z.string()).describe("1–3 темы, которые стоит повторить"),
  diagnosisNote: z
    .object({
      whatsRight: z.array(z.string()).describe("Что в собственной формулировке студента верно"),
      whatsMissing: z
        .array(z.string())
        .describe("Чего не хватает по сравнению с эталонным диагнозом: локализация, тяжесть, осложнения, степень ДН и т.п."),
      corrected: z.string().describe("Короткая исправленная формулировка диагноза с учётом этих замечаний"),
    })
    .nullable()
    .describe(
      "Разбор формулировки диагноза, которую студент написал сам своими словами перед разбором (<student_diagnosis_note> во входных данных). null, если такой формулировки не было",
    ),
});

export type Review = z.infer<typeof ReviewSchema>;

const LANGUAGE_RULE: Record<Locale, string> = {
  ru: "Пиши по-русски, обращайся к студенту на «вы»",
  kk: "Пиши на казахском языке (қазақ тілінде), обращайся к студенту на «сіз». Медицинские термины и сокращения — как в клинических протоколах МЗ РК на казахском языке",
  en: "Write in English and address the student as “you”",
};

export function reviewSystemPrompt(locale: Locale): string {
  return `Ты — опытный пульмонолог и наставник резидентов. Ты разбираешь решение учебного клинического кейса.

Балл и правильность каждого ответа уже определены по рубрике, проверенной врачами. Не пересматривай их и не называй другой правильный ответ — объясняй, почему рубрика права. Опирайся только на данные кейса, которые тебе переданы; не придумывай новых симптомов или результатов.

Если во входных данных есть блок <student_diagnosis_note> — это диагноз, который студент сформулировал сам, своими словами, перед тем как получить этот разбор. Разбери его отдельно в поле diagnosisNote: сравни с эталонным диагнозом (строка «Эталонный вывод» в блоке <case>), отметь, что в формулировке студента верно, чего не хватает (например, не указана локализация, степень тяжести, осложнения, степень дыхательной недостаточности), и дай короткую исправленную версию его же формулировки. Если блока <student_diagnosis_note> нет, верни diagnosisNote: null.

${LANGUAGE_RULE[locale]}, как коллега-наставник: конкретно, без общих фраз и без лишней похвалы. Если ответ был неверным, покажи, какие данные кейса должны были навести на правильное решение.`;
}

function describeCase(c: ClinicalCase, locale: Locale): string {
  const t = getDict(locale);
  const lines: string[] = [
    `Кейс №${c.number}: ${c.title} (${c.topic})`,
    `Пациент: ${c.patient.name}, ${t.patient.age(c.patient.age)}, ${t.patient.sex[c.patient.sex]}.`,
  ];
  for (const step of c.steps) {
    if (step.kind === "history") {
      lines.push(`Жалобы: ${step.complaints.join("; ")}.`);
      lines.push(`Анамнез: ${step.anamnesis}`);
      if (step.lifeHistory) lines.push(`Анамнез жизни: ${step.lifeHistory}`);
      if (step.allergy) lines.push(`Аллергологический анамнез: ${step.allergy}`);
      lines.push(`Осмотр: ${step.exam.join("; ")}.`);
      lines.push(`Витальные показатели: ${step.vitals.map((v) => `${v.label} ${v.value} ${v.unit ?? ""}`.trim()).join(", ")}.`);
    } else if (step.kind === "findings") {
      if (step.labs) lines.push(`Лабораторные данные: ${step.labs.join(" ")}`);
      if (step.studies) lines.push(`Инструментальные данные: ${step.studies.join(" ")}`);
    }
  }
  lines.push(`Эталонный вывод: ${c.takeaway}`);
  return lines.join("\n");
}

function describeResult(result: CaseResult): string {
  return result.questions
    .map((q) => {
      const chosen = q.chosen.length ? q.chosen.map((o) => o.label).join(", ") : "нет ответа";
      const missed = q.missed.length ? ` Правильно / пропущено: ${q.missed.map((o) => o.label).join(", ")}.` : "";
      const notes = [...q.chosen, ...q.missed]
        .filter((o) => o.feedback)
        .map((o) => `«${o.label}»: ${o.feedback}`)
        .join(" ");
      return `Вопрос «${q.text}» (вес ${q.weight}): ответ студента — ${chosen}. Итог: ${q.verdict}.${missed} Комментарии рубрики: ${notes}`;
    })
    .join("\n");
}

export function buildReviewPrompt(c: ClinicalCase, result: CaseResult, locale: Locale, diagnosisNote?: string): string {
  const notePart = diagnosisNote?.trim() ? `\n\n<student_diagnosis_note>\n${diagnosisNote.trim()}\n</student_diagnosis_note>` : "";
  return `<case>\n${describeCase(c, locale)}\n</case>\n\n<student_answers score="${result.score}">\n${describeResult(result)}\n</student_answers>${notePart}\n\nСоставь персональный разбор решения студента.`;
}
