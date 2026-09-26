import { describe, expect, it } from "vitest";
import { caseQuestions, getCases } from "../cases";
import { DIAGNOSES } from "../cases/diagnoses";
import type { ClinicalCase } from "../cases/types";
import { LOCALES, localeFromAcceptLanguage } from "./config";
import { getDict } from "./dictionaries";

/** Форма словаря: ключи и типы значений (строка/функция/массив) без самих текстов. */
function shape(value: unknown): unknown {
  if (typeof value === "function") return "fn";
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  }
  return typeof value;
}

/** Всё, что не должно меняться при переводе кейса: структура, ответы, снимки, числа. */
function skeleton(c: ClinicalCase) {
  const digits = (s: string) => s.replace(/\D/g, "");
  return {
    slug: c.slug,
    number: c.number,
    difficulty: c.difficulty,
    minutes: c.minutes,
    age: c.patient.age,
    sex: c.patient.sex,
    patientPhoto: c.patient.photo,
    cover: c.cover,
    steps: c.steps.map((s) => {
      if (s.kind === "history") return { kind: s.kind, vitals: s.vitals.map((v) => digits(v.value)) };
      if (s.kind === "findings")
        return {
          kind: s.kind,
          labs: s.labs?.length,
          studies: s.studies?.length,
          photos: s.photos.map((p) => ({ kind: p.kind, image: p.image, annotated: p.annotated, audio: p.audio })),
        };
      return {
        kind: s.kind,
        questions: s.questions.map((q) => ({
          id: q.id,
          type: q.type,
          weight: q.weight,
          correct: q.type === "single" ? q.correctId : q.requiredIds,
          options: q.options.map((o) => ({ id: o.id, feedback: Boolean(o.feedback) })),
        })),
      };
    }),
  };
}

describe("словари", () => {
  it("казахский и английский содержат все ключи русского", () => {
    const ru = shape(getDict("ru"));
    for (const locale of LOCALES) expect(shape(getDict(locale)), locale).toEqual(ru);
  });

  it("склоняют возраст", () => {
    expect([21, 54, 67, 71, 11, 12].map(getDict("ru").patient.age)).toEqual([
      "21 год",
      "54 года",
      "67 лет",
      "71 год",
      "11 лет",
      "12 лет",
    ]);
    expect(getDict("kk").patient.age(54)).toBe("54 жас");
    expect(getDict("en").patient.age(54)).toBe("54 years");
  });
});

describe("переводы кейсов", () => {
  const ru = getCases("ru");

  for (const locale of ["kk", "en"] as const) {
    it(`${locale}: структура, ответы, снимки и числа совпадают с оригиналом`, () => {
      const tr = getCases(locale);
      expect(tr.map(skeleton)).toEqual(ru.map(skeleton));
    });

    it(`${locale}: нет непереведённого русского текста`, () => {
      // В казахском кириллица своя, поэтому ищем буквы, которых в казахском алфавите нет.
      const text = JSON.stringify(getCases(locale)) + JSON.stringify(DIAGNOSES[locale]);
      if (locale === "en") expect(text).not.toMatch(/[А-Яа-яЁё]/);
      else expect(text).not.toMatch(/(?<!\p{L})(?:пациент|кашель|одышка|лечение|мокрота|лёгкого|степени|перорально|сутки)(?!\p{L})/iu);
    });

    it(`${locale}: итоговый диагноз совпадает с правильным вариантом списка`, () => {
      for (const c of getCases(locale)) {
        const dx = caseQuestions(c).find((q) => q.id === "diagnosis")!;
        expect(dx.options.find((o) => dx.type === "single" && o.id === dx.correctId)!.label).toBe(c.takeaway);
      }
    });
  }

  it("в каждом языке по 26 диагнозов", () => {
    for (const locale of LOCALES) expect(DIAGNOSES[locale]).toHaveLength(26);
  });
});

describe("localeFromAcceptLanguage", () => {
  it("выбирает казахский, если он выше русского, иначе русский", () => {
    expect(localeFromAcceptLanguage("kk-KZ,kk;q=0.9,ru;q=0.8")).toBe("kk");
    expect(localeFromAcceptLanguage("ru-RU,ru;q=0.9,kk;q=0.8")).toBe("ru");
    expect(localeFromAcceptLanguage("en-US,kk;q=0.5")).toBe("kk");
    expect(localeFromAcceptLanguage("de-DE,en;q=0.5,ru;q=0.9")).toBe("ru");
    expect(localeFromAcceptLanguage(null)).toBe("ru");
  });

  it("английский сам не включает — только по выбору пользователя", () => {
    expect(localeFromAcceptLanguage("en-US,en;q=0.9")).toBe("ru");
  });
});
