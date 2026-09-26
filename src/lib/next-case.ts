"use client";

import { useSyncExternalStore } from "react";
import { cases } from "./cases";
import { loadAttempts, subscribeAttempts } from "./progress";

function nextSlug(): string {
  const done = new Set(loadAttempts().map((a) => a.slug));
  return (cases.find((c) => !done.has(c.slug)) ?? cases[0]).slug;
}

/** Ссылка «Начать кейс»: первый кейс, который ещё не проходили в этом браузере. */
export function useNextCaseHref(): string {
  const slug = useSyncExternalStore(subscribeAttempts, nextSlug, () => cases[0].slug);
  return `/cases/${slug}`;
}
