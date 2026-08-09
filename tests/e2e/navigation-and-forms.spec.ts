import { expect, test } from "@playwright/test";

test("меню услуг закрывается по Escape, а телефоны копируются", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const servicesTrigger = page.getByRole("button", { name: "Услуги" });
  await servicesTrigger.click();
  await expect(servicesTrigger).toHaveAttribute("aria-expanded", "true");
  const servicesPanel = page.locator("#services-mega-panel");
  await expect(servicesPanel.getByRole("link", { name: "Трейд-ин" })).toBeVisible();
  await expect(
    servicesPanel.getByRole("link", { name: "Помощь на дорогах" }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(servicesTrigger).toHaveAttribute("aria-expanded", "false");

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
