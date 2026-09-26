import type { Metadata } from "next";
import { CaseCard } from "@/components/case/CaseCard";
import { getCases } from "@/lib/cases";
import { getDict } from "@/lib/i18n/dictionaries";
import { getLocale, getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).cases.title };
}

export default async function CasesPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-ink">{t.cases.title}</h1>
      <p className="mt-2 text-slate-600">{t.cases.lead}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getCases(locale).map((c) => (
          <CaseCard key={c.slug} clinicalCase={c} t={t} />
        ))}
      </div>
    </div>
  );
}
