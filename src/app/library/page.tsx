import { Activity, FileText, ScanLine, Scan } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCases } from "@/lib/cases";
import { DIAGNOSES, DIAGNOSIS_GROUPS } from "@/lib/cases/diagnoses";
import { getDict } from "@/lib/i18n/dictionaries";
import { getLocale, getT } from "@/lib/i18n/server";
import type { PhotoKind } from "@/lib/cases/types";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).library.title };
}

const SECTIONS: { kinds: PhotoKind[]; key: "xray" | "ct" | "ecg"; icon: typeof Scan }[] = [
  { kinds: ["xray", "scheme"], key: "xray", icon: ScanLine },
  { kinds: ["ct"], key: "ct", icon: Scan },
  { kinds: ["ecg"], key: "ecg", icon: Activity },
];

export default async function LibraryPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  // Снимки берутся прямо из кейсов: новый кейс автоматически пополняет Библиотеку.
  const photos = getCases(locale).flatMap((c) =>
    c.steps.flatMap((step) => (step.kind === "findings" ? step.photos : [])).map((photo) => ({ photo, clinicalCase: c })),
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-ink">{t.library.title}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">{t.library.lead}</p>

      <nav className="mt-6 flex flex-wrap gap-2 text-sm font-semibold" aria-label={t.library.sectionsNav}>
        {SECTIONS.map((s) => (
          <a key={s.key} href={`#${s.kinds[0]}`} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-sky">
            {t.library[s.key]}
          </a>
        ))}
        <a href="#diagnoses" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-sky">
          {t.library.nosologies}
        </a>
        <a href="#protocols" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-sky">
          {t.library.protocols}
        </a>
      </nav>

      {SECTIONS.map(({ kinds, key, icon: Icon }) => {
        const items = photos.filter(({ photo }) => kinds.includes(photo.kind));
        return (
          <section key={key} id={kinds[0]} className="mt-10 scroll-mt-24">
            <h2 className="flex items-center gap-2 font-heading text-xl font-extrabold text-ink">
              <Icon className="h-5 w-5 text-sky" aria-hidden /> {t.library[key]}
              <span className="text-sm font-semibold text-slate-400">{items.length}</span>
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(({ photo, clinicalCase }) => (
                <figure key={photo.image.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <a href={photo.image.src} target="_blank" rel="noopener" className="block bg-black">
                    <Image
                      src={photo.image.src}
                      alt={photo.alt}
                      width={photo.image.width}
                      height={photo.image.height}
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] w-full object-contain"
                    />
                  </a>
                  <figcaption className="space-y-1 p-4">
                    <p className="text-sm font-bold text-ink">{photo.caption}</p>
                    <Link href={`/cases/${clinicalCase.slug}`} className="block text-sm font-semibold text-sky-dark hover:underline">
                      {t.library.caseLink(clinicalCase.number, clinicalCase.title)}
                    </Link>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        );
      })}

      <section id="diagnoses" className="mt-12 scroll-mt-24">
        <h2 className="font-heading text-xl font-extrabold text-ink">{t.library.nosologies}</h2>
        <p className="mt-1 text-sm text-slate-600">{t.library.nosologiesLead}</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {DIAGNOSIS_GROUPS.map((group) => (
            <div key={group.items[0]} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-heading font-bold text-ink">{group.title[locale]}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                {group.items.map((n) => (
                  <li key={n} className="border-l-2 border-sky-light pl-3">
                    {DIAGNOSES[locale][n - 1]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="protocols" className="mt-12 scroll-mt-24">
        <h2 className="flex items-center gap-2 font-heading text-xl font-extrabold text-ink">
          <FileText className="h-5 w-5 text-sky" aria-hidden /> {t.library.protocolsTitle}
        </h2>
        <p className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
          {t.library.protocolsPending}
        </p>
      </section>
    </div>
  );
}
