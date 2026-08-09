import { expect, test, type Locator } from "@playwright/test";

const headerLayouts = [
  { width: 390, barWidth: 350, gutter: 20, barHeight: 58, logoWidth: 201, logoHeight: 20, control: 36, desktop: false },
  { width: 480, barWidth: 440, gutter: 20, barHeight: 58, logoWidth: 201, logoHeight: 20, control: 36, desktop: false },
  { width: 640, barWidth: 580, gutter: 30, barHeight: 66, logoWidth: 275, logoHeight: 26, control: 44, desktop: false },
  { width: 768, barWidth: 688, gutter: 40, barHeight: 66, logoWidth: 275, logoHeight: 26, control: 44, desktop: false },
  { width: 960, barWidth: 880, gutter: 40, barHeight: 66, logoWidth: 275, logoHeight: 26, control: 44, desktop: false },
  { width: 1200, barWidth: 1120, gutter: 40, barHeight: 66, logoWidth: 241, logoHeight: 23, control: 36, desktop: true },
  { width: 1536, barWidth: 1416, gutter: 60, barHeight: 66, logoWidth: 273, logoHeight: 26, control: 36, desktop: true },
  { width: 1920, barWidth: 1880, gutter: 20, barHeight: 78, logoWidth: 336, logoHeight: 32, control: 46, desktop: true },
] as const;

async function expectBox(
  locator: Locator,
  expected: { x?: number; y?: number; width?: number; height?: number },
) {
  const box = await locator.boundingBox();
  expect(box, "Элемент не имеет видимой геометрии").not.toBeNull();

  for (const [property, value] of Object.entries(expected)) {
    expect(
      Math.abs(box![property as keyof typeof expected]! - value),
      `${property}: ${box![property as keyof typeof expected]} вместо ${value}`,
    ).toBeLessThanOrEqual(1);
  }
}

for (const layout of headerLayouts) {
  test(`хедер соответствует макету на ${layout.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: layout.width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bar = page.locator(".site-header__bar");
    await expectBox(bar, {
      x: layout.gutter,
      y: 18,
      width: layout.barWidth,
      height: layout.barHeight,
    });
    await expect(bar).toHaveCSS("border-radius", "50px");

    await expectBox(page.locator(".site-header__logo img"), {
      width: layout.logoWidth,
      height: layout.logoHeight,
    });

    const nav = page.locator(".site-header__nav");
    const burger = page.getByRole("button", { name: "Открыть меню" });
    const call = page.locator(".header-call");
    const cta = page.locator(".site-header__cta");

    if (layout.desktop) {
      await expect(nav).toBeVisible();
      await expect(burger).toBeHidden();
      await expectBox(call, { width: layout.control, height: layout.control });
      await expectBox(cta, { height: layout.control });
      await expect(cta).toHaveCSS("font-size", layout.width === 1920 ? "18px" : "16px");
      await expect(cta).toHaveCSS("line-height", layout.width === 1920 ? "24px" : "20px");
    } else {
      await expect(nav).toBeHidden();
      await expect(burger).toBeVisible();
      await expectBox(burger, { width: layout.control, height: layout.control });
      await expect(call).toBeHidden();
      await expect(cta).toBeHidden();
    }
  });
}

test("CTA M в UI Kit соответствует компоненту хедера из Figma", async ({ page }) => {
  await page.goto("/kit", { waitUntil: "domcontentloaded" });

  const cta = page.locator(".btn--primary-cta.btn--m").first();
  await expect(cta).toBeVisible();
  await expectBox(cta, { height: 36 });
  await expect(cta).toHaveCSS("border-width", "0px");
  await expect(cta).toHaveCSS("padding", "0px 0px 0px 18px");
  await expect(cta).toHaveCSS("gap", "12px");
  await expect(cta).toHaveCSS("font-size", "16px");
  await expect(cta).toHaveCSS("line-height", "20px");
  await expectBox(cta.locator(".btn__cta-icon"), { width: 36, height: 36 });
  await expectBox(cta.locator(".btn__cta-icon svg"), { width: 12, height: 12 });
});
