"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { authClient } from "@/lib/auth-client";
import { loadAttempts } from "@/lib/progress";
import { uploadAttempts } from "@/lib/sync";
import { toast } from "./Toaster";

/** После входа переносит в аккаунт результаты, пройденные в этом браузере до входа. */
export function SyncLocalAttempts() {
  const t = useT();
  const { data: session } = authClient.useSession();
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId || syncedFor.current === userId) return;
    syncedFor.current = userId;
    const pending = loadAttempts().filter((a) => !a.synced);
    uploadAttempts(pending)
      .then((inserted) => {
        if (inserted > 0) toast(t.sync.moved(inserted));
      })
      .catch(() => {
        syncedFor.current = null; // попробуем снова при следующем изменении сессии
      });
  }, [session?.user.id, t]);

  return null;
}
