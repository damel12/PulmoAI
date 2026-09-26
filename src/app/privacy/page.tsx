import type { Metadata } from "next";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).privacy.metaTitle };
}

export default async function PrivacyPage() {
  const p = (await getT()).privacy;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="rounded-xl bg-gold-light p-3 text-sm text-gold-dark">{p.draft}</p>
      <h1 className="mt-6 font-heading text-3xl font-extrabold text-ink">{p.title}</h1>
      <div className="mt-6 space-y-5 leading-relaxed text-slate-700">
        <section>
          <h2 className="font-heading text-lg font-bold text-ink">{p.collectTitle}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {p.collect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-lg font-bold text-ink">{p.whyTitle}</h2>
          <p className="mt-2">{p.why}</p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-bold text-ink">{p.aiTitle}</h2>
          <p className="mt-2">{p.ai}</p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-bold text-ink">{p.rightsTitle}</h2>
          <p className="mt-2">{p.rights}</p>
        </section>
      </div>
    </div>
  );
}
