import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_session";
const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const ADMIN_CACHE_CONTROL = "private, no-store, max-age=0, must-revalidate";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", ADMIN_CACHE_CONTROL);
  return response;
}

/**
 * Быстрый ранний редирект. Это не граница авторизации: подлинность сессии
 * проверяет защищённый server layout через requireAdmin() и базу данных.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return noStore(NextResponse.next());
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (token && SESSION_TOKEN_PATTERN.test(token)) {
    return noStore(NextResponse.next());
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return noStore(NextResponse.redirect(url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
