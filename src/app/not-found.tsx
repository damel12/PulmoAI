import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = await getT();
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-extrabold text-ink">{t.notFound.title}</h1>
      <p className="mt-3 text-slate-600">{t.notFound.text}</p>
      <Link href="/cases" className="mt-6 inline-block rounded-xl bg-sky px-5 py-3 font-bold text-white">
        {t.notFound.back}
      </Link>
    </div>
  );
}
