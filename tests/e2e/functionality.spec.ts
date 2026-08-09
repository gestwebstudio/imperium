import { expect, test, type Page } from "@playwright/test";

const STORAGE_KEY = "imperium-vehicle-actions";

async function seedVehicleActions(
  page: Page,
  {
    favorites = [],
    comparisons = [],
  }: { favorites?: string[]; comparisons?: string[] },
) {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: { favorites, comparisons } },
  );
}

async function storedActions(page: Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}"), STORAGE_KEY);
}

test("главный слайдер, избранное и мобильное меню работают", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Премиальные автомобили в москве/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Показать Porsche 911 Carrera 4 GTS" }).click();
  await expect(
    page
      .locator('.hero__card:not([aria-hidden="true"])')
      .getByRole("link", { name: "Подробнее: Porsche 911 Carrera 4 GTS" }),
  ).toBeVisible();

  const activeFavorite = page
    .locator('.hero__card:not([aria-hidden="true"])')
    .getByRole("button", { name: "В избранное" });
  await activeFavorite.click();
  await expect.poll(() => storedActions(page)).toMatchObject({
    favorites: ["porsche-911-carrera-4-gts"],
  });

  await page.goto("/favorites");
  await expect(page.getByRole("heading", { name: "Избранное" })).toBeVisible();
  await expect(page.getByText("911 Carrera 4 GTS").first()).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  const menu = page.getByRole("dialog", { name: "Меню" });
  await expect(menu).toBeVisible();
  const labels = await menu.locator(".mobile-menu__item-label").allTextContents();
  expect(labels.slice(0, 2)).toEqual(["Избранное", "Сравнение"]);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("каталог сортирует, фильтрует и закрывает мобильный Sheet", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByRole("heading", { name: "Автомобили в наличии" })).toBeVisible();

  await page.locator(".cat-sort").click();
  await page.getByRole("menuitemradio", { name: "Сначала дешевле" }).click();
  const priceTexts = await page.locator(".catalog-grid .price-block__value").allTextContents();
  const prices = priceTexts.slice(0, 8).map((value) => Number(value.replace(/\D/g, "")));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));

  await page.getByRole("button", { name: "Бренд" }).click();
  const bmwFilter = page.getByRole("checkbox", { name: "BMW" });
  await bmwFilter.focus();
  await page.keyboard.press("Space");
  await expect(bmwFilter).toBeChecked();
  await expect(page.getByRole("button", { name: "Очистить фильтр «Бренд»" })).toBeVisible();
  const visibleBrands = await page.locator(".catalog-grid .car-card__brand img").evaluateAll(
    (images) => images.map((image) => image.getAttribute("alt")),
  );
  expect(visibleBrands.length).toBeGreaterThan(0);
  expect(visibleBrands.every((brand) => brand === "BMW")).toBe(true);

  await page.getByRole("button", { name: "Очистить фильтр «Бренд»" }).click();
  await expect(page.getByText("Нет выбранных фильтров")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/catalog");
  await page.getByRole("button", { name: /Фильтры/ }).click();
  await expect(page.locator(".cat-filters.is-open")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(page.locator(".cat-filters.is-open")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("страница автомобиля сохраняет действия, раскрывает характеристики и отправляет заявку", async ({
  page,
}) => {
  await page.goto("/catalog/v-class-exclusive");
  await expect(
    page.getByRole("heading", { name: "Mercedes-Benz V-Класс Exclusive" }),
  ).toBeVisible();

  await page.locator(".car-title__actions").getByRole("button", { name: "В избранное" }).click();
  await page.locator(".car-title__actions").getByRole("button", { name: "В сравнение" }).click();
  await expect.poll(() => storedActions(page)).toEqual({
    favorites: ["v-class-exclusive"],
    comparisons: ["v-class-exclusive"],
  });

  await page.getByRole("button", { name: "Развернуть" }).click();
  await expect(page.getByText("Объём двигателя").first()).toBeVisible();
  await page.getByRole("button", { name: "Свернуть" }).click();

  await page.getByRole("button", { name: "Показать все фото" }).click();
  await expect(page.getByRole("heading", { name: "Фотографии автомобиля" })).toBeVisible();
  await page.getByRole("tab", { name: "Интерьер" }).click();
  await expect(page.getByRole("tabpanel", { name: "Интерьер" })).toBeVisible();
  await page.getByRole("button", { name: "Закрыть галерею" }).click();

  await page.locator(".car-price").getByRole("button", { name: "Забронировать" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder("Как к вам обращаться").fill("Анна");
  await dialog.getByPlaceholder("+7 999 000-00-00").fill("+7 999 111-22-33");
  await dialog.getByRole("button", { name: "Забронировать" }).click();
  await expect(dialog.getByRole("heading", { name: "Автомобиль забронирован" })).toBeVisible();
  await dialog.getByRole("button", { name: "Готово" }).click();
  await expect(dialog).toBeHidden();
});

test("на странице автомобиля шапка уходит со страницей, а цена закрепляется сверху", async ({
  page,
}) => {
  await page.goto("/catalog/v-class-exclusive");

  await expect(page.locator(".site-header")).toHaveCSS("position", "absolute");
  await expect(page.locator(".car-price")).toHaveCSS("position", "sticky");

  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect
    .poll(async () => Math.round((await page.locator(".car-price").boundingBox())?.y ?? -1))
    .toBe(18);

  const headerBox = await page.locator(".site-header").boundingBox();
  expect(headerBox?.y ?? 0).toBeLessThan(0);
});

test("избранное отображает только сохранённые машины и позволяет удалить их", async ({ page }) => {
  await seedVehicleActions(page, {
    favorites: ["v-class-exclusive", "cle-53-amg-4matic", "unknown"],
  });
  await page.goto("/favorites");

  await expect(page.locator(".favorites-grid .car-card")).toHaveCount(2);
  await page
    .locator(".favorites-grid .car-card")
    .first()
    .getByRole("button", { name: "Убрать из избранного" })
    .click();
  await expect(page.locator(".favorites-grid .car-card")).toHaveCount(1);
  await expect.poll(() => storedActions(page)).toMatchObject({
    favorites: ["cle-53-amg-4matic"],
  });
});

test("сравнение синхронизирует карточки и значения, листает и фильтрует различия", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await seedVehicleActions(page, {
    comparisons: [
      "v-class-exclusive",
      "cle-53-amg-4matic",
      "x5-m60i-sport-pro",
      "porsche-911-turbo-s",
      "lexus-gx-executive",
    ],
  });
  await page.goto("/comparison");

  await expect(page.locator(".comparison-products .car-card")).toHaveCount(4);
  const cardsBefore = await page.locator(".comparison-products .car-card__title").allTextContents();
  expect(cardsBefore).toEqual([
    "V-Класс Exclusive",
    "CLE 53 AMG 4MATIC+",
    "X5 M60i Sport Pro",
    "911 Turbo S",
  ]);

  const cardPrices = await page.locator(".comparison-products .price-block__value").allTextContents();
  const tablePrices = await page
    .locator(".comparison-characteristic")
    .filter({ has: page.locator(".comparison-characteristic__label", { hasText: "Стоимость" }) })
    .locator(".comparison-characteristic__value")
    .allTextContents();
  expect(tablePrices).toEqual(cardPrices);

  await page.locator(".comparison-products__nav--next").click();
  await expect(page.locator(".comparison-products .car-card__title").first()).toHaveText(
    "CLE 53 AMG 4MATIC+",
  );
  await expect(
    page.locator(".comparison-characteristic").first().locator(".comparison-characteristic__value"),
  ).toHaveCount(4);

  const differences = page.getByRole("switch", { name: "Только различия" });
  await differences.focus();
  await page.keyboard.press("Space");
  await expect(differences).toBeChecked();
  await expect(page.locator(".comparison-characteristic__label", { hasText: "Гарантия" })).toHaveCount(0);

  await page.getByRole("button", { name: "Поделиться" }).click();
  await expect(page.getByRole("button", { name: "Ссылка скопирована" })).toBeVisible();

  await page
    .locator(".comparison-products .car-card")
    .first()
    .getByRole("button", { name: "Убрать из сравнения" })
    .click();
  await expect(page.locator(".comparison-head__title .badge")).toHaveText("4");
});

test("мобильное сравнение не выходит за viewport и сохраняет соответствие колонок", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedVehicleActions(page, {
    comparisons: [
      "v-class-exclusive",
      "cle-53-amg-4matic",
      "x5-m60i-sport-pro",
      "porsche-911-turbo-s",
      "lexus-gx-executive",
    ],
  });
  await page.goto("/comparison");

  await expect(page.locator(".comparison-products .car-card")).toHaveCount(2);
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);

  const assertColumnsMatch = async () => {
    const cardPrices = await page.locator(".comparison-products .price-block__value").allTextContents();
    const tablePrices = await page
      .locator(".comparison-characteristic")
      .first()
      .locator(".comparison-characteristic__value")
      .allTextContents();
    expect(tablePrices).toEqual(cardPrices);
  };
  await assertColumnsMatch();

  const columns = page.locator(".comparison-products__column");
  await columns
    .nth(0)
    .getByRole("button", { name: "Показать следующий автомобиль" })
    .click();
  await expect(columns.nth(0).locator(".car-card__title")).toHaveText(
    "X5 M60i Sport Pro",
  );
  await expect(columns.nth(1).locator(".car-card__title")).toHaveText(
    "CLE 53 AMG 4MATIC+",
  );
  await assertColumnsMatch();

  await columns
    .nth(1)
    .getByRole("button", { name: "Показать следующий автомобиль" })
    .click();
  await expect(columns.nth(0).locator(".car-card__title")).toHaveText(
    "X5 M60i Sport Pro",
  );
  await expect(columns.nth(1).locator(".car-card__title")).toHaveText(
    "911 Turbo S",
  );
  await assertColumnsMatch();
});

test("shared comparison применяет валидные slug, убирает дубли и очищает URL", async ({ page }) => {
  await seedVehicleActions(page, { comparisons: ["x5-m60i-sport-pro"] });
  await page.goto(
    "/comparison?cars=v-class-exclusive,cle-53-amg-4matic,v-class-exclusive,missing",
  );

  await expect(page).toHaveURL(/\/comparison$/);
  await expect(page.locator(".comparison-products .car-card")).toHaveCount(2);
  await expect.poll(() => storedActions(page)).toMatchObject({
    comparisons: ["v-class-exclusive", "cle-53-amg-4matic"],
  });
});
