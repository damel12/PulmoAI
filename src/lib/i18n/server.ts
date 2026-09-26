import { cookies, headers } from "next/headers";
import { type Locale, LOCALE_COOKIE, isLocale, localeFromAcceptLanguage } from "./config";
import { getDict } from "./dictionaries";

/** Язык запроса: выбранный пользователем (cookie), иначе — по настройкам браузера. */
export async function getLocale(): Promise<Locale> {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  return localeFromAcceptLanguage((await headers()).get("accept-language"));
}

export async function getT() {
  return getDict(await getLocale());
}
