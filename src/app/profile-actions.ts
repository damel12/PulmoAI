"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { pool } from "@/lib/db";
import type { Dict } from "@/lib/i18n/dictionaries";
import { getT } from "@/lib/i18n/server";
import { loginHref, safeNext } from "@/lib/redirect";
import { getSession } from "@/lib/session";
import { STATUSES } from "@/lib/status";

export interface ProfileFormState {
  error?: string;
  saved?: boolean;
}

function profileSchema(t: Dict) {
  return z.object({
    name: z.string().trim().min(2, t.validation.name).max(100),
    status: z.enum(STATUSES, t.validation.status),
    university: z.string().trim().max(200),
  });
}

function readProfile(formData: FormData, t: Dict) {
  return profileSchema(t).safeParse({
    name: formData.get("name") ?? "",
    status: formData.get("status") ?? undefined,
    university: formData.get("university") ?? "",
  });
}

/** Первичная анкета после первого входа: профиль + согласие на обработку ПДн. */
export async function completeOnboarding(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const next = safeNext(String(formData.get("next") ?? ""));
  const session = await getSession();
  if (!session) redirect(loginHref(next));

  const t = await getT();
  const parsed = readProfile(formData, t);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (formData.get("consent") !== "on") return { error: t.validation.consent };

  const { name, status, university } = parsed.data;
  await pool.query(
    `UPDATE "user" SET name = $1, status = $2, university = $3, "consentAt" = now(), "updatedAt" = now() WHERE id = $4`,
    [name, status, university || null, session.user.id],
  );
  redirect(next);
}

/** Изменение профиля в настройках. */
export async function updateProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await getSession();
  if (!session) redirect(loginHref("/account"));

  const t = await getT();
  const parsed = readProfile(formData, t);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, status, university } = parsed.data;
  await pool.query(`UPDATE "user" SET name = $1, status = $2, university = $3, "updatedAt" = now() WHERE id = $4`, [
    name,
    status,
    university || null,
    session.user.id,
  ]);
  return { saved: true };
}
