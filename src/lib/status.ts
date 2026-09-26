// Отдельно от auth.ts: список статусов нужен и в браузере (анкета), а auth.ts тянет сервер и БД.
export const STATUSES = ["student", "resident", "doctor"] as const;
export type UserStatus = (typeof STATUSES)[number];
