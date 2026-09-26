import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { Logo } from "./Logo";
import { NAV } from "./nav";

export async function SiteFooter() {
  const t = await getT();
  const links = [...NAV.map((item) => ({ href: item.href, label: t.nav[item.key] })), { href: "/profile", label: t.nav.profile }];
  return (
    <footer className="mt-16 border-t-4 border-gold bg-ink text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-start">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-xl text-xs leading-relaxed">{t.footer.disclaimer}</p>
        </div>
        <nav aria-label={t.nav.sections} className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
