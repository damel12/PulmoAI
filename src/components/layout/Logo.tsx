import Link from "next/link";
import { getDict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { LungsIcon } from "./LungsIcon";

/** Подпись под логотипом передаёт вызывающий: Logo используется и в серверных, и в клиентских компонентах. */
export function Logo({ inverted = false, locale }: { inverted?: boolean; locale?: Locale }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky shadow-sm">
        <LungsIcon className="h-6 w-6 text-gold" />
      </span>
      <span className="leading-tight">
        <span className="flex items-center gap-1.5">
          <span className={`font-heading text-xl font-extrabold ${inverted ? "text-white" : "text-ink"}`}>
            Pulmo<span className="text-sky">AI</span>
          </span>
          <span className="rounded border border-gold bg-gold-light px-1 text-[10px] font-bold text-gold-dark">KZ</span>
        </span>
        {locale && <span className="block text-[11px] text-slate-500">{getDict(locale).brand.tagline}</span>}
      </span>
    </Link>
  );
}
