import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/catalog",
  "/catalog/v-class-exclusive",
  "/favorites",
  "/comparison",
  "/contacts",
  "/about",
  "/news",
  "/news/bugatti-tourbillon",
  "/help-on-roads",
  "/help-on-road",
  "/leasing",
  "/trade-in",
  "/car-selection",
  "/atelier",
  "/veles",
  "/bmw",
  "/mercedes",
  "/land-rover",
  "/porsche",
  "/ferrari",
  "/lamborghini",
  "/rolls-royce",
  "/lexus",
  "/chevrolet",
  "/honda",
  "/hyundai",
  "/toyota",
  "/volvo",
  "/byd",
  "/gmc",
  "/sedan",
  "/coupe",
  "/crossover",
  "/cabriolet",
  "/minivan",
  "/off-road",
] as const;

test.describe("публичные маршруты", () => {
  for (const route of publicRoutes) {
    test(`${route} открывается без серверной ошибки`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response, `Нет HTTP-ответа для ${route}`).not.toBeNull();
      expect(response!.status(), `Некорректный статус ${route}`).toBeLessThan(400);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(page.locator("body")).not.toContainText(
        /Application error|Internal Server Error|This page could not be found/i,
      );
    });
  }

  test("неизвестный автомобиль возвращает 404", async ({ page }) => {
    const response = await page.goto("/catalog/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("admin без сессии перенаправляется на страницу входа", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: /вход/i })).toBeVisible();
  });
});
