import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CSP со случайным nonce на каждый запрос вместо 'unsafe-inline' для script-src. Next.js сам читает
// nonce из заголовка Content-Security-Policy этого же ответа и подставляет его в свои инлайн-скрипты
// (данные гидратации, RSC-пейлоад) — самим ничего вручную помечать не нужно. С 'strict-dynamic'
// скрипты, догруженные уже выполнившимся кодом (чанки вебпака), тоже разрешены без своего nonce —
// это и есть механизм, которым Next.js подгружает остальные части бандла.
//
// 'unsafe-eval' — только в разработке: Fast Refresh (`next dev`) собирает модули через eval(),
// без него горячая перезагрузка падает с CSP-ошибкой. В `next build` + `next start` eval не
// используется — проверено на собранном бандле и в браузере, ошибок консоли нет.
//
// style-src остаётся с 'unsafe-inline': два места в коде задают ширину полосы прогресса через
// style={{ width }} — это HTML-атрибут style, а не <style>-тег, обычный nonce на него не действует
// (нужен отдельный style-src-attr с непостоянной поддержкой в браузерах). Риск низкий — значения
// это числа из своего кода, не пользовательский ввод.
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "media-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Не трогаем статику: чанкам и картинкам nonce не нужен, а лишний проход middleware на
    // каждый файл — просто потерянное время.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
