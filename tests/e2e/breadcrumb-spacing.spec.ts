import { expect, test } from "@playwright/test";

const routesWithBreadcrumbs = [
  "/comparison",
  "/catalog",
  "/catalog/v-class-exclusive",
  "/favorites",
  "/contacts",
  "/news",
  "/news/bugatti-tourbillon",
  "/trade-in",
  "/leasing",
  "/car-selection",
  "/atelier",
  "/veles",
  "/help-on-roads",
  "/help-on-road",
  "/about",
  "/bmw",
] as const;

const comparisonReference = [
  { width: 390, top: 106 },
  { width: 480, top: 106 },
  { width: 640, top: 134 },
  { width: 768, top: 134 },
  { width: 960, top: 134 },
  { width: 1200, top: 134 },
  { width: 1536, top: 124 },
  { width: 1920, top: 156 },
] as const;

for (const breakpoint of comparisonReference) {
  test(`крошки совпадают с эталоном сравнения на ${breakpoint.width}px`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: breakpoint.width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const route of routesWithBreadcrumbs) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response, `Нет HTTP-ответа для ${route}`).not.toBeNull();
      expect(response!.status(), `Некорректный статус ${route}`).toBeLessThan(400);

      const crumbs = page.locator(".ui-crumbs").first();
      await expect(crumbs, `Крошки не найдены на ${route}`).toBeVisible();

      const top = await crumbs.evaluate(
        (element) => element.getBoundingClientRect().top + window.scrollY,
      );
      expect(
        Math.abs(top - breakpoint.top),
        `${route}: верх крошек ${top}px вместо ${breakpoint.top}px`,
      ).toBeLessThanOrEqual(1);
    }
  });
}
