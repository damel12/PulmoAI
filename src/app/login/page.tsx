import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isGoogleConfigured } from "@/lib/auth";
import { safeNext } from "@/lib/redirect";
import { getT } from "@/lib/i18n/server";
import { getSession } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).login.metaTitle };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(`/auth/continue?next=${encodeURIComponent(next)}`);
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <LoginForm next={next} googleEnabled={isGoogleConfigured} />
    </div>
  );
}
