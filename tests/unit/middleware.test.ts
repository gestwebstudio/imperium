import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { config, middleware } from "@/middleware";

function request(path: string, cookie?: string) {
  return new NextRequest(`https://imperium.test${path}`, {
    headers: cookie ? { cookie: `admin_session=${cookie}` } : undefined,
  });
}

afterEach(() => {
  delete process.env.ADMIN_PASSWORD;
});

describe("admin middleware", () => {
  it("не защищает страницу входа", () => {
    const response = middleware(request("/admin/login"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("пропускает запрос с корректной сессией", () => {
    process.env.ADMIN_PASSWORD = "secret";
    const response = middleware(request("/admin/news", "secret"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("перенаправляет неавторизованный запрос и очищает query", () => {
    process.env.ADMIN_PASSWORD = "secret";
    const response = middleware(request("/admin/reviews?tab=drafts", "wrong"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://imperium.test/admin/login",
    );
  });

  it("защищает admin-маршруты конфигурацией matcher", () => {
    expect(config.matcher).toEqual(["/admin", "/admin/:path*"]);
  });
});
