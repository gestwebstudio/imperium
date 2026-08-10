import { expect, test } from "@playwright/test";

test("меню услуг закрывается по Escape, а телефоны копируются", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const servicesTrigger = page.getByRole("button", { name: "Услуги" });
  await expect(servicesTrigger).toHaveClass(/ui-button--no-ripple/);
  await expect(
    servicesTrigger.locator(":scope > .ui-button__ripple-layer"),
  ).toHaveCount(0);
  await servicesTrigger.click();
  await expect(servicesTrigger).toHaveAttribute("aria-expanded", "true");
  const servicesPanel = page.locator("#services-mega-panel");
  await expect(servicesPanel.getByRole("link", { name: "Трейд-ин" })).toBeVisible();
  await expect(
    servicesPanel.getByRole("link", { name: "Помощь на дорогах" }),
  ).toBeVisible();

  await servicesPanel.getByRole("link", { name: "Трейд-ин" }).focus();
  await page.keyboard.press("Escape");
  await expect(servicesTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(servicesTrigger).toBeFocused();

  await page.getByRole("link", { name: "Позвонить: +7 499 704-14-44" }).click();
  await expect(page.locator(".header-copy-alert")).toContainText("Номер скопирован");
  await expect(page.evaluate(() => navigator.clipboard.readText())).resolves.toBe(
    "+7 499 704-14-44",
  );

  await page.getByRole("button", { name: "Закрыть уведомление" }).click();
  await expect(page.locator(".header-copy-alert")).not.toHaveClass(/is-visible/);

  const footerCopy = page.getByRole("button", {
    name: "Скопировать номер телефона",
  });
  await footerCopy.scrollIntoViewIfNeeded();
  await footerCopy.click();
  await expect(page.locator(".footer-phone__hint")).toHaveText("Номер скопирован");
  await expect(page.locator(".footer-phone__hint")).toHaveClass(/is-visible/);
});

test("headroom учитывает верхний порог, а Services Mega игнорирует микроскролл", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const header = page.locator(".site-header");
  await page.evaluate(() => window.scrollTo(0, 100));
  await expect(header).not.toHaveClass(/is-hidden/);

  await page.evaluate(() => window.scrollTo(0, 140));
  await expect(header).toHaveClass(/is-hidden/);

  await page.evaluate(() => window.scrollTo(0, 130));
  await expect(header).not.toHaveClass(/is-hidden/);

  await page.evaluate(() => window.scrollTo(0, 0));
  const servicesTrigger = page.getByRole("button", { name: "Услуги" });
  await servicesTrigger.click();

  await page.evaluate(() => window.scrollTo(0, 6));
  await page.evaluate(() => window.scrollTo(0, 12));
  await expect(servicesTrigger).toHaveAttribute("aria-expanded", "true");

  await page.evaluate(() => window.scrollTo(0, 20));
  await expect(servicesTrigger).toHaveAttribute("aria-expanded", "false");

  await page.goto("/catalog");
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(page.locator(".site-header")).toHaveCSS("position", "absolute");
  await expect(page.locator(".site-header")).not.toHaveClass(/is-hidden/);
});

test("MobileMenu сохраняет body overflow, корректную семантику и focus trap", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => {
    document.body.style.overflow = "clip";
  });

  const trigger = page.getByRole("button", { name: "Открыть меню" });
  await trigger.click();
  const menu = page.locator("#mobile-staggered-menu");
  const dialog = page.getByRole("dialog", { name: "Меню" });
  await expect(dialog).toBeVisible();
  await expect(menu.locator(".mobile-menu__backdrop")).toHaveAttribute(
    "tabindex",
    "-1",
  );
  await expect(dialog.locator("nav > ul.mobile-menu__list")).toHaveCount(1);
  await expect(dialog.locator("nav > ol")).toHaveCount(0);
  await expect(dialog.locator(".mobile-menu__list")).toHaveCSS("gap", "8px");
  const close = dialog.getByRole("button", { name: "Закрыть меню" });
  await expect(close).toHaveClass(/ui-button--no-ripple/);
  await expect(close.locator(":scope > .ui-button__ripple-layer")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );

  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press(index % 2 === 0 ? "Tab" : "Shift+Tab");
    await expect
      .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
      .toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(
    "clip",
  );

  await page.setViewportSize({ width: 1024, height: 768 });
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".mobile-menu__list")).toHaveCSS("gap", "16px");
  await menu.locator(".mobile-menu__backdrop").click({ position: { x: 10, y: 300 } });
  await expect(dialog).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(
    "clip",
  );
});

test("FloatingVehicleActions отмечает текущую страницу без повторной навигации", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/favorites");

  const floating = page.locator(".floating-vehicle-actions");
  const currentFavorite = floating.locator('[aria-current="page"]');
  await expect(currentFavorite).toHaveAttribute("aria-label", "В избранном: 0");
  await expect(currentFavorite).not.toHaveAttribute("href");
  await expect(floating.getByRole("link", { name: "В сравнении: 0" })).toBeVisible();
  await expect(currentFavorite).toHaveCSS("color", "rgb(41, 68, 52)");

  const hitArea = await currentFavorite.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  expect(hitArea).toEqual({ width: 40, height: 40 });

  await page.goto("/comparison");
  const currentComparison = floating.locator('[aria-current="page"]');
  await expect(currentComparison).toHaveAttribute("aria-label", "В сравнении: 0");
  await expect(currentComparison).not.toHaveAttribute("href");
  await expect(floating.getByRole("link", { name: "В избранном: 0" })).toBeVisible();
});

test("универсальная заявка принимает контакты, комментарий и фотографии", async ({
  page,
}) => {
  await page.goto("/trade-in");
  await page.getByRole("button", { name: "Экспресс-оценка", exact: true }).click();

  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Экспресс-оценка автомобиля" }),
  ).toBeVisible();

  await dialog.getByPlaceholder("Как к вам обращаться").fill("Анна");
  await dialog.getByPlaceholder("+7 999 000-00-00").fill("+7 999 111-22-33");
  await dialog.getByPlaceholder("Марка, модель, год, пробег").fill(
    "Mercedes-Benz, 2022, 35 000 км",
  );
  await dialog.locator('input[type="file"]').setInputFiles([
    {
      name: "front.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("front-photo"),
    },
    {
      name: "interior.png",
      mimeType: "image/png",
      buffer: Buffer.from("interior-photo"),
    },
  ]);
  await expect(dialog.locator(".lead-modal__file-info")).toHaveText(
    "front.jpg, interior.png",
  );

  const consent = dialog.getByRole("checkbox", {
    name: /соглашаетесь на обработку персональных данных/i,
  });
  await consent.focus();
  await page.keyboard.press("Space");
  await expect(consent).toBeChecked();

  await dialog.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(dialog.getByRole("heading", { name: "Заявка принята" })).toBeVisible();
  await dialog.getByRole("button", { name: "Готово" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Экспресс-оценка", exact: true }).click();
  await expect(dialog.getByPlaceholder("Как к вам обращаться")).toHaveValue("");
  await expect(dialog.locator(".lead-modal__file-info")).toHaveText(
    "Можно прикрепить несколько фото — необязательно",
  );
  await dialog.getByRole("button", { name: "Отмена" }).click();
  await expect(dialog).toBeHidden();
});

test("галерея салона открывается и управляется с клавиатуры", async ({ page }) => {
  await page.goto("/about");

  const gallery = page.getByLabel("Интерьер салона Imperium Motors").last();
  await gallery.getByRole("button", { name: /Открыть галерею/ }).first().click();
  await expect(page.getByRole("button", { name: "Следующее фото" })).toBeVisible();
  await page.getByRole("button", { name: "Следующее фото" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Закрыть фотографию" })).toBeHidden();
});
