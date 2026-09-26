// Создаёт/обновляет схему БД: сначала таблицы Better Auth, затем таблицы приложения.
// Запуск: npm run db:migrate
import { readFileSync } from "node:fs";
import { getMigrations } from "better-auth/db/migration";
import { auth } from "../src/lib/auth";
import { pool } from "../src/lib/db";

const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);
console.log(`Better Auth: новых таблиц ${toBeCreated.length}, изменений ${toBeAdded.length}`);
await runMigrations();

await pool.query(readFileSync(new URL("../db/app-schema.sql", import.meta.url), "utf8"));
console.log("Таблицы приложения готовы");
await pool.end();
