import { BookOpen, House, Info, Stethoscope } from "lucide-react";

/** Разделы сайта — одни и те же в шапке, мобильном меню и подвале. `key` — ключ подписи в словаре (t.nav). */
export const NAV = [
  { href: "/", key: "home", icon: House },
  { href: "/cases", key: "cases", icon: Stethoscope },
  { href: "/library", key: "library", icon: BookOpen },
  { href: "/about", key: "about", icon: Info },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
