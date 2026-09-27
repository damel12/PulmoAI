import { Pool } from "pg";

// Один пул на процесс. В dev Next.js перезагружает модули — кешируем пул на globalThis,
// чтобы не плодить подключения.
const globalForDb = globalThis as unknown as { pulmoaiPool?: Pool };

// В проде на serverless-хостинге (Vercel и т.п.) один процесс = одна функция, и таких
// функций может одновременно работать много — у каждой свой пул. max:10 на процесс,
// умноженное на десятки параллельных функций, легко упирается в лимит подключений
// обычного Postgres-плана (Neon/Supabase free tier — обычно ~20-100). Поэтому в проде
// пул по умолчанию меньше; если DATABASE_URL уже указывает на pooler (PgBouncer,
// Neon/Supabase "pooled connection"), можно поднять через POSTGRES_POOL_MAX.
const defaultMax = process.env.NODE_ENV === "production" ? 3 : 10;
const max = Number(process.env.POSTGRES_POOL_MAX) || defaultMax;

export const pool =
  globalForDb.pulmoaiPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pulmoaiPool = pool;
