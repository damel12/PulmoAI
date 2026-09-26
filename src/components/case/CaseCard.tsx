import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import type { ClinicalCase } from "@/lib/cases/types";
import type { Dict } from "@/lib/i18n/dictionaries";

export function CaseCard({ clinicalCase, t }: { clinicalCase: ClinicalCase; t: Dict }) {
  return (
    <Link
      href={`/cases/${clinicalCase.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-sky"
    >
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="rounded-md bg-sky-light px-2 py-1 text-sky-dark">
          №{clinicalCase.number} · {clinicalCase.topic}
        </span>
        <span className="text-slate-500">{t.difficulty[clinicalCase.difficulty]}</span>
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-ink">{clinicalCase.title}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {clinicalCase.patient.sex === "female" ? t.patient.she : t.patient.he}, {t.patient.age(clinicalCase.patient.age)}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{clinicalCase.summary}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-4 w-4" aria-hidden /> {t.cases.minutes(clinicalCase.minutes)}
        </span>
        <span className="flex items-center gap-1 font-bold text-sky-dark">
          {t.cases.solve} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

