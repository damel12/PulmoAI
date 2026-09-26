import type { Locale } from "../i18n/config";
import { case1 as en1 } from "./en/case-1";
import { case2 as en2 } from "./en/case-2";
import { case3 as en3 } from "./en/case-3";
import { case4 as en4 } from "./en/case-4";
import { case5 as en5 } from "./en/case-5";
import { case1 as kk1 } from "./kk/case-1";
import { case2 as kk2 } from "./kk/case-2";
import { case3 as kk3 } from "./kk/case-3";
import { case4 as kk4 } from "./kk/case-4";
import { case5 as kk5 } from "./kk/case-5";
import { case1 } from "./ru/case-1";
import { case2 } from "./ru/case-2";
import { case3 } from "./ru/case-3";
import { case4 } from "./ru/case-4";
import { case5 } from "./ru/case-5";
import type { ClinicalCase, Question } from "./types";

// Кейсы — из материалов заказчика («Сайт пульмо айтишникке.docx»). Русский — оригинал,
// казахский и английский — перевод с той же структурой (это проверяет scoring.test.ts).
const BY_LOCALE: Record<Locale, ClinicalCase[]> = {
  ru: [case1, case2, case3, case4, case5],
  kk: [kk1, kk2, kk3, kk4, kk5],
  en: [en1, en2, en3, en4, en5],
};

/** Русские кейсы. Для оценки ответов язык не важен: id и правильные ответы у всех языков общие. */
export const cases = BY_LOCALE.ru;

export function getCases(locale: Locale): ClinicalCase[] {
  return BY_LOCALE[locale];
}

export function getCase(slug: string, locale: Locale = "ru"): ClinicalCase | undefined {
  return BY_LOCALE[locale].find((c) => c.slug === slug);
}

export function caseQuestions(c: ClinicalCase): Question[] {
  return c.steps.flatMap((step) => (step.kind === "questions" ? step.questions : []));
}
