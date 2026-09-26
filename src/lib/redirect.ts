// Куда вернуть пользователя после входа. Разрешаем только пути внутри сайта:
// иначе ссылка вида /login?next=https://evil.example превращается в открытый редирект.
export function safeNext(next: string | null | undefined, fallback = "/"): string {
  if (!next) return fallback;
  // По спецификации URL браузер перед разбором убирает из строки табуляцию и переводы строк
  // (WHATWG URL, "remove all ASCII tab or newline"). Поэтому "/\t/evil.example" проходит проверку
  // ниже (не начинается с "//"), но после нормализации браузером превращается в "//evil.example" —
  // проверять и возвращать нужно уже очищенную строку, а не исходную.
  const cleaned = next.replace(/[\t\n\r]/g, "");
  if (!cleaned.startsWith("/") || cleaned.startsWith("//") || cleaned.startsWith("/\\")) return fallback;
  return cleaned;
}

export function loginHref(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}
