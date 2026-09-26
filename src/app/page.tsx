import { ArrowRight, BookOpen, Stethoscope, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CaseCard } from "@/components/case/CaseCard";
import { getCases } from "@/lib/cases";
import { getLocale } from "@/lib/i18n/server";
import { getDict } from "@/lib/i18n/dictionaries";

const FEATURES = [
  { href: "/cases", icon: Stethoscope, key: "cases" },
  { href: "/library", icon: BookOpen, key: "library" },
  { href: "/profile", icon: UserRound, key: "profile" },
] as const;

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const cases = getCases(locale);
  const featured = cases[0];
  const spo2 = featured.steps.flatMap((s) => (s.kind === "history" ? s.vitals : [])).find((v) => v.label === "SpO₂");
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold-light px-3 py-1 text-xs font-bold text-gold-dark">
              {t.home.badge}
            </p>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {t.home.titleStart} <span className="text-sky">{t.home.titleAccent}</span> {t.home.titleEnd}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              {t.home.lead}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/cases/${featured.slug}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-sky px-6 py-3.5 font-bold text-white transition-colors hover:bg-sky-dark"
              >
                {t.home.ctaFirst} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cases"
                className="flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3.5 font-bold text-ink hover:border-slate-400"
              >
                {t.home.ctaAll}
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-dark">{t.home.caseNumber(featured.number)}</p>
                <p className="font-heading font-bold text-ink">
                  {featured.patient.name.split(" ")[0]} {featured.patient.name.split(" ")[1][0]}.,{" "}
                  {t.patient.age(featured.patient.age)}
                </p>
              </div>
              {spo2 && (
                <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600">SpO₂ {spo2.value}%</span>
              )}
            </div>
            <Image
              src={featured.cover.src}
              width={featured.cover.width}
              height={featured.cover.height}
              alt=""
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[4/3] w-full bg-black object-contain"
            />
            <p className="px-5 py-4 text-sm text-slate-600">{t.home.heroPrompt}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ href, icon: Icon, key }) => (
            <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-sky">
              <Icon className="h-6 w-6 text-sky" aria-hidden />
              <h2 className="mt-3 font-heading font-bold text-ink">{key === "profile" ? t.home.profileTitle : t.nav[key]} →</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.home.features[key]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-2xl font-extrabold text-ink">{t.home.casesHeading}</h2>
          <Link href="/cases" className="text-sm font-bold text-sky-dark">
            {t.home.allCases}
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.slug} clinicalCase={c} t={t} />
          ))}
        </div>
      </section>
    </>
  );
}
