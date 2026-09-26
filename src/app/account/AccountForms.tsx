"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { ProfileFields } from "@/components/layout/ProfileFields";
import { signOutAndForget } from "@/components/layout/UserMenu";
import { authClient } from "@/lib/auth-client";
import { clearAttempts } from "@/lib/progress";
import { loginHref } from "@/lib/redirect";
import { updateProfile } from "../profile-actions";

export function ProfileForm(props: { name: string; status?: string | null; university?: string | null }) {
  const t = useT();
  const [state, action, pending] = useActionState(updateProfile, {});
  return (
    <form action={action} className="mt-4 space-y-5">
      <ProfileFields {...props} />
      {state.error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">
          {state.error}
        </p>
      )}
      {state.saved && !pending && <p className="text-sm font-semibold text-emerald-700">{t.account.saved}</p>}
      <button type="submit" disabled={pending} className="rounded-xl bg-sky px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-dark disabled:opacity-60">
        {pending ? t.account.saving : t.account.save}
      </button>
    </form>
  );
}

export function AccountActions({ consentAt }: { consentAt: string }) {
  const router = useRouter();
  const t = useT();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<React.ReactNode>(null);

  const deleteAccount = async () => {
    setDeleting(true);
    setError(null);
    const { error } = await authClient.deleteUser();
    if (error) {
      setDeleting(false);
      setError(
        error.code === "SESSION_EXPIRED" ? (
          <>
            {t.account.reauth}{" "}
            <button type="button" className="font-semibold underline" onClick={async () => {
              await signOutAndForget();
              router.push(loginHref("/account"));
            }}>
              {t.account.reauthButton}
            </button>
          </>
        ) : (
          t.account.deleteFailed
        ),
      );
      return;
    }
    clearAttempts();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-heading text-lg font-bold text-ink">{t.account.logoutTitle}</h2>
        <button
          type="button"
          onClick={async () => {
            await signOutAndForget();
            router.push("/");
            router.refresh();
          }}
          className="mt-3 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-ink hover:border-slate-400"
        >
          {t.account.logout}
        </button>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-white p-6">
        <h2 className="font-heading text-lg font-bold text-ink">{t.account.deleteTitle}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {t.account.deleteText(consentAt)}{" "}
          <Link href="/privacy" className="underline">
            {t.account.more}
          </Link>
        </p>
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-4 rounded-xl border border-rose-300 px-5 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50"
          >
            {t.account.delete}
          </button>
        ) : (
          <div className="mt-4 rounded-xl bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-800">{t.account.confirm}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={deleteAccount}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? t.account.deleting : t.account.confirmYes}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600">
                {t.account.cancel}
              </button>
            </div>
          </div>
        )}
        {error && (
          <p className="mt-3 text-sm text-rose-700" role="alert">
            {error}
          </p>
        )}
      </section>
    </>
  );
}
