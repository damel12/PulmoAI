import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SyncLocalAttempts } from "@/components/layout/SyncLocalAttempts";
import { Toaster } from "@/components/layout/Toaster";
import { getLocale, getT } from "@/lib/i18n/server";
import "./globals.css";

// cyrillic-ext — казахские буквы (ә, ғ, қ, ң, ө, ұ, ү, һ, і).
const manrope = Manrope({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--font-manrope" });
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: { default: t.meta.title, template: "%s · PulmoAI" }, description: t.meta.description };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${manrope.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <LocaleProvider locale={locale}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
          <SyncLocalAttempts />
        </LocaleProvider>
      </body>
    </html>
  );
}
