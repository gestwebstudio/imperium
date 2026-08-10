import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { config, proxy } from "@/proxy";

function request(path: string, token?: string) {
  return new NextRequest(`https://imperium.test${path}`, {
    headers: token ? { cookie: `admin_session=${token}` } : undefined,
  });
}

describe("admin proxy", () => {
  it("оставляет страницу входа публичной", () => {
    const response = proxy(request("/admin/login"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(proxy(request("/admin/login/")).headers.get("x-middleware-next")).toBe(
      "1",
    );
  });

  it("пропускает только структурно валидный opaque token для проверки в layout", () => {
    const response = proxy(request("/admin/news", "a".repeat(43)));
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it.each([undefined, "secret", "a".repeat(42), "!".repeat(43)])(
    "перенаправляет отсутствующий или некорректный token: %s",
    (token) => {
      const response = proxy(request("/admin/reviews?tab=drafts", token));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "https://imperium.test/admin/login",
      );
    },
  );

  it("защищает все admin-маршруты matcher-конфигурацией", () => {
    expect(config.matcher).toEqual(["/admin", "/admin/:path*"]);
  });
});
