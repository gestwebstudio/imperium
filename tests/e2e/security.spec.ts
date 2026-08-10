import { expect, test } from "@playwright/test";

test("защищает все admin routes и оставляет login публичным", async ({
  page,
  request,
}) => {
  const protectedRoutes = [
    "/admin",
    "/admin/news",
    "/admin/news/new",
    "/admin/news/nonexistent-id",
    "/admin/reviews",
    "/admin/reviews/new",
    "/admin/reviews/nonexistent-id",
  ];
  for (const route of protectedRoutes) {
    const protectedResponse = await request.get(route, { maxRedirects: 0 });
    expect(protectedResponse.status(), route).toBe(307);
    expect(protectedResponse.headers().location, route).toBe("/admin/login");
    expect(protectedResponse.headers()["cache-control"], route).toContain(
      "no-store",
    );
    const body = await protectedResponse.text();
    expect(body).not.toContain("Bugatti Tourbillon");
    expect(body).not.toContain("BMW 7 Series");
  }

  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Вход в админку" })).toBeVisible();
  await expect(page.getByLabel("Пароль")).toBeVisible();
});

test("отдаёт security headers на ключевых страницах", async ({ request }) => {
  const routes = [
    "/",
    "/catalog",
    "/catalog/porsche-911-turbo-s",
    "/comparison",
    "/favorites",
    "/admin/login",
  ];
  for (const route of routes) {
    const response = await request.get(route);
    const headers = response.headers();
    expect(headers["content-security-policy"], route).toContain(
      "default-src 'self'",
    );
    expect(headers["content-security-policy"], route).toContain(
      "frame-src https://yandex.ru https://vk.com",
    );
    expect(headers["x-content-type-options"], route).toBe("nosniff");
    expect(headers["x-frame-options"], route).toBe("DENY");
    expect(headers["referrer-policy"], route).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers["permissions-policy"], route).toContain("camera=()");
    expect(headers["x-powered-by"], route).toBeUndefined();
  }
});

test("сохраняет self-hosted fonts и referrer policy карты", async ({ page }) => {
  await page.goto("/contacts");
  const map = page.getByTitle("Карта — Imperium Motors, Кутузовский проспект 48");
  await expect(map).toHaveAttribute(
    "referrerpolicy",
    "strict-origin-when-cross-origin",
  );
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).fontFamily))
    .toContain("Onest");
});
