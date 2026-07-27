/**
 * Слой данных по автомобилям — МОКИ (Фаза 2).
 *
 * Пока каталог собирается из нескольких реальных машин, «размноженных» до
 * большого списка со стабильными псевдослучайными характеристиками.
 *
 * В будущем машины будут приходить из системы учёта клиента: достаточно
 * заменить реализацию getCars/getCarBySlug на запрос к API/БД — сигнатуры
 * и тип Car остаются прежними. Картинки тогда придут внешними URL.
 */

export type CarStatusType = "success" | "warning" | "error" | "info";

export interface Car {
  id: string;
  slug: string;
  brand: string;
  brandLogo: string;
  /** Название по имени файла фото. */
  name: string;
  photo: string;
  year: number;
  /** Мощность, л.с. */
  power: number;
  /** Привод (короткое значение: «Полный» / «Задний» / «Передний»). */
  drive: string;
  /** Тип кузова. */
  bodyType: string;
  /** Цвет. */
  color: string;
  /** Коробка передач. */
  transmission: string;
  /** Тип топлива. */
  fuelType: string;
  /** Цена, ₽. */
  price: number;
  status: { type: CarStatusType; label: string };
}

/** Базовые машины (из public/images/cars/ + логотипы из logo_cards/). */
const SEED = [
  {
    slug: "x5-m60i-sport-pro",
    name: "X5 M60i Sport Pro",
    brand: "BMW",
    brandLogo: "/images/logo_cards/bmw.webp",
    photo: "/images/cars/x5-m60i-sport-pro.webp",
    bodyType: "Кроссовер",
  },
  {
    slug: "range-rover-sv",
    name: "Range Rover SV",
    brand: "Land Rover",
    brandLogo: "/images/logo_cards/landrover.webp",
    photo: "/images/cars/range-rover-sv.webp",
    bodyType: "Внедорожник",
  },
  {
    slug: "v-class-exclusive",
    name: "V-Класс Exclusive",
    brand: "Mercedes-Benz",
    brandLogo: "/images/logo_cards/mercedes.webp",
    photo: "/images/cars/v-class-exclusive.webp",
    bodyType: "Минивэн",
  },
  {
    slug: "cle-53-amg-4matic",
    name: "CLE AMG AMG CLE 53 4matic+",
    brand: "Mercedes-Benz",
    brandLogo: "/images/logo_cards/mercedes.webp",
    photo: "/images/cars/cle-53-amg-4matic.webp",
    bodyType: "Купе",
  },
] as const;

/* Наборы значений для псевдослучайной генерации характеристик. */
const COLORS = ["Чёрный", "Серый", "Белый", "Серебристый", "Синий", "Зелёный"];
const TRANSMISSIONS = ["Автомат", "Робот"];
const DRIVES = ["Полный", "Задний", "Передний"];
const FUELS = ["Бензин", "Дизель", "Гибрид", "Электро"];

/** Детерминированный PRNG (mulberry32) — значения стабильны между рендерами/сборками. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COPIES = 6; // 4 базовые × 6 = 24 машины
const YEAR = 2026;

const pick = (rand: () => number, arr: string[]) =>
  arr[Math.floor(rand() * arr.length)];

function buildCatalog(): Car[] {
  const rand = mulberry32(20260727);
  const cars: Car[] = [];
  for (let copy = 0; copy < COPIES; copy++) {
    for (const base of SEED) {
      // мощность 200–650 л.с., шаг 1
      const power = 200 + Math.floor(rand() * 451);
      // цена 5.9–42 млн ₽, округление до 10 000
      const price = Math.round((5_900_000 + rand() * 36_100_000) / 10_000) * 10_000;
      const color = pick(rand, COLORS);
      const transmission = pick(rand, TRANSMISSIONS);
      const drive = pick(rand, DRIVES);
      const fuelType = pick(rand, FUELS);
      const slug = copy === 0 ? base.slug : `${base.slug}-${copy + 1}`;
      cars.push({
        id: slug,
        slug,
        brand: base.brand,
        brandLogo: base.brandLogo,
        name: base.name,
        photo: base.photo,
        year: YEAR,
        power,
        drive,
        bodyType: base.bodyType,
        color,
        transmission,
        fuelType,
        price,
        status: { type: "success", label: "В наличии" },
      });
    }
  }
  return cars;
}

const CARS: Car[] = buildCatalog();

/** Машины из промо-блоков главной, которым тоже нужна detail-страница. */
const FEATURED_CARS: Car[] = [
  {
    id: "porsche-911-turbo-s",
    slug: "porsche-911-turbo-s",
    brand: "Porsche",
    brandLogo: "/images/logo_cards/porsche.webp",
    name: "911 Turbo S",
    photo: "/images/firstcars/1big.webp",
    year: 2026,
    power: 375,
    drive: "Полный",
    bodyType: "Купе",
    color: "Зелёный",
    transmission: "Робот",
    fuelType: "Бензин",
    price: 19_990_000,
    status: { type: "success", label: "В наличии" },
  },
  {
    id: "lexus-gx-executive",
    slug: "lexus-gx-executive",
    brand: "Lexus",
    brandLogo: "/images/logo_cards/lexus.webp",
    name: "GX Executive",
    photo: "/images/cars/mask.webp",
    year: 2026,
    power: 354,
    drive: "Полный",
    bodyType: "Внедорожник",
    color: "Чёрный",
    transmission: "Автомат",
    fuelType: "Бензин",
    price: 15_490_000,
    status: { type: "warning", label: "Ожидаем поступления" },
  },
];

/* ------------------------------ Публичный API ------------------------------ */

export function getCars(): Car[] {
  return CARS;
}

export function getCarBySlug(slug: string): Car | undefined {
  return [...FEATURED_CARS, ...CARS].find((c) => c.slug === slug);
}

export function getCarSlugs(): string[] {
  return [...FEATURED_CARS, ...CARS].map((c) => c.slug);
}

/** Теги карточки: год · мощность · привод (по ТЗ — «бензин» заменён на л.с.). */
export function carTags(car: Car): string[] {
  return [String(car.year), `${car.power} л.с.`, `${car.drive} привод`];
}

/** Форматирование цены: 12 340 000 ₽ (без зависимости от локали рантайма). */
export function formatPrice(value: number): string {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

/* ------------------------------ Фильтры ------------------------------ */

/** Границы диапазонов (по ТЗ каталога). */
export const PRICE_MIN = 4_500_000;
export const PRICE_MAX = 50_000_000;
export const POWER_MIN = 100;
export const POWER_MAX = 900;

export type FacetKey =
  | "brand"
  | "model"
  | "color"
  | "body"
  | "transmission"
  | "drive"
  | "fuel";

export interface Facet {
  key: FacetKey;
  label: string;
  get: (c: Car) => string;
}

/** Аккордеон-фильтры (порядок — как на макете). */
export const FACETS: Facet[] = [
  { key: "brand", label: "Бренд", get: (c) => c.brand },
  { key: "model", label: "Модель", get: (c) => c.name },
  { key: "color", label: "Цвет", get: (c) => c.color },
  { key: "body", label: "Кузов", get: (c) => c.bodyType },
  { key: "transmission", label: "Коробка", get: (c) => c.transmission },
  { key: "drive", label: "Привод", get: (c) => c.drive },
  { key: "fuel", label: "Тип топлива", get: (c) => c.fuelType },
];

/** Канонический порядок значений внутри каждого фасета. */
const VALUE_ORDER: Record<FacetKey, string[]> = {
  brand: ["BMW", "Mercedes-Benz", "Land Rover"],
  model: SEED.map((s) => s.name),
  color: COLORS,
  body: ["Внедорожник", "Кроссовер", "Купе", "Минивэн"],
  transmission: TRANSMISSIONS,
  drive: DRIVES,
  fuel: FUELS,
};

/* ------------------------------ Характеристики ------------------------------ */

export interface Spec {
  label: string;
  value: string;
}

/**
 * Характеристики авто для страницы модели: primary — видимые сразу (сетка 3×3),
 * extra — раскрываются по кнопке «Развернуть». Часть значений — из данных,
 * часть детерминированно выведена из мощности (стабильно между SSR/CSR).
 */
export function getCarSpecs(car: Car): { primary: Spec[]; extra: Spec[] } {
  const accel = Math.max(3.5, 3.6 + (650 - car.power) * 0.006).toFixed(1);
  const topSpeed = Math.min(320, 230 + Math.round(car.power * 0.13));
  const displacement = (1.8 + car.power / 260).toFixed(1);
  const torque = Math.round(car.power * 1.4);

  const primary: Spec[] = [
    { label: "Год выпуска", value: String(car.year) },
    { label: "Кузов", value: car.bodyType },
    { label: "Цвет", value: car.color },
    { label: "Привод", value: `${car.drive} привод` },
    { label: "Коробка", value: car.transmission },
    { label: "Тип топлива", value: car.fuelType },
    { label: "Мощность", value: `${car.power} л.с.` },
    { label: "Разгон 0–100 км/ч", value: `${accel} с` },
    { label: "Максимальная скорость", value: `${topSpeed} км/ч` },
  ];

  const extra: Spec[] = [
    { label: "Объём двигателя", value: `${displacement} л` },
    { label: "Крутящий момент", value: `${torque} Н·м` },
    { label: "Длина", value: "4 850 мм" },
    { label: "Ширина", value: "1 900 мм" },
    { label: "Высота", value: "1 460 мм" },
    { label: "Колёсная база", value: "2 865 мм" },
    { label: "Дорожный просвет", value: "140 мм" },
    { label: "Объём бака", value: "66 л" },
    { label: "Расход (смешанный)", value: "8.4 л/100 км" },
    { label: "Гарантия", value: "3 года / 100 000 км" },
  ];

  return { primary, extra };
}

/** Доступные значения каждого фасета (в каноническом порядке, только те, что есть в данных). */
export function getFacetOptions(): Record<FacetKey, string[]> {
  const out = {} as Record<FacetKey, string[]>;
  for (const f of FACETS) {
    const present = new Set(CARS.map(f.get));
    const order = VALUE_ORDER[f.key];
    out[f.key] = order.filter((v) => present.has(v));
  }
  return out;
}
