import { expect, test, type Page } from "@playwright/test";

async function openFacet(page: Page, name: string) {
  const trigger = page.getByRole("button", { name, exact: true });
  if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
}

test("мобильный drawer сохраняет body, изолирует фон и удерживает фокус", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 700 });
  await page.goto("/catalog");
  await expect
    .poll(() =>
      page.locator(".cat-filters").evaluate((sidebar) =>
        Boolean(sidebar.closest(".ui-sheet-layer")),
      ),
    )
    .toBe(true);
  await page.evaluate(() => {
    document.body.style.overflow = "clip";
  });
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("clip");

  const trigger = page.getByRole("button", { name: /Фильтры/ });
  await expect(trigger).toHaveClass(/ui-button--no-ripple/);
  await expect(trigger.locator(":scope > .ui-button__ripple-layer")).toHaveCount(0);
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Фильтры" });
  const close = dialog.getByRole("button", { name: "Закрыть фильтры" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(close).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await expect
    .poll(() => page.locator(".page-transition").evaluate((node) => (node as HTMLElement).inert))
    .toBe(true);

  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
    .toBe(true);
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();

  await dialog.getByText("Выбранные категории").click();
  await expect(dialog).toBeVisible();
  await page.locator(".cat-filters-backdrop").click({ position: { x: 20, y: 300 } });
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("clip");
  await expect
    .poll(() => page.locator(".page-transition").evaluate((node) => (node as HTMLElement).inert))
    .toBe(false);

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("range input применяет значение только при commit и empty-state сбрасывает фильтры", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 768 });
  await page.goto("/catalog");

  const count = page.locator(".catalog-head__title .badge");
  const initialCount = await count.textContent();
  const priceFrom = page.getByRole("textbox", { name: "Цена, ₽: от" });

  await priceFrom.fill("50000000");
  await expect(priceFrom).toHaveValue("50 000 000");
  await expect(count).toHaveText(initialCount ?? "");
  expect(new URL(page.url()).searchParams.has("priceMin")).toBe(false);

  await priceFrom.press("Enter");
  await expect(count).toHaveText("0");
  await expect(page.getByText("По заданным фильтрам ничего не найдено.")).toBeVisible();
  await expect
    .poll(() => new URL(page.url()).searchParams.get("priceMin"))
    .toBe("50000000");

  await page.getByRole("button", { name: "Сбросить фильтры" }).click();
  await expect(count).toHaveText(initialCount ?? "");
  await expect(page.locator(".catalog-grid .car-card").first()).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.has("priceMin")).toBe(false);
});

test("query params восстанавливают каталог и работают с Back/Forward", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(
    "/catalog?brand=BMW&priceMin=7000000&priceMax=45000000&powerMin=200&powerMax=800&sort=price-desc",
  );

  await expect(page.getByRole("button", { name: "Очистить фильтр «Бренд»" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Цена, ₽: от" })).toHaveValue("7 000 000");
  await expect(page.getByRole("textbox", { name: "Цена, ₽: до" })).toHaveValue("45 000 000");
  await expect(page.getByRole("textbox", { name: "Мощность, л.с.: от" })).toHaveValue("200");
  await expect(page.getByRole("textbox", { name: "Мощность, л.с.: до" })).toHaveValue("800");
  const prices = (await page.locator(".catalog-grid .price-block__value").allTextContents())
    .slice(0, 8)
    .map((value) => Number(value.replace(/\D/g, "")));
  expect(prices).toEqual([...prices].sort((a, b) => b - a));

  await openFacet(page, "Бренд");
  const mercedes = page.getByRole("checkbox", { name: "Mercedes-Benz" });
  await mercedes.focus();
  await page.keyboard.press("Space");
  await expect
    .poll(() => new URL(page.url()).searchParams.get("brand"))
    .toBe("BMW,Mercedes-Benz");
  await expect(mercedes).toBeChecked();

  await page.goBack();
  await expect.poll(() => new URL(page.url()).searchParams.get("brand")).toBe("BMW");
  await expect(mercedes).not.toBeChecked();

  await page.goForward();
  await expect
    .poll(() => new URL(page.url()).searchParams.get("brand"))
    .toBe("BMW,Mercedes-Benz");
  await expect(mercedes).toBeChecked();
});

test("текстовая сортировка без ripple, а tooltip выбранного фильтра доступен с клавиатуры", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/catalog");

  const sort = page.locator(".cat-sort");
  await expect(sort).toHaveClass(/ui-button--no-ripple/);
  await expect(sort.locator(":scope > .ui-button__ripple-layer")).toHaveCount(0);

  for (let index = 0; index < 20 && !(await sort.evaluate((node) => node === document.activeElement)); index += 1) {
    await page.keyboard.press("Tab");
  }
  await expect(sort).toBeFocused();
  await expect(sort).toHaveAttribute("data-focus-visible", "true");
  await expect(sort).toHaveCSS("outline-style", "solid");

  await sort.click();
  await page.getByRole("menuitemradio", { name: "Сначала дешевле" }).click();
  await expect(sort).toBeFocused();
  await expect(sort).not.toHaveAttribute("data-focus-visible");
  await expect(sort).toHaveCSS("outline-style", "none");

  const brandTrigger = page.getByRole("button", { name: "Бренд", exact: true });
  await expect(brandTrigger).toHaveClass(/ui-button--no-ripple/);
  await expect(
    brandTrigger.locator(":scope > .ui-button__ripple-layer"),
  ).toHaveCount(0);
  await brandTrigger.focus();
  await page.keyboard.press("Space");
  await expect(brandTrigger).toHaveAttribute("aria-expanded", "true");

  await openFacet(page, "Бренд");
  const bmw = page.getByRole("checkbox", { name: "BMW" });
  const mercedes = page.getByRole("checkbox", { name: "Mercedes-Benz" });
  await bmw.focus();
  await page.keyboard.press("Space");
  await mercedes.focus();
  await page.keyboard.press("Space");

  const selectedChip = page.getByRole("button", { name: "Очистить фильтр «Бренд»" });
  const tooltip = page.getByRole("tooltip", { name: /BMW, Mercedes-Benz/ });
  await selectedChip.focus();
  await expect(tooltip).toHaveCSS("visibility", "visible");
  await expect(tooltip).toHaveCSS("opacity", "1");
});

test("каждый facet фильтрует каталог и очищается существующим clearFacet", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/catalog");
  const initialCount = Number(
    (await page.locator(".catalog-head__title .badge").textContent())?.trim(),
  );
  const cases = [
    { facet: "Бренд", key: "brand", role: "checkbox", option: "BMW", value: "BMW" },
    { facet: "Модель", key: "model", role: "checkbox", option: "X5 M60i Sport Pro", value: "X5 M60i Sport Pro" },
    { facet: "Цвет", key: "color", role: "button", option: "Цвет: Чёрный", value: "black" },
    { facet: "Кузов", key: "body", role: "checkbox", option: "Кроссовер", value: "Кроссовер" },
    { facet: "Коробка", key: "transmission", role: "checkbox", option: "Автомат", value: "Автомат" },
    { facet: "Привод", key: "drive", role: "checkbox", option: "Полный", value: "Полный" },
    { facet: "Тип топлива", key: "fuel", role: "checkbox", option: "Бензин", value: "Бензин" },
  ] as const;

  for (const item of cases) {
    await openFacet(page, item.facet);
    const option = page.getByRole(item.role, { name: item.option, exact: true });
    await option.focus();
    await page.keyboard.press("Space");

    const clear = page.getByRole("button", {
      name: `Очистить фильтр «${item.facet}»`,
    });
    await expect(clear).toBeVisible();
    await expect
      .poll(async () => Number((await page.locator(".catalog-head__title .badge").textContent())?.trim()))
      .toBeLessThan(initialCount);
    await expect.poll(() => new URL(page.url()).searchParams.get(item.key)).toBe(item.value);

    await clear.click();
    await expect(clear).toBeHidden();
    await expect(page.locator(".catalog-head__title .badge")).toHaveText(String(initialCount));
    await expect.poll(() => new URL(page.url()).searchParams.has(item.key)).toBe(false);
  }
});

test("контрольные ширины и переход 1199–1202 не показывают два фильтра и не создают overflow", async ({ page }) => {
  await page.goto("/catalog");

  for (const width of [390, 768, 1024, 1199, 1200, 1201, 1202, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 768 });
    await expect
      .poll(() =>
        page.locator(".cat-filters").evaluate((sidebar) =>
          Boolean(sidebar.closest(".ui-sheet-layer")),
        ),
      )
      .toBe(width <= 1199);
    const state = await page.evaluate(() => {
      const toggle = document.querySelector<HTMLElement>(".cat-filters-toggle");
      const sidebar = document.querySelector<HTMLElement>(".cat-filters");
      const rect = sidebar?.getBoundingClientRect();
      return {
        toggleVisible: getComputedStyle(toggle!).display !== "none",
        sidebarPosition: getComputedStyle(sidebar!).position,
        sidebarInViewport: Boolean(rect && rect.left < innerWidth && rect.right > 0),
        hasSheet: Boolean(sidebar?.closest(".ui-sheet-layer")),
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
      };
    });

    expect(state.documentWidth).toBeLessThanOrEqual(state.viewportWidth);
    if (width <= 1199) {
      expect(state.toggleVisible).toBe(true);
      expect(state.hasSheet).toBe(true);
      expect(state.sidebarInViewport).toBe(false);
    } else {
      expect(state.toggleVisible).toBe(false);
      expect(state.hasSheet).toBe(false);
      expect(state.sidebarPosition).toBe("sticky");
      expect(state.sidebarInViewport).toBe(true);
    }
  }
});

test("действия CarCard сохраняют визуальный размер, touch-area и единственный Tab-переход", async ({
  page,
}) => {
  await page.goto("/catalog");

  for (const width of [1920, 1440, 1200, 1024, 768, 640, 480, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(30);

    const metrics = await page.locator(".catalog-grid .car-card").first().evaluate((card) => {
      const action = (selector: string) => {
        const button = card.querySelector<HTMLElement>(selector)!;
        const icon = button.querySelector<SVGElement>("svg")!;
        const buttonRect = button.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        return {
          visualWidth: iconRect.width,
          visualHeight: iconRect.height,
          visualRight: iconRect.right,
          hitWidth: buttonRect.width,
          hitHeight: buttonRect.height,
          hitLeft: buttonRect.left,
          hitRight: buttonRect.right,
          hitTop: buttonRect.top,
        };
      };
      const details = card.querySelector<HTMLElement>(".car-card__details-link")!;
      const detailsPseudo = getComputedStyle(details, "::after");
      const overlay = card.querySelector<HTMLElement>(".car-card__link")!;
      return {
        wishlist: action(".wishlist"),
        comparison: action(".compare"),
        detailsVisualHeight: details.getBoundingClientRect().height,
        detailsHitWidth: Number.parseFloat(detailsPseudo.width),
        detailsHitHeight: Number.parseFloat(detailsPseudo.height),
        overlayTabIndex: overlay.tabIndex,
        topRowHeight: card.querySelector<HTMLElement>(".car-card__top")!
          .getBoundingClientRect().height,
        contentRight: card.querySelector<HTMLElement>(".car-card__content")!
          .getBoundingClientRect().right,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        columns: getComputedStyle(card.parentElement!).gridTemplateColumns.split(" ").length,
      };
    });

    expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.wishlist.visualWidth).toBeGreaterThanOrEqual(14);
    expect(metrics.wishlist.visualWidth).toBeLessThanOrEqual(24);
    expect(metrics.wishlist.visualHeight).toBe(metrics.wishlist.visualWidth);
    expect(metrics.comparison.visualWidth).toBe(metrics.wishlist.visualWidth);
    expect(metrics.wishlist.hitWidth).toBeGreaterThanOrEqual(40);
    expect(metrics.wishlist.hitHeight).toBeGreaterThanOrEqual(40);
    expect(metrics.comparison.hitWidth).toBeGreaterThanOrEqual(40);
    expect(metrics.comparison.hitHeight).toBeGreaterThanOrEqual(40);
    expect(metrics.contentRight - metrics.comparison.visualRight).toBeGreaterThanOrEqual(0);
    expect(metrics.contentRight - metrics.comparison.visualRight).toBeLessThanOrEqual(6.1);
    expect(metrics.wishlist.hitRight).toBeLessThanOrEqual(
      metrics.comparison.hitLeft + 0.5,
    );
    expect(metrics.detailsHitWidth).toBeGreaterThanOrEqual(44);
    expect(metrics.detailsHitHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.overlayTabIndex).toBe(-1);
    expect(metrics.topRowHeight).toBeLessThanOrEqual(24);

    if (width === 768) expect(metrics.columns).toBe(3);
    if (width === 640) expect(metrics.columns).toBe(2);
    if (width <= 480) expect(metrics.columns).toBe(1);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  const floatingMetrics = await page
    .locator(".floating-vehicle-actions__item")
    .first()
    .evaluate((item) => {
      const icon = item.querySelector("svg")!.getBoundingClientRect();
      const hit = item.getBoundingClientRect();
      return {
        hitWidth: hit.width,
        hitHeight: hit.height,
        iconWidth: icon.width,
        iconHeight: icon.height,
      };
    });
  expect(floatingMetrics).toEqual({
    hitWidth: 40,
    hitHeight: 40,
    iconWidth: 24,
    iconHeight: 24,
  });

  await page.setViewportSize({ width: 360, height: 900 });

  const card = page.locator(".catalog-grid .car-card").first();
  const wishlist = card.locator(".wishlist");
  const comparison = card.locator(".compare");
  const hitPoint = await wishlist.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return {
      x: rect.left + 2,
      y: rect.top + 2,
    };
  });
  await page.mouse.click(hitPoint.x, hitPoint.y);
  await expect(wishlist).toHaveAttribute("aria-pressed", "true");

  const details = card.locator(".car-card__details-link");
  await details.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(comparison).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(wishlist).toBeFocused();
  await expect(wishlist.locator(".wishlist__tip")).toHaveCSS("opacity", "1");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await comparison.click();
  await expect(comparison.locator(".ripple")).toHaveCount(0);
});

test("checkbox показывает focus-ring только при клавиатурной навигации", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/catalog");
  await openFacet(page, "Бренд");

  const trigger = page.getByRole("button", { name: "Бренд", exact: true });
  const checkbox = page.getByRole("checkbox", { name: "BMW" });
  const checkboxRow = page.locator(".cat-check").filter({ has: checkbox });
  await trigger.focus();
  await page.keyboard.press("Tab");
  await expect(checkbox).toBeFocused();
  await expect(checkboxRow.locator(".ui-checkbox__content")).not.toHaveCSS(
    "box-shadow",
    "none",
  );

  await page.mouse.click(5, 5);
  await checkboxRow.locator(".ui-checkbox__content").click();
  await expect(checkboxRow.locator(".ui-checkbox__content")).toHaveCSS(
    "box-shadow",
    "none",
  );
});

test("геометрия каталога совпадает с Figma на всех контрольных артбордах", async ({
  page,
}) => {
  const artboards = [
    { width: 1536, gutter: 60, crumbsY: 124, titleY: 152, titleSize: 36, toolsY: 172, cardsY: 226, cardX: 418, cardWidth: 342, cardHeight: 387, columns: 3 },
    { width: 1200, gutter: 40, crumbsY: 134, titleY: 162, titleSize: 36, toolsY: 182, cardsY: 237, cardX: 334, cardWidth: 268.67, cardHeight: 338, columns: 3 },
    { width: 960, gutter: 40, crumbsY: 134, titleY: 162, titleSize: 32, toolsY: 222, cardsY: 272, cardX: 40, cardWidth: 286.67, cardHeight: 338, columns: 3 },
    { width: 768, gutter: 40, crumbsY: 134, titleY: 162, titleSize: 32, toolsY: 222, cardsY: 272, cardX: 40, cardWidth: 222.67, cardHeight: 290, columns: 3 },
    { width: 640, gutter: 30, crumbsY: 134, titleY: 158, titleSize: 28, toolsY: 212, cardsY: 262, cardX: 30, cardWidth: 285, cardHeight: 338, columns: 2 },
    { width: 480, gutter: 20, crumbsY: 106, titleY: 130, titleSize: 28, toolsY: 184, cardsY: 232, cardX: 20, cardWidth: 440, cardHeight: 463, columns: 1 },
    { width: 390, gutter: 20, crumbsY: 106, titleY: 122, titleSize: 24, toolsY: 172, cardsY: 220, cardX: 22, cardWidth: 348, cardHeight: 361, columns: 1 },
  ] as const;
  const isNear = (actual: number, expected: number) =>
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1.1);

  await page.goto("/catalog");
  await page.evaluate(() => document.fonts.ready);

  for (const artboard of artboards) {
    await page.setViewportSize({ width: artboard.width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(50);

    const layout = await page.evaluate(() => {
      const rect = (selector: string) => {
        const bounds = document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
        return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
      };
      const title = document.querySelector<HTMLElement>(".catalog-head h1")!;
      const grid = document.querySelector<HTMLElement>(".catalog-grid")!;
      const header = document.querySelector<HTMLElement>(".site-header")!;
      const filter = document.querySelector<HTMLElement>(".cat-filters")!;
      return {
        crumbs: rect(".cat-crumbs"),
        title: rect(".catalog-head h1"),
        tools: rect(".catalog-head__tools"),
        card: rect(".catalog-grid > .car-card"),
        titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
        columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
        headerPosition: getComputedStyle(header).position,
        filterPosition: getComputedStyle(filter).position,
        filterTop: Number.parseFloat(getComputedStyle(filter).top),
      };
    });

    isNear(layout.crumbs.x, artboard.gutter);
    isNear(layout.crumbs.y, artboard.crumbsY);
    isNear(layout.title.x, artboard.gutter);
    isNear(layout.title.y, artboard.titleY);
    isNear(layout.titleSize, artboard.titleSize);
    isNear(layout.tools.y, artboard.toolsY);
    isNear(layout.card.x, artboard.cardX);
    isNear(layout.card.y, artboard.cardsY);
    isNear(layout.card.width, artboard.cardWidth);
    isNear(layout.card.height, artboard.cardHeight);
    expect(layout.columns).toBe(artboard.columns);
    expect(layout.headerPosition).toBe("absolute");

    if (artboard.width >= 1200) {
      expect(layout.filterPosition).toBe("sticky");
      expect(layout.filterTop).toBe(0);
    } else {
      expect(layout.filterPosition).toBe("fixed");
    }
  }
});

test("sticky sidebar помещается при низкой высоте и отдаёт wheel странице на границе", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/catalog");
  const sidebar = page.locator(".cat-filters");

  for (const height of [900, 768, 700, 600]) {
    await page.setViewportSize({ width: 1280, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(80);
    const initialBottom = await sidebar.evaluate(
      (node) => node.getBoundingClientRect().bottom,
    );
    expect(initialBottom).toBeLessThanOrEqual(height + 1);

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(80);
    const metrics = await sidebar.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        clientHeight: node.clientHeight,
        overflowY: getComputedStyle(node).overflowY,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(-1);
    expect(metrics.top).toBeLessThanOrEqual(1);
    expect(metrics.bottom).toBeLessThanOrEqual(height + 1);
    expect(metrics.clientHeight).toBeLessThanOrEqual(height);
    expect(metrics.overflowY).toBe("auto");
  }

  await sidebar.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  await sidebar.hover();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore);
});

test("после сильного сокращения результатов scroll возвращается к блоку каталога", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto("/catalog");
  await page.evaluate(() => window.scrollTo(0, 9000));
  const before = await page.evaluate(() => window.scrollY);

  const priceFrom = page.getByRole("textbox", { name: "Цена, ₽: от" });
  await priceFrom.fill("50000000");
  await priceFrom.press("Enter");
  await expect(page.locator(".catalog-empty")).toBeVisible();

  const after = await page.evaluate(() => window.scrollY);
  const resultsTop = await page.locator(".catalog-results").evaluate(
    (node) => node.getBoundingClientRect().top + window.scrollY,
  );
  expect(after).toBeLessThan(before);
  expect(Math.abs(after - Math.max(0, resultsTop - 24))).toBeLessThanOrEqual(2);
});
