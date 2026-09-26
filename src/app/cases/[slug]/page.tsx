import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { CasePlayer } from "@/components/case/CasePlayer";
import { getCase } from "@/lib/cases";
import { getDict } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/server";
import { loginHref } from "@/lib/redirect";
import { getSession } from "@/lib/session";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDict(locale);
  const c = getCase((await params).slug, locale);
  return { title: c ? t.player.caseTitle(c.number, c.title) : t.player.notFound };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const clinicalCase = getCase(slug, await getLocale());
  if (!clinicalCase) notFound();

  // Кейс целиком — только для вошедших: без аккаунта результат негде хранить и некому
  // выдавать ИИ-разбор. Гость нажимает любую ведущую сюда кнопку и сразу попадает на вход;
  // next вернёт его на этот же кейс.
  const session = await getSession();
  const href = `/cases/${slug}`;
  if (!session) redirect(loginHref(href));
  if (!session.user.consentAt) redirect(`/welcome?next=${encodeURIComponent(href)}`);

  // Suspense нужен CasePlayer из-за useSearchParams (ссылка на результат ?attempt=…).
  return (
    <Suspense>
      <CasePlayer clinicalCase={clinicalCase} />
    </Suspense>
  );
}
