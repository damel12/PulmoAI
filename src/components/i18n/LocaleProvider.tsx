"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { type Dict, getDict } from "@/lib/i18n/dictionaries";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Язык приходит с сервера (cookie). Словари с функциями не сериализуются, поэтому передаём только код языка. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT(): Dict {
  return getDict(useLocale());
}
