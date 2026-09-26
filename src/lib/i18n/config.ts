export const LOCALES = ["ru", "kk", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_COOKIE = "pulmoai.locale";

/** Подписи в переключателе языка. */
export const LOCALE_LABEL: Record<Locale, string> = { ru: "Рус", kk: "Қаз", en: "Eng" };
export const LOCALE_NAME: Record<Locale, string> = { ru: "Русский", kk: "Қазақша", en: "English" };

/** Для Intl (даты) и атрибута lang. */
export const LOCALE_TAG: Record<Locale, string> = { ru: "ru-RU", kk: "kk-KZ", en: "en-GB" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Язык по заголовку Accept-Language, если пользователь ещё не выбирал сам.
 * Английский сам не включаем: в Казахстане у многих английская ОС, но сайт им нужен на русском
 * или казахском. Казахский — если браузер ставит его выше русского; иначе русский.
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const langs = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .map((x) => x.lang);
  const kk = langs.indexOf("kk");
  const ru = langs.indexOf("ru");
  return kk !== -1 && (ru === -1 || kk < ru) ? "kk" : DEFAULT_LOCALE;
}
