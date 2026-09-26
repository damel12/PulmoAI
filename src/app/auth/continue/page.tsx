import { redirect } from "next/navigation";
import { loginHref, safeNext } from "@/lib/redirect";
import { getSession } from "@/lib/session";

// Единая точка после любого входа: новый пользователь → анкета, остальные → туда, откуда пришли.
export default async function ContinuePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  const session = await getSession();
  if (!session) redirect(loginHref(next));
  if (!session.user.consentAt) redirect(`/welcome?next=${encodeURIComponent(next)}`);
  redirect(next);
}
