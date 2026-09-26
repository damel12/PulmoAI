import type { NextConfig } from "next";

// Content-Security-Policy — в middleware.ts: ей нужен свой случайный nonce на каждый запрос,
// а next.config.ts выполняется один раз при старте сервера, не на запрос.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Дублирует frame-ancestors 'none' из CSP для браузеров, которые ещё не разбирают
          // CSP3, — защита от кликджекинга (встраивания страницы входа/настроек в невидимый iframe).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
