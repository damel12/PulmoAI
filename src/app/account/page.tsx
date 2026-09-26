import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginHref } from "@/lib/redirect";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";
import { getLocale, getT } from "@/lib/i18n/server";
import { getSession } from "@/lib/session";
import { AccountActions, ProfileForm } from "./AccountForms";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).account.title };
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect(loginHref("/account"));
  if (!session.user.consentAt) redirect("/welcome?next=/account");
  const { user } = session;
  const locale = await getLocale();
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-ink">{t.account.title}</h1>
        <p className="mt-1 text-slate-600">{user.email}</p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-heading text-lg font-bold text-ink">{t.account.profile}</h2>
        <ProfileForm name={user.name} status={user.status} university={user.university} />
      </section>
      <AccountActions consentAt={new Date(user.consentAt!).toLocaleDateString(LOCALE_TAG[locale])} />
    </div>
  );
}
