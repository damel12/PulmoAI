"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { authClient } from "@/lib/auth-client";
import { getCases } from "@/lib/cases";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { type Attempt, clearAttempts, loadAttempts, subscribeAttempts } from "@/lib/progress";
import { loginHref } from "@/lib/redirect";

// useSyncExternalStore требует стабильный снимок: кешируем по сырой строке.
let cachedRaw: string | null = null;
let cachedAttempts: Attempt[] = [];
function getSnapshot(): Attempt[] {
  const attempts = loadAttempts();
  const raw = JSON.stringify(attempts);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedAttempts = attempts;
  }
  return cachedAttempts;
}
const EMPTY: Attempt[] = [];

export function ProgressDashboard() {
  const localAttempts = useSyncExternalStore(subscribeAttempts, getSnapshot, () => EMPTY);
  const t = useT();
  const locale = useLocale();
  const cases = getCases(locale);
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user.id;
  const [remote, setRemote] = useState<{ userId: string; attempts: Attempt[] } | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Вошедшему показываем результаты из аккаунта; перезагружаем, когда в браузере появились новые.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetch("/api/attempts")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((body) => !cancelled && setRemote({ userId, attempts: body.attempts }))
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, [userId, localAttempts]);

  if (isPending || (userId && remote?.userId !== userId && !loadError)) {
    return <p className="mt-8 text-sm text-slate-500">{t.profile.loading}</p>;
  }
  if (userId && loadError && !remote) {
    return <p className="mt-8 text-sm text-rose-700">{t.profile.loadError}</p>;
  }
  const attempts = userId && remote ? remote.attempts : localAttempts;

  const guestBanner = !userId && (
    <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-sky/40 bg-sky-light p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-700">
        {t.profile.guestBanner}
      </p>
      <Link href={loginHref("/profile")} className="shrink-0 rounded-xl bg-sky px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-sky-dark">
        {t.profile.login}
      </Link>
    </div>
  );

  if (attempts.length === 0) {
    return (
      <>
      {guestBanner}
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-slate-600">{t.profile.empty}</p>
        <Link href="/cases" className="mt-4 inline-block rounded-xl bg-sky px-5 py-3 font-bold text-white">
          {t.profile.chooseCase}
        </Link>
      </div>
      </>
    );
  }

  const average = Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length);
  const solved = cases.filter((c) => attempts.some((a) => a.slug === c.slug)).length;
  const recent = [...attempts].reverse().slice(0, 10);
  const stats = [
    { label: t.profile.attempts, value: attempts.length },
    { label: t.profile.solved, value: t.profile.solvedOf(solved, cases.length) },
    { label: t.profile.average, value: average },
  ];

  return (
    <div className="mt-8 space-y-8">
      {guestBanner}
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <dt className="text-sm text-slate-500">{s.label}</dt>
            <dd className="font-heading text-3xl font-extrabold text-ink tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h2 className="font-heading text-lg font-bold text-ink">{t.profile.best}</h2>
        <div className="mt-3 space-y-2">
          {cases.map((c) => {
            const own = attempts.filter((a) => a.slug === c.slug);
            const best = own.length ? Math.max(...own.map((a) => a.score)) : null;
            return (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-sky"
              >
                <span className="w-36 shrink-0 text-sm font-semibold text-ink sm:w-64">
                  №{c.number} · {c.topic}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky" style={{ width: `${best ?? 0}%` }} />
                </div>
                <span className="w-16 text-right text-sm font-bold tabular-nums text-ink">{best ?? "—"}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-lg font-bold text-ink">{t.profile.recent}</h2>
        <ul className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {recent.map((a) => {
            const c = cases.find((x) => x.slug === a.slug);
            return (
              <li key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <Link href={`/cases/${a.slug}?attempt=${a.id}`} className="text-ink hover:text-sky-dark">
                  {c ? `№${c.number} · ${c.title}` : a.slug}
                </Link>
                <span className="flex items-center gap-4">
                  <span className="text-slate-500">{new Date(a.finishedAt).toLocaleDateString(LOCALE_TAG[locale])}</span>
                  <span className="w-8 text-right font-bold tabular-nums">{a.score}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {!userId && (
        <button type="button" onClick={clearAttempts} className="text-sm font-semibold text-slate-500 underline hover:text-rose-600">
          {t.profile.clear}
        </button>
      )}
    </div>
  );
}
