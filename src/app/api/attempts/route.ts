import { z } from "zod";
import { AttemptInputSchema, getAttempt, listAttempts, saveAttempts } from "@/lib/attempts-db";
import { getT } from "@/lib/i18n/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const unauthorized = async () => Response.json({ error: (await getT()).api.unauthorized }, { status: 401 });

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const id = new URL(request.url).searchParams.get("id");
  if (id) {
    if (!z.uuid().safeParse(id).success) return Response.json({ error: (await getT()).api.badId }, { status: 400 });
    const attempt = await getAttempt(session.user.id, id);
    return attempt ? Response.json({ attempt }) : Response.json({ error: (await getT()).api.attemptNotFound }, { status: 404 });
  }
  return Response.json({ attempts: await listAttempts(session.user.id) });
}

const BodySchema = z.object({ attempts: z.array(AttemptInputSchema).min(1).max(200) });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: (await getT()).api.badRequest }, { status: 400 });
  const inserted = await saveAttempts(session.user.id, parsed.data.attempts);
  return Response.json({ inserted });
}
