"use client";

import { useT } from "@/components/i18n/LocaleProvider";
import { STATUSES } from "@/lib/status";

export function ProfileFields({ name, status, university }: { name?: string; status?: string | null; university?: string | null }) {
  const t = useT();
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-semibold text-ink">
          {t.profileFields.name}
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          defaultValue={name}
          autoComplete="name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/20"
        />
      </div>
      <fieldset className="space-y-1.5">
        <legend className="text-sm font-semibold text-ink">{t.profileFields.who}</legend>
        <div className="grid grid-cols-3 gap-2">
          {STATUSES.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 has-[:checked]:border-sky has-[:checked]:bg-sky-light has-[:checked]:text-sky-dark"
            >
              <input type="radio" name="status" value={value} defaultChecked={status === value} required className="sr-only" />
              {t.status[value]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-1.5">
        <label htmlFor="university" className="block text-sm font-semibold text-ink">
          {t.profileFields.university} <span className="font-normal text-slate-400">{t.profileFields.optional}</span>
        </label>
        <input
          id="university"
          name="university"
          maxLength={200}
          defaultValue={university ?? ""}
          placeholder={t.profileFields.universityPlaceholder}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/20"
        />
      </div>
    </>
  );
}
