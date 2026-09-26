"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALES, LOCALE_COOKIE, LOCALE_LABEL, LOCALE_NAME, type Locale } from "@/lib/i18n/config";
import { useLocale, useT } from "./LocaleProvider";

/** Рус / Қаз / Eng. Выбор хранится в cookie на год; страница перерисовывается на сервере без перезагрузки. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const choose = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={`flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold ${pending ? "opacity-60" : ""} ${className}`}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          title={LOCALE_NAME[l]}
          aria-pressed={l === locale}
          onClick={() => choose(l)}
          className={`rounded-md px-2 py-1 transition-colors ${l === locale ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-ink"}`}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
