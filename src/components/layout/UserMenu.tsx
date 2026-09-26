"use client";

import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { loadAttempts } from "@/lib/progress";
import { loginHref } from "@/lib/redirect";
import { useT } from "@/components/i18n/LocaleProvider";

function initials(name: string | undefined, email: string): string {
  const source = name?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)).toUpperCase();
}

export async function signOutAndForget() {
  await authClient.signOut();
  // Сохранённые в аккаунте попытки убираем из браузера — на общем компьютере
  // их не должен видеть следующий человек.
  try {
    const keep = loadAttempts().filter((a) => !a.synced);
    window.localStorage.setItem("pulmoai.attempts.v2", JSON.stringify(keep));
  } catch {}
}

export function UserMenu({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (pathname === "/login" || pathname === "/welcome") return null;
  if (isPending) return <span className={compact ? "h-9 w-9" : "h-10 w-24"} aria-hidden />;

  if (!session) {
    return (
      <Link
        href={loginHref(pathname)}
        className={`rounded-xl border border-slate-300 font-bold text-ink transition-colors hover:border-slate-400 ${
          compact ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm"
        }`}
      >
        {t.nav.login}
      </Link>
    );
  }

  const { user } = session;
  const status = user.status && user.status in t.status ? t.status[user.status as keyof typeof t.status] : null;
  return (
    <div ref={ref} className={`relative ${compact ? "" : "ml-1 border-l border-slate-200 pl-3"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.userMenu.open}
        className="flex items-center gap-2 rounded-xl p-0.5 text-left hover:bg-slate-100"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-sky-light text-sm font-bold text-sky-dark">
          {initials(user.name, user.email)}
        </span>
        {!compact && (
          <>
            <span className="max-w-36 leading-tight">
              <span className="block truncate text-sm font-bold text-ink">{user.name || t.userMenu.noName}</span>
              {status && <span className="block text-[11px] text-slate-500">{status}</span>}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden />
          </>
        )}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{user.name || t.userMenu.noName}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <MenuLink href="/profile" icon={UserRound} onClick={() => setOpen(false)}>
            {t.userMenu.profile}
          </MenuLink>
          <MenuLink href="/account" icon={Settings} onClick={() => setOpen(false)}>
            {t.userMenu.settings}
          </MenuLink>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOutAndForget();
              // Уходим на главную: на экране не должны остаться чужие результаты.
              router.push("/");
              router.refresh();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" aria-hidden /> {t.userMenu.logout}
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: string;
  icon: typeof Settings;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} role="menuitem" onClick={onClick} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
      <Icon className="h-4 w-4" aria-hidden /> {children}
    </Link>
  );
}
