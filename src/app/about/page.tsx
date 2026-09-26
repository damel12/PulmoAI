import { BookOpen, ClipboardList, MessageSquareText, ScanLine, Stethoscope, Target, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cases } from "@/lib/cases";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).nav.about };
}

const STEP_ICONS = [Stethoscope, ScanLine, Target, ClipboardList, MessageSquareText];

export default async function AboutPage() {
  const t = await getT();
  const sections = [
    { href: "/cases", icon: Stethoscope, title: t.nav.cases, text: t.about.sections.cases(cases.length) },
    { href: "/library", icon: BookOpen, title: t.nav.library, text: t.about.sections.library },
    { href: "/profile", icon: UserRound, title: t.profile.title, text: t.about.sections.profile },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-ink">{t.about.title}</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">{t.about.lead}</p>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-extrabold text-ink">{t.about.howTitle}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {t.about.steps.map(({ title, text }, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-dark">{t.about.step(i + 1)}</p>
                <Icon className="mt-2 h-5 w-5 text-sky" aria-hidden />
                <h3 className="mt-2 font-heading text-sm font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-extrabold text-ink">{t.about.sectionsTitle}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {sections.map(({ href, icon: Icon, title, text }) => (
            <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-sky">
              <Icon className="h-6 w-6 text-sky" aria-hidden />
              <h3 className="mt-3 font-heading font-bold text-ink">{title} →</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-gold/60 bg-gold-light p-5 text-sm leading-relaxed text-slate-700">
        <h2 className="font-heading font-bold text-ink">{t.about.importantTitle}</h2>
        <p className="mt-1">{t.about.importantText}</p>
      </section>
    </div>
  );
}
