"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { ProfileFields } from "@/components/layout/ProfileFields";
import { completeOnboarding } from "../profile-actions";

export function WelcomeForm({ next, name }: { next: string; name: string }) {
  const t = useT();
  const [state, action, pending] = useActionState(completeOnboarding, {});
  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="next" value={next} />
      <ProfileFields name={name} />
      <label className="flex items-start gap-3 text-sm text-slate-700">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-sky" />
        <span>
          {t.welcome.consentBefore}{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-sky-dark underline">
            {t.welcome.consentLink}
          </Link>
        </span>
      </label>
      {state.error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-sky px-4 py-3 text-sm font-bold text-white hover:bg-sky-dark disabled:opacity-60"
      >
        {pending ? t.welcome.saving : t.welcome.continue}
      </button>
    </form>
  );
}
