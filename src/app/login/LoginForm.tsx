"use client";

import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { authClient } from "@/lib/auth-client";
import type { Dict } from "@/lib/i18n/dictionaries";

type Mode = "sign-in" | "sign-up";

const MIN_PASSWORD = 8;

function errorText(mode: Mode, error: { code?: string; status: number }, t: Dict): string {
  const e = t.login.errors;
  if (error.status === 429) return e.tooMany;
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return e.invalid;
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return e.exists;
    case "PASSWORD_TOO_SHORT":
      return e.tooShort(MIN_PASSWORD);
    case "PASSWORD_TOO_LONG":
      return e.tooLong;
    case "INVALID_EMAIL":
      return e.badEmail;
    default:
      return mode === "sign-in" ? e.signInFailed : e.signUpFailed;
  }
}

export function LoginForm({ next, googleEnabled }: { next: string; googleEnabled: boolean }) {
  const router = useRouter();
  const t = useT();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const continueUrl = `/auth/continue?next=${encodeURIComponent(next)}`;

  const switchMode = (m: Mode) => {
    setMode(m);
    setPasswordRepeat("");
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = email.trim().toLowerCase();
    if (mode === "sign-up" && password.length < MIN_PASSWORD) {
      setError(t.login.errors.tooShort(MIN_PASSWORD));
      return;
    }
    if (mode === "sign-up" && password !== passwordRepeat) {
      setError(t.login.errors.mismatch);
      return;
    }
    setBusy(true);
    setError(null);
    // Имя спрашиваем в анкете после первого входа, поэтому при регистрации оно пустое.
    const { error } =
      mode === "sign-in"
        ? await authClient.signIn.email({ email: target, password })
        : await authClient.signUp.email({ email: target, password, name: "" });
    if (error) {
      setBusy(false);
      setError(errorText(mode, error, t));
      return;
    }
    router.replace(continueUrl);
  };

  const onGoogle = async () => {
    setBusy(true);
    // При отмене входа Google возвращает на ту же страницу, откуда пришёл пользователь.
    await authClient.signIn.social({ provider: "google", callbackURL: continueUrl, errorCallbackURL: next });
  };

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => switchMode(m)}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${mode === m ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-ink"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <Link href={next} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {t.login.back}
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-extrabold text-ink">
        {mode === "sign-in" ? t.login.signInTitle : t.login.signUpTitle}
      </h1>
      <p className="mt-1 text-sm text-slate-600">{t.login.lead}</p>

      <div role="tablist" className="mt-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {tab("sign-in", t.login.signInTab)}
        {tab("sign-up", t.login.signUpTab)}
      </div>

      <div className="mt-5 space-y-4">
        {googleEnabled && (
          <>
            <button
              type="button"
              onClick={onGoogle}
              disabled={busy}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-ink hover:border-slate-400 disabled:opacity-60"
            >
              <GoogleIcon /> {t.login.google}
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> {t.login.or} <span className="h-px flex-1 bg-slate-200" />
            </div>
          </>
        )}
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm font-semibold text-ink" htmlFor="email">
            {t.login.email}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/20"
          />
          <label className="block text-sm font-semibold text-ink" htmlFor="password">
            {t.login.password}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              maxLength={128}
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mode === "sign-up" && (
            <>
              <p className="text-xs text-slate-500">{t.login.minLength(MIN_PASSWORD)}</p>
              <label className="block text-sm font-semibold text-ink" htmlFor="password-repeat">
                {t.login.passwordRepeat}
              </label>
              <input
                id="password-repeat"
                type={showPassword ? "text" : "password"}
                required
                maxLength={128}
                autoComplete="new-password"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                aria-invalid={passwordRepeat.length > 0 && passwordRepeat !== password}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/20 aria-invalid:border-rose-400"
              />
              {passwordRepeat.length > 0 && passwordRepeat !== password && (
                <p className="text-xs text-rose-600">{t.login.mismatch}</p>
              )}
            </>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky px-4 py-3 text-sm font-bold text-white hover:bg-sky-dark disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "sign-in" ? t.login.signIn : t.login.signUp}
          </button>
        </form>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        {t.login.consentBefore}{" "}
        <Link href="/privacy" className="underline">
          {t.login.consentLink}
        </Link>
        .
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
