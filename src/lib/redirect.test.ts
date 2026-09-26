import { describe, expect, it } from "vitest";
import { loginHref, safeNext } from "./redirect";

describe("safeNext", () => {
  it("пропускает пути внутри сайта вместе с параметрами", () => {
    expect(safeNext("/cases/pulmonary-embolism?attempt=1&review=1")).toBe("/cases/pulmonary-embolism?attempt=1&review=1");
  });

  it("не даёт увести пользователя на чужой сайт", () => {
    for (const bad of ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", ""]) {
      expect(safeNext(bad)).toBe("/");
    }
    expect(safeNext(null, "/profile")).toBe("/profile");
  });

  it("не пропускает обход через табуляцию и переводы строк, которые браузер уберёт сам", () => {
    // Формально не начинается с "//", но после того как браузер по спецификации URL уберёт
    // управляющие символы, превращается в протокол-независимую ссылку "//evil.example".
    for (const bad of ["/\t/evil.example", "/\n/evil.example", "/\r/evil.example", "/\t\t//evil.example"]) {
      expect(safeNext(bad)).toBe("/");
    }
  });

  it("убирает управляющие символы из разрешённого пути, а не пропускает их как есть", () => {
    expect(safeNext("/cases/case-1\t?attempt=1")).toBe("/cases/case-1?attempt=1");
  });

  it("кодирует адрес возврата в ссылке на вход", () => {
    expect(loginHref("/cases/x?attempt=1&review=1")).toBe("/login?next=%2Fcases%2Fx%3Fattempt%3D1%26review%3D1");
  });
});
