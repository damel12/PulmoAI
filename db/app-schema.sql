-- Таблицы приложения. Таблицы входа (user, session, account, verification)
-- создаёт Better Auth — см. scripts/migrate.ts.

CREATE TABLE IF NOT EXISTS attempts (
  id          uuid PRIMARY KEY,
  user_id     text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  slug        text NOT NULL,
  score       integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  answers     jsonb NOT NULL,
  finished_at timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attempts_user_finished_idx ON attempts (user_id, finished_at DESC);

-- ИИ-разборы: кеш на попытку и язык (повторный запрос не тратит деньги) и основа для суточного лимита.
CREATE TABLE IF NOT EXISTS ai_reviews (
  attempt_id  uuid NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  locale      text NOT NULL DEFAULT 'ru',
  user_id     text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  review      jsonb NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (attempt_id, locale)
);

-- Базы, созданные до появления языков: разборы там были только на русском.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_reviews' AND column_name = 'locale') THEN
    ALTER TABLE ai_reviews ADD COLUMN locale text NOT NULL DEFAULT 'ru';
    ALTER TABLE ai_reviews DROP CONSTRAINT ai_reviews_pkey;
    ALTER TABLE ai_reviews ADD PRIMARY KEY (attempt_id, locale);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS ai_reviews_user_created_idx ON ai_reviews (user_id, created_at DESC);
