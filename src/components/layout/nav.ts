
import {
  BookOpen,
  House,
  Info,
  Stethoscope,
  Wind,
} from "lucide-react";

export const NAV = [
  { href: "/", key: "home", icon: House },
  { href: "/cases", key: "cases", icon: Stethoscope },
  { href: "/library", key: "library", icon: BookOpen },
  { href: "/inhalercheck", key: "inhalercheck", icon: Wind },
  { href: "/about", key: "about", icon: Info },
] as const;


export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
