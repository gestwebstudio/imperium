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

/**
 * Цвет приходит вместе с автомобилем, поэтому админка или 1С может добавить
 * новое значение без словаря HEX-кодов на фронтенде.
 */
export interface CarColor {
  /** Стабильный код из внешней системы. */
  id: string;
  /** Отображаемое локализованное название. */
  name: string;
  /** CSS-совместимое значение: HEX, RGB или HSL. */
  swatch: string;
}

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
  /** Цвет с кодом и визуальным образцом из источника данных. */
  color: CarColor;
  /** Коробка передач. */
  transmission: string;
  /** Тип топлива. */
  fuelType: string;
  /** Цена, ₽. */
  price: number;
  status: { type: CarStatusType; label: string };
}

/**
 * Каталог: по 2 модели на каждый из 15 брендов (логотипы — из logo_cards/) = 30 машин.
 * Фото переиспользуются из имеющихся в public/images/ — точное соответствие модели
 * фотографии не требуется (реальные фото придут позже внешними URL).
 */
const CARS_PHOTO = "/images/cars";
const MODELS = [
  // BMW
  { slug: "x5-m60i-sport-pro", name: "X5 M60i Sport Pro", brand: "BMW", brandLogo: "/images/logo_cards/bmw.webp", photo: `${CARS_PHOTO}/x5-m60i-sport-pro.webp`, bodyType: "Кроссовер" },
  { slug: "x3-xdrive20i", name: "X3 xDrive20i", brand: "BMW", brandLogo: "/images/logo_cards/bmw.webp", photo: `${CARS_PHOTO}/x3-xdrive20i.webp`, bodyType: "Кроссовер" },
  // Mercedes-Benz
  { slug: "v-class-exclusive", name: "V-Класс Exclusive", brand: "Mercedes-Benz", brandLogo: "/images/logo_cards/mercedes.webp", photo: `${CARS_PHOTO}/v-class-exclusive.webp`, bodyType: "Минивэн" },
  { slug: "cle-53-amg-4matic", name: "CLE 53 AMG 4MATIC+", brand: "Mercedes-Benz", brandLogo: "/images/logo_cards/mercedes.webp", photo: `${CARS_PHOTO}/cle-53-amg-4matic.webp`, bodyType: "Купе" },
  // Land Rover
  { slug: "range-rover-sv", name: "Range Rover SV", brand: "Land Rover", brandLogo: "/images/logo_cards/land-rover.webp", photo: `${CARS_PHOTO}/range-rover-sv.webp`, bodyType: "Внедорожник" },
  { slug: "defender-110-x", name: "Defender 110 X", brand: "Land Rover", brandLogo: "/images/logo_cards/land-rover.webp", photo: `${CARS_PHOTO}/range-rover-sv.webp`, bodyType: "Внедорожник" },
  // Porsche
  { slug: "cayenne-turbo-gt", name: "Cayenne Turbo GT", brand: "Porsche", brandLogo: "/images/logo_cards/porsche.webp", photo: `${CARS_PHOTO}/mask.webp`, bodyType: "Кроссовер" },
  { slug: "panamera-turbo", name: "Panamera Turbo", brand: "Porsche", brandLogo: "/images/logo_cards/porsche.webp", photo: `${CARS_PHOTO}/cle-53-amg-4matic.webp`, bodyType: "Купе" },
  // Ferrari
  { slug: "ferrari-roma", name: "Roma", brand: "Ferrari", brandLogo: "/images/logo_cards/ferrari.webp", photo: `${CARS_PHOTO}/cle-53-amg-4matic.webp`, bodyType: "Купе" },
  { slug: "ferrari-296-gtb", name: "296 GTB", brand: "Ferrari", brandLogo: "/images/logo_cards/ferrari.webp", photo: "/images/firstcars/1big.webp", bodyType: "Спорткар" },
  // Lamborghini
  { slug: "lamborghini-urus-s", name: "Urus S", brand: "Lamborghini", brandLogo: "/images/logo_cards/lamborghini.webp", photo: `${CARS_PHOTO}/x5-m60i-sport-pro.webp`, bodyType: "Внедорожник" },
  { slug: "lamborghini-huracan-evo", name: "Huracán EVO", brand: "Lamborghini", brandLogo: "/images/logo_cards/lamborghini.webp", photo: "/images/firstcars/1big.webp", bodyType: "Спорткар" },
  // Rolls-Royce
  { slug: "rolls-royce-cullinan", name: "Cullinan", brand: "Rolls-Royce", brandLogo: "/images/logo_cards/rolls-royce.webp", photo: `${CARS_PHOTO}/range-rover-sv.webp`, bodyType: "Внедорожник" },
  { slug: "rolls-royce-ghost", name: "Ghost", brand: "Rolls-Royce", brandLogo: "/images/logo_cards/rolls-royce.webp", photo: `${CARS_PHOTO}/v-class-exclusive.webp`, bodyType: "Седан" },
  // Lexus
  { slug: "rx-500h-f-sport", name: "RX 500h F Sport", brand: "Lexus", brandLogo: "/images/logo_cards/lexus.webp", photo: `${CARS_PHOTO}/x3-xdrive20i.webp`, bodyType: "Кроссовер" },
  { slug: "lx-600", name: "LX 600", brand: "Lexus", brandLogo: "/images/logo_cards/lexus.webp", photo: `${CARS_PHOTO}/mask.webp`, bodyType: "Внедорожник" },
  // Chevrolet
  { slug: "tahoe-high-country", name: "Tahoe High Country", brand: "Chevrolet", brandLogo: "/images/logo_cards/chevrolet.webp", photo: `${CARS_PHOTO}/range-rover-sv.webp`, bodyType: "Внедорожник" },
  { slug: "corvette-stingray", name: "Corvette Stingray", brand: "Chevrolet", brandLogo: "/images/logo_cards/chevrolet.webp", photo: `${CARS_PHOTO}/cle-53-amg-4matic.webp`, bodyType: "Спорткар" },
  // Honda
  { slug: "honda-pilot-elite", name: "Pilot Elite", brand: "Honda", brandLogo: "/images/logo_cards/honda.webp", photo: `${CARS_PHOTO}/x5-m60i-sport-pro.webp`, bodyType: "Кроссовер" },
  { slug: "honda-accord-touring", name: "Accord Touring", brand: "Honda", brandLogo: "/images/logo_cards/honda.webp", photo: `${CARS_PHOTO}/v-class-exclusive.webp`, bodyType: "Седан" },
  // Hyundai
  { slug: "palisade-calligraphy", name: "Palisade Calligraphy", brand: "Hyundai", brandLogo: "/images/logo_cards/hyundai.webp", photo: `${CARS_PHOTO}/x5-m60i-sport-pro.webp`, bodyType: "Кроссовер" },
  { slug: "santa-fe-calligraphy", name: "Santa Fe Calligraphy", brand: "Hyundai", brandLogo: "/images/logo_cards/hyundai.webp", photo: `${CARS_PHOTO}/x3-xdrive20i.webp`, bodyType: "Кроссовер" },
  // Toyota
  { slug: "land-cruiser-300", name: "Land Cruiser 300", brand: "Toyota", brandLogo: "/images/logo_cards/toyota.webp", photo: `${CARS_PHOTO}/range-rover-sv.webp`, bodyType: "Внедорожник" },
  { slug: "toyota-camry-35", name: "Camry 3.5", brand: "Toyota", brandLogo: "/images/logo_cards/toyota.webp", photo: `${CARS_PHOTO}/v-class-exclusive.webp`, bodyType: "Седан" },
  // Volvo
  { slug: "xc90-ultimate", name: "XC90 Ultimate", brand: "Volvo", brandLogo: "/images/logo_cards/volvo.webp", photo: `${CARS_PHOTO}/x5-m60i-sport-pro.webp`, bodyType: "Кроссовер" },
  { slug: "xc60-recharge", name: "XC60 Recharge", brand: "Volvo", brandLogo: "/images/logo_cards/volvo.webp", photo: `${CARS_PHOTO}/x3-xdrive20i.webp`, bodyType: "Кроссовер" },
  // BYD
  { slug: "byd-han-ev", name: "Han EV", brand: "BYD", brandLogo: "/images/logo_cards/byd.webp", photo: `${CARS_PHOTO}/cle-53-amg-4matic.webp`, bodyType: "Седан" },
  { slug: "byd-tang", name: "Tang", brand: "BYD", brandLogo: "/images/logo_cards/byd.webp", photo: `${CARS_PHOTO}/x5-m60i-sport-pro.webp`, bodyType: "Кроссовер" },
  // GMC
  { slug: "yukon-denali", name: "Yukon Denali", brand: "GMC", brandLogo: "/images/logo_cards/gmc.webp", photo: `${CARS_PHOTO}/range-rover-sv.webp`, bodyType: "Внедорожник" },
  { slug: "sierra-1500-denali", name: "Sierra 1500 Denali", brand: "GMC", brandLogo: "/images/logo_cards/gmc.webp", photo: `${CARS_PHOTO}/mask.webp`, bodyType: "Пикап" },
] as const;

/* Наборы значений для псевдослучайной генерации характеристик. */
export const CAR_COLORS: readonly CarColor[] = [
  { id: "black", name: "Чёрный", swatch: "#1B1E1D" },
  { id: "gray", name: "Серый", swatch: "#898785" },
  { id: "white", name: "Белый", swatch: "#FFFFFF" },
  { id: "silver", name: "Серебристый", swatch: "#C4C7C7" },
  { id: "blue", name: "Синий", swatch: "#315878" },
  { id: "green", name: "Зелёный", swatch: "#4E7B60" },
  { id: "red", name: "Красный", swatch: "#A51C1C" },
];
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

const YEAR = 2026;

const pick = <T>(rand: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rand() * arr.length)];

function getSeedColor(id: string): CarColor {
  const color = CAR_COLORS.find((item) => item.id === id);
  if (!color) throw new Error(`Unknown seed color: ${id}`);
  return color;
}

function buildCatalog(): Car[] {
  const rand = mulberry32(20260727);
  return MODELS.map((base) => {
    // мощность 250–750 л.с., шаг 1
    const power = 250 + Math.floor(rand() * 501);
    // цена 6–48 млн ₽, округление до 10 000
    const price = Math.round((6_000_000 + rand() * 42_000_000) / 10_000) * 10_000;
    const color = pick(rand, CAR_COLORS);
    const transmission = pick(rand, TRANSMISSIONS);
    const drive = pick(rand, DRIVES);
    const fuelType = pick(rand, FUELS);
    return {
      id: base.slug,
      slug: base.slug,
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
    };
  });
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
    color: getSeedColor("green"),
    transmission: "Робот",
    fuelType: "Бензин",
    price: 19_990_000,
    status: { type: "success", label: "В наличии" },
  },
  {
    id: "porsche-911-carrera-4-gts",
    slug: "porsche-911-carrera-4-gts",
    brand: "Porsche",
    brandLogo: "/images/logo_cards/porsche.webp",
    name: "911 Carrera 4 GTS",
    photo: "/images/firstcars/2big.webp",
    year: 2026,
    power: 541,
    drive: "Полный",
    bodyType: "Купе",
    color: getSeedColor("red"),
    transmission: "Робот",
    fuelType: "Бензин",
    price: 22_490_000,
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
    color: getSeedColor("black"),
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

/**
 * Машины для SEO-страницы-подборки по кузову: сначала нужного типа, при нехватке
 * добираем любыми до `min` (у части кузовов нет своих фото — по ТЗ можно любые).
 */
export function getCarsForBody(bodyType: string, min = 8): Car[] {
  const all = getCars();
  const typed = all.filter((c) => c.bodyType === bodyType);
  if (typed.length >= min) return typed;
  const rest = all.filter((c) => c.bodyType !== bodyType);
  return [...typed, ...rest].slice(0, min);
}

/** То же для SEO-подборки по бренду: сначала машины бренда, добор любыми до `min`. */
export function getCarsForBrand(brand: string, min = 8): Car[] {
  const all = getCars();
  const typed = all.filter((c) => c.brand === brand);
  if (typed.length >= min) return typed;
  const rest = all.filter((c) => c.brand !== brand);
  return [...typed, ...rest].slice(0, min);
}

/** Все автомобили, которые могут быть добавлены в избранное или сравнение. */
export function getAllCars(): Car[] {
  return [...FEATURED_CARS, ...CARS];
}

export function getCarBySlug(slug: string): Car | undefined {
  return getAllCars().find((c) => c.slug === slug);
}

export function getCarSlugs(): string[] {
  return getAllCars().map((c) => c.slug);
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
  selectionLabel: string;
  get: (c: Car) => string;
}

export interface FacetOption {
  /** Значение, используемое в фильтрации и передаваемое в API. */
  value: string;
  /** Подпись для интерфейса. */
  label: string;
  /** Только для цветов: значение, которое отображает HeroUI ColorSwatch. */
  swatch?: string;
}

/** Аккордеон-фильтры (порядок — как на макете). */
export const FACETS: Facet[] = [
  {
    key: "brand",
    label: "Бренд",
    selectionLabel: "Бренды",
    get: (c) => c.brand,
  },
  {
    key: "model",
    label: "Модель",
    selectionLabel: "Модели",
    get: (c) => c.name,
  },
  {
    key: "color",
    label: "Цвет",
    selectionLabel: "Цвета",
    get: (c) => c.color.id,
  },
  {
    key: "body",
    label: "Кузов",
    selectionLabel: "Кузова",
    get: (c) => c.bodyType,
  },
  {
    key: "transmission",
    label: "Коробка",
    selectionLabel: "Коробки",
    get: (c) => c.transmission,
  },
  {
    key: "drive",
    label: "Привод",
    selectionLabel: "Приводы",
    get: (c) => c.drive,
  },
  {
    key: "fuel",
    label: "Тип топлива",
    selectionLabel: "Типы топлива",
    get: (c) => c.fuelType,
  },
];

/** Канонический порядок значений внутри каждого фасета. */
const VALUE_ORDER: Record<FacetKey, string[]> = {
  brand: [
    "BMW",
    "Mercedes-Benz",
    "Land Rover",
    "Porsche",
    "Ferrari",
    "Lamborghini",
    "Rolls-Royce",
    "Lexus",
    "Chevrolet",
    "Honda",
    "Hyundai",
    "Toyota",
    "Volvo",
    "BYD",
    "GMC",
  ],
  model: MODELS.map((m) => m.name),
  color: CAR_COLORS.map((color) => color.id),
  body: ["Внедорожник", "Кроссовер", "Купе", "Минивэн", "Седан", "Спорткар", "Пикап"],
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
    { label: "Цвет", value: car.color.name },
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

/**
 * Доступные значения фасетов строятся из переданного каталога. Это позволяет
 * заменить моки ответом админки/1С без изменений в компонентах фильтра.
 */
export function getFacetOptions(
  cars: Car[] = CARS,
): Record<FacetKey, FacetOption[]> {
  const out = {} as Record<FacetKey, FacetOption[]>;
  for (const f of FACETS) {
    const present = new Map<string, FacetOption>();
    for (const car of cars) {
      const value = f.get(car);
      present.set(
        value,
        f.key === "color"
          ? {
              value,
              label: car.color.name,
              swatch: car.color.swatch,
            }
          : { value, label: value },
      );
    }

    const order = VALUE_ORDER[f.key];
    const known = order.flatMap((value) => {
      const option = present.get(value);
      return option ? [option] : [];
    });
    const unknown = [...present.values()]
      .filter((option) => !order.includes(option.value))
      .sort((a, b) => a.label.localeCompare(b.label, "ru"));
    out[f.key] = [...known, ...unknown];
  }
  return out;
}
