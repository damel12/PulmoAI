"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const EVENT = "pulmoai:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(null), 5000);
    };
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      {message && (
        <p className="pointer-events-auto flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-gold" aria-hidden /> {message}
        </p>
      )}
    </div>
  );
}
