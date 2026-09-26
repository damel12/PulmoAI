// Отправка попыток из браузера в аккаунт. Сервер пропускает уже сохранённые
// (по id), поэтому вызывать можно сколько угодно раз.
import { type Attempt, markSynced } from "./progress";

export async function uploadAttempts(attempts: Attempt[]): Promise<number> {
  if (attempts.length === 0) return 0;
  const res = await fetch("/api/attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attempts: attempts.map(({ id, slug, answers, finishedAt }) => ({ id, slug, answers, finishedAt })),
    }),
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status}`);
  const { inserted } = (await res.json()) as { inserted: number };
  markSynced(attempts.map((a) => a.id));
  return inserted;
}
