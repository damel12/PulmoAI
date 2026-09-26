import { Pool } from "pg";

// Один пул на процесс. В dev Next.js перезагружает модули — кешируем пул на globalThis,
// чтобы не плодить подключения.
const globalForDb = globalThis as unknown as { pulmoaiPool?: Pool };

export const pool =
  globalForDb.pulmoaiPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pulmoaiPool = pool;
