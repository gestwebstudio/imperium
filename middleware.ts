import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Вход не защищаем — иначе не залогиниться.
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const value = req.cookies.get(ADMIN_COOKIE)?.value;
  if (value && value === process.env.ADMIN_PASSWORD) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
