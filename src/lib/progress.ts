// Попытки в браузере. У гостя это единственное хранилище; у вошедшего — кеш,
// который переносится в аккаунт (synced = уже отправлено на сервер).
// localStorage может быть недоступен (приватный режим), поэтому всё в try/catch.

import type { Answers } from "./cases/types";

export interface Attempt {
  id: string;
  slug: string;
  score: number;
  answers: Answers;
  finishedAt: string;
  synced?: boolean;
}

const KEY = "pulmoai.attempts.v2";
const EVENT = "pulmoai:progress";

function isAttempt(value: unknown): value is Attempt {
  const a = value as Attempt;
  return typeof a?.id === "string" && typeof a.slug === "string" && typeof a.score === "number";
}

export function loadAttempts(): Attempt[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isAttempt) : [];
  } catch {
    return [];
  }
}

function write(attempts: Attempt[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(attempts.slice(-200)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Без хранилища результат просто не сохранится в браузере — кейс всё равно проходится.
  }
}

export function saveAttempt(attempt: Attempt): void {
  write([...loadAttempts().filter((a) => a.id !== attempt.id), attempt]);
}

export function findAttempt(id: string): Attempt | undefined {
  return loadAttempts().find((a) => a.id === id);
}

export function markSynced(ids: string[]): void {
  const set = new Set(ids);
  write(loadAttempts().map((a) => (set.has(a.id) ? { ...a, synced: true } : a)));
}

export function clearAttempts(): void {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

export function subscribeAttempts(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
