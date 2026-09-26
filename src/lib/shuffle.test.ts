import { describe, expect, it } from "vitest";
import { shuffled } from "./shuffle";

describe("shuffled", () => {
  const items = ["a", "b", "c", "d", "e"];

  it("сохраняет все элементы", () => {
    expect([...shuffled(items, 42, "q1")].sort()).toEqual(items);
  });

  it("даёт одинаковый порядок при одинаковых seed и salt", () => {
    expect(shuffled(items, 7, "q1")).toEqual(shuffled(items, 7, "q1"));
  });

  it("не оставляет правильный вариант всегда на одном месте", () => {
    const positions = new Set(Array.from({ length: 50 }, (_, seed) => shuffled(items, seed, "q1").indexOf("b")));
    expect(positions.size).toBe(items.length);
  });
});
