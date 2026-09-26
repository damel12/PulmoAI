import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginHref, safeNext } from "@/lib/redirect";
import { getT } from "@/lib/i18n/server";
import { getSession } from "@/lib/session";
import { WelcomeForm } from "./WelcomeForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).welcome.metaTitle };
}

export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  const session = await getSession();
  if (!session) redirect(loginHref(next));
  if (session.user.consentAt) redirect(next);
  const t = await getT();

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="font-heading text-2xl font-extrabold text-ink">{t.welcome.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.welcome.lead}</p>
        <WelcomeForm next={next} name={session.user.name} />
      </div>
    </div>
  );
}
