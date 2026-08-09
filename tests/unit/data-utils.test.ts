import { describe, expect, it } from "vitest";
import {
  BRANDS_LOGOS,
  CAR_COLORS,
  FACETS,
  POWER_MAX,
  POWER_MIN,
  PRICE_MAX,
  PRICE_MIN,
  brandCarCount,
  brandSlug,
  carTags,
  formatPrice,
  getAllCars,
  getCarBySlug,
  getCarSlugs,
  getCarSpecs,
  getCars,
  getCarsForBody,
  getCarsForBrand,
  getFacetOptions,
  type Car,
} from "@/lib/cars";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slug";
import {
  hasTrailingShortWord,
  preventHangingPrepositions,
  protectTrailingShortWord,
} from "@/lib/typography";

describe("каталог автомобилей", () => {
  it("строится детерминированно и содержит валидные уникальные записи", () => {
    const cars = getCars();

    expect(cars).toBe(getCars());
    expect(cars.length).toBeGreaterThan(30);
    expect(new Set(cars.map((car) => car.id)).size).toBe(cars.length);
    expect(new Set(cars.map((car) => car.slug)).size).toBe(cars.length);

    for (const car of cars) {
      expect(car.id).toBe(car.slug);
      expect(car.year).toBe(2026);
      expect(car.power).toBeGreaterThanOrEqual(250);
      expect(car.power).toBeLessThanOrEqual(750);
      expect(car.price).toBeGreaterThanOrEqual(6_000_000);
      expect(car.price).toBeLessThanOrEqual(48_000_000);
      expect(car.price % 10_000).toBe(0);
      expect(car.status).toEqual({ type: "success", label: "В наличии" });
      expect(CAR_COLORS).toContainEqual(car.color);
    }
  });

  it("возвращает канонические и запасные slug брендов", () => {
    expect(brandSlug("Mercedes-Benz")).toBe("mercedes");
    expect(brandSlug("Land Rover")).toBe("land-rover");
    expect(brandSlug("New Brand")).toBe("new-brand");
    expect(BRANDS_LOGOS.map((brand) => brand.href)).toContain("/rolls-royce");
  });

  it("задаёт стабильное количество автомобилей бренда", () => {
    expect(brandCarCount("BYD")).toBe(1);
    expect(brandCarCount("Ferrari")).toBe(2);
    expect(brandCarCount("BMW")).toBe(brandCarCount("BMW"));
    expect(brandCarCount("BMW")).toBeGreaterThanOrEqual(4);
    expect(brandCarCount("BMW")).toBeLessThanOrEqual(18);
  });

  it("строит подборки по кузову и бренду без мутации каталога", () => {
    const all = getCars();
    const bmws = getCarsForBrand("BMW");
    const coupes = getCarsForBody("Купе", 3);
    const fallback = getCarsForBody("Неизвестный кузов", 8);

    expect(bmws).toHaveLength(brandCarCount("BMW"));
    expect(bmws.every((car) => car.brand === "BMW")).toBe(true);
    expect(coupes.every((car) => car.bodyType === "Купе")).toBe(true);
    expect(fallback).toEqual(all.slice(0, 8));
    expect(all).toBe(getCars());
  });

  it("добавляет промо-автомобили и находит detail-модели по slug", () => {
    const all = getAllCars();
    const slugs = getCarSlugs();

    expect(all).not.toBe(getAllCars());
    expect(all[0].slug).toBe("porsche-911-turbo-s");
    expect(slugs).toHaveLength(all.length);
    expect(getCarBySlug("porsche-911-turbo-s")?.name).toBe("911 Turbo S");
    expect(getCarBySlug("does-not-exist")).toBeUndefined();
  });

  it("форматирует цену и теги карточки", () => {
    const car = getCars()[0];

    expect(formatPrice(0)).toBe("0 ₽");
    expect(formatPrice(7_060_000)).toBe("7 060 000 ₽");
    expect(carTags(car)).toEqual([
      "2026",
      `${car.power} л.с.`,
      `${car.drive} привод`,
    ]);
    expect([PRICE_MIN, PRICE_MAX, POWER_MIN, POWER_MAX]).toEqual([
      4_500_000,
      50_000_000,
      100,
      900,
    ]);
  });

  it("вычисляет полный набор характеристик и ограничивает формулы", () => {
    const base = getCars()[0];
    const lowPower: Car = { ...base, power: 100 };
    const highPower: Car = { ...base, power: 1_000 };
    const lowSpecs = getCarSpecs(lowPower);
    const highSpecs = getCarSpecs(highPower);

    expect(lowSpecs.primary).toHaveLength(9);
    expect(lowSpecs.extra).toHaveLength(10);
    expect(lowSpecs.primary).toContainEqual({
      label: "Разгон 0–100 км/ч",
      value: "6.9 с",
    });
    expect(highSpecs.primary).toContainEqual({
      label: "Разгон 0–100 км/ч",
      value: "3.5 с",
    });
    expect(highSpecs.primary).toContainEqual({
      label: "Макс. скорость",
      value: "320 км/ч",
    });
    expect(highSpecs.extra).toContainEqual({
      label: "Крутящий момент",
      value: "1400 Н·м",
    });
  });

  it("строит опции всех фасетов в каноническом порядке", () => {
    const cars = getCars();
    const options = getFacetOptions(cars);

    expect(Object.keys(options)).toEqual(FACETS.map((facet) => facet.key));
    expect(options.brand[0].value).toBe("BMW");
    expect(options.color[0]).toEqual({
      value: "black",
      label: "Чёрный",
      swatch: "#1B1E1D",
    });
    expect(options.brand.every((option) => option.swatch == null)).toBe(true);
  });

  it("добавляет неизвестные значения фасетов после известных по алфавиту", () => {
    const base = getCars()[0];
    const cars: Car[] = [
      { ...base, id: "z", brand: "Яхта", color: { id: "amber", name: "Янтарный", swatch: "#AA0" } },
      { ...base, id: "a", brand: "Aston Martin", color: { id: "azure", name: "Лазурный", swatch: "#00A" } },
      base,
    ];
    const options = getFacetOptions(cars);

    expect(options.brand.map((option) => option.value)).toEqual([
      base.brand,
      "Яхта",
      "Aston Martin",
    ]);
    expect(options.color.map((option) => option.value)).toEqual([
      base.color.id,
      "azure",
      "amber",
    ]);
  });
});

describe("текстовые утилиты", () => {
  it("склеивает только непустые классы", () => {
    expect(cn("base", false, null, undefined, "active")).toBe("base active");
    expect(cn()).toBe("");
  });

  it("транслитерирует и нормализует slug", () => {
    expect(slugify("Ёжик в тумане! 2026")).toBe("ezhik-v-tumane-2026");
    expect(slugify("  BMW X5 / M60i  ")).toBe("bmw-x5-m60i");
    expect(slugify("ЪЬ")).toBe("");
    expect(slugify("A".repeat(100))).toHaveLength(80);
  });

  it("заменяет пробел после коротких русских слов на неразрывный", () => {
    expect(preventHangingPrepositions("Автомобили в наличии и под заказ")).toBe(
      "Автомобили в\u00a0наличии и\u00a0под заказ",
    );
    expect(preventHangingPrepositions("Из-за дождя, но без пробок")).toBe(
      "Из-за\u00a0дождя, но\u00a0без пробок",
    );
    expect(preventHangingPrepositions("inside value")).toBe("inside value");
  });

  it("распознаёт и защищает короткое слово в конце текстового узла", () => {
    expect(hasTrailingShortWord("Доставка в ")).toBe(true);
    expect(hasTrailingShortWord("Доставка рядом ")).toBe(false);
    expect(protectTrailingShortWord("Доставка в ")).toBe("Доставка в\u00a0");
    expect(protectTrailingShortWord("Без изменения")).toBe("Без изменения");
  });
});
