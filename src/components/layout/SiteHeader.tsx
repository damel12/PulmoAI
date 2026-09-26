"use client";

import { Menu, Play, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { useNextCaseHref } from "@/lib/next-case";
import { Logo } from "./Logo";
import { NAV, isActive } from "./nav";
import { UserMenu } from "./UserMenu";

export function SiteHeader() {
  const pathname = usePathname();
  const t = useT();
  const locale = useLocale();
  const nextCase = useNextCaseHref();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="h-1 bg-sky" />
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo locale={locale} />
        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.main}>
          {NAV.map(({ href, key, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                isActive(pathname, href) ? "bg-ink text-emerald-300" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {t.nav[key]}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Link
            href={nextCase}
            className="flex items-center gap-2 rounded-xl bg-sky px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sky-dark"
          >
            <Play className="h-4 w-4 fill-gold text-gold" aria-hidden /> {t.nav.startCase}
          </Link>
          <UserMenu />
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <UserMenu compact />
          <button
            type="button"
            className="rounded-lg p-2 text-slate-700"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-2 lg:hidden" aria-label={t.nav.mobile}>
          <LanguageSwitcher className="mb-2 w-fit" />
          {NAV.map(({ href, key, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${
                isActive(pathname, href) ? "bg-ink text-emerald-300" : "text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden /> {t.nav[key]}
            </Link>
          ))}
          <Link
            href={nextCase}
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-sky px-4 py-3 text-sm font-bold text-white"
          >
            <Play className="h-4 w-4 fill-gold text-gold" aria-hidden /> {t.nav.startCase}
          </Link>
        </nav>
      )}
    </header>
  );
}
