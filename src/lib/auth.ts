import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
// Относительные импорты: этот файл загружает и скрипт миграций вне Next.js.
import { pool } from "./db";
import { STATUSES } from "./status";

export { STATUSES, type UserStatus } from "./status";

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  appName: "PulmoAI",
  baseURL: process.env.BETTER_AUTH_URL,
  database: pool,
  // Вход по email и паролю. Почту не подтверждаем: писем проект пока не отправляет.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : undefined,
  user: {
    additionalFields: {
      status: { type: [...STATUSES], required: false },
      university: { type: "string", required: false },
      // Когда пользователь дал согласие на обработку персональных данных.
      // Пусто — значит, первичная анкета ещё не заполнена.
      consentAt: { type: "date", required: false, input: false },
    },
    deleteUser: { enabled: true },
  },
  plugins: [nextCookies()],
});

export const isGoogleConfigured = googleConfigured;
