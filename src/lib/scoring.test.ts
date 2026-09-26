import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { caseQuestions, cases, getCase } from "./cases";
import { scoreCase } from "./scoring";

import type { ClinicalCase } from "./cases/types";

const case1 = getCase("case-1")!;
const reference = { diagnosis: "dx-1", t1: "b", t2: "c", t3: "b", t4: "c", t5: "b" };

// Вопросов с несколькими ответами в материалах заказчика пока нет — проверяем движок на мини-кейсе.
const multiCase: ClinicalCase = {
  ...case1,
  slug: "multi-test",
  steps: [
    {
      kind: "questions",
      title: "Обследование",
      intro: "",
      questions: [
        {
          id: "workup",
          type: "multi",
          text: "Что назначить",
          weight: 30,
          requiredIds: ["xray", "cbc", "crp"],
          options: ["xray", "cbc", "crp", "ct"].map((id) => ({ id, label: id })),
        },
        {
          id: "dx",
          type: "single",
          text: "Диагноз",
          weight: 70,
          correctId: "a",
          options: ["a", "b"].map((id) => ({ id, label: id })),
        },
      ],
    },
  ],
};

describe("scoreCase", () => {
  it("даёт 100 за эталонное решение", () => {
    expect(scoreCase(case1, reference).score).toBe(100);
  });

  it("даёт 0 за пустые ответы и помечает их как неотвеченные", () => {
    const result = scoreCase(case1, {});
    expect(result.score).toBe(0);
    expect(result.questions.every((q) => q.verdict === "unanswered")).toBe(true);
  });

  it("считает вес каждого вопроса отдельно", () => {
    // диагноз 25 + три вопроса по лечению по 15 = 70
    const result = scoreCase(case1, { ...reference, t1: "d", t2: "a" });
    expect(result.score).toBe(70);
    expect(result.questions.find((q) => q.questionId === "t1")!.missed[0].id).toBe("b");
  });

  it("начисляет частичный балл за неполный список обследований и не штрафует за лишние", () => {
    const partial = scoreCase(multiCase, { workup: ["xray", "cbc", "ct"], dx: "a" });
    const workup = partial.questions.find((q) => q.questionId === "workup")!;
    expect(workup.verdict).toBe("partial");
    expect(workup.missed.map((o) => o.id)).toEqual(["crp"]);
    // 30 * 2/3 + 70 = 90
    expect(partial.score).toBe(90);
  });

  it("игнорирует подделанные id и несколько ответов на single-вопрос", () => {
    const forged = scoreCase(case1, { ...reference, diagnosis: ["dx-1", "dx-2"], t1: "hacked" });
    expect(forged.questions.find((q) => q.questionId === "diagnosis")!.verdict).toBe("wrong");
    expect(forged.questions.find((q) => q.questionId === "t1")!.verdict).toBe("unanswered");
  });
});

describe("данные кейсов", () => {
  it("имеют уникальные slug и номера", () => {
    expect(new Set(cases.map((c) => c.slug)).size).toBe(cases.length);
    expect(new Set(cases.map((c) => c.number)).size).toBe(cases.length);
  });

  for (const c of cases) {
    it(`${c.slug}: правильные ответы ссылаются на существующие варианты`, () => {
      const questions = caseQuestions(c);
      expect(questions.length).toBeGreaterThan(0);
      expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
      for (const q of questions) {
        const ids = q.options.map((o) => o.id);
        expect(new Set(ids).size).toBe(ids.length);
        const correct = q.type === "single" ? [q.correctId] : q.requiredIds;
        expect(correct.length).toBeGreaterThan(0);
        for (const id of correct) expect(ids).toContain(id);
      }
    });

    it(`${c.slug}: эталонное решение даёт 100`, () => {
      const answers = Object.fromEntries(
        caseQuestions(c).map((q) => [q.id, q.type === "single" ? q.correctId : q.requiredIds]),
      );
      expect(scoreCase(c, answers).score).toBe(100);
    });

    it(`${c.slug}: файлы снимков существуют`, () => {
      const pictures = [
        c.cover,
        c.patient.photo,
        ...c.steps.flatMap((s) => (s.kind === "findings" ? (s.photos ?? []) : []).flatMap((p) => [p.image, p.annotated])),
      ];
      for (const p of pictures) if (p) expect(existsSync(join("public", p.src)), p.src).toBe(true);
    });

    it(`${c.slug}: файлы аускультации существуют`, () => {
      const audios = c.steps.flatMap((s) => (s.kind === "findings" ? (s.photos ?? []) : []).map((p) => p.audio));
      for (const src of audios) if (src) expect(existsSync(join("public", src)), src).toBe(true);
    });
  }
});

describe("кейсы заказчика", () => {
  it("все пять на месте и у каждого свой правильный диагноз из общего списка", () => {
    expect(cases.map((c) => c.number)).toEqual([1, 2, 3, 4, 5]);
    for (const c of cases) {
      const dx = caseQuestions(c).find((q) => q.id === "diagnosis")!;
      expect(dx.type === "single" && dx.correctId).toBe(`dx-${c.number}`);
      expect(dx.options).toHaveLength(26);
      // Эталонный диагноз в разборе совпадает с правильным вариантом списка
      expect(dx.options.find((o) => o.id === `dx-${c.number}`)!.label).toBe(c.takeaway);
    }
  });

  it("в каждом кейсе 5 вопросов по лечению с пояснением к правильному ответу", () => {
    for (const c of cases) {
      const treatment = caseQuestions(c).filter((q) => q.id !== "diagnosis");
      expect(treatment).toHaveLength(5);
      for (const q of treatment) {
        expect(q.options).toHaveLength(5);
        const correct = q.options.find((o) => q.type === "single" && o.id === q.correctId)!;
        expect(correct.feedback, `${c.slug}/${q.id}`).toBeTruthy();
      }
    }
  });

  it("в тексте не осталось LaTeX-разметки из документа", () => {
    const text = JSON.stringify(cases);
    expect(text).not.toMatch(/\\(text|circ|ge|%|\s)|\{,\}|_2|SpO_/);
  });
});
