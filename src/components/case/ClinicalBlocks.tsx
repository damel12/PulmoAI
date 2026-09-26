"use client";

import { UserRound } from "lucide-react";
import Image from "next/image";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Patient, Vital } from "@/lib/cases/types";

export function PatientCard({ patient }: { patient: Patient }) {
  const t = useT();
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      {patient.photo ? (
        <Image
          src={patient.photo.src}
          alt=""
          width={patient.photo.width}
          height={patient.photo.height}
          sizes="56px"
          className="h-14 w-14 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-light text-sky-dark">
          <UserRound className="h-7 w-7" aria-hidden />
        </span>
      )}
      <div className="min-w-0">
        <p className="font-heading font-bold text-ink">{patient.name}</p>
        <p className="text-sm text-slate-600">
          {t.patient.age(patient.age)} · {t.patient.sex[patient.sex]}
          {patient.occupation ? ` · ${patient.occupation}` : ""}
        </p>
        <p className="mt-1 inline-block rounded-md bg-gold-light px-2 py-0.5 text-xs font-semibold text-gold-dark">{patient.admission}</p>
      </div>
    </div>
  );
}

export function VitalsGrid({ vitals }: { vitals: Vital[] }) {
  return (
    <dl className={`grid grid-cols-2 gap-2 ${vitals.length === 5 ? "sm:grid-cols-5" : "sm:grid-cols-4"}`}>
      {vitals.map((v) => (
        <div key={v.label} className="rounded-xl border border-slate-200 bg-white p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{v.label}</dt>
          <dd className="font-heading text-xl font-bold text-ink">{v.value}</dd>
          {v.unit && <dd className="text-[11px] text-slate-500">{v.unit}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** Строки из материалов заказчика как есть; название показателя или исследования — жирным. */
export function DocLines({ title, lines }: { title: string; lines: string[] }) {
  return (
    <Section title={title}>
      <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
        {lines.map((line) => {
          const m = line.match(/^(.+?)(:| —) (.*)$/);
          return (
            <li key={line} className="border-l-2 border-sky-light pl-3">
              {m ? (
                <>
                  <span className="font-semibold text-ink">
                    {m[1]}
                    {m[2]}
                  </span>{" "}
                  {m[3]}
                </>
              ) : (
                line
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="mb-2 font-heading text-sm font-bold text-ink">{title}</h3>
      {children}
    </section>
  );
}
