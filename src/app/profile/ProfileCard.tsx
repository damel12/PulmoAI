"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { useT } from "@/components/i18n/LocaleProvider";
import { authClient } from "@/lib/auth-client";

/** Карточка пользователя в Профиле. Гостю не показывается — у него баннер «Войти» ниже. */
export function ProfileCard() {
  const t = useT();
  const { data: session } = authClient.useSession();
  if (!session) return null;
  const { user } = session;
  const name = user.name || t.userMenu.noName;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  const status = user.status && user.status in t.status ? t.status[user.status as keyof typeof t.status] : null;
  const details = [status, user.university].filter(Boolean).join(" · ");

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-gold bg-sky-light font-heading text-xl font-extrabold text-sky-dark">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-xl font-extrabold text-ink">{name}</p>
        {details && <p className="text-sm text-slate-600">{details}</p>}
        <p className="truncate text-xs text-slate-400">{user.email}</p>
      </div>
      <Link
        href="/account"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-ink hover:border-slate-400"
      >
        <Settings className="h-4 w-4" aria-hidden /> {t.profile.settings}
      </Link>
    </div>
  );
}
