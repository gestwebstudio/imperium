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
  drive: string;
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
  },
  {
    slug: "range-rover-sv",
    name: "Range Rover SV",
    brand: "Land Rover",
    brandLogo: "/images/logo_cards/landrover.webp",
    photo: "/images/cars/range-rover-sv.webp",
  },
  {
    slug: "v-class-exclusive",
    name: "V-Класс Exclusive",
    brand: "Mercedes-Benz",
    brandLogo: "/images/logo_cards/mercedes.webp",
    photo: "/images/cars/v-class-exclusive.webp",
  },
  {
    slug: "cle-53-amg-4matic",
    name: "CLE AMG AMG CLE 53 4matic+",
    brand: "Mercedes-Benz",
    brandLogo: "/images/logo_cards/mercedes.webp",
    photo: "/images/cars/cle-53-amg-4matic.webp",
  },
] as const;

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

const COPIES = 12; // 4 базовые × 12 = 48 машин
const YEAR = 2026;

function buildCatalog(): Car[] {
  const rand = mulberry32(20260727);
  const cars: Car[] = [];
  for (let copy = 0; copy < COPIES; copy++) {
    for (const base of SEED) {
      // мощность 200–650 л.с., шаг 1
      const power = 200 + Math.floor(rand() * 451);
      // цена 5.9–42 млн ₽, округление до 10 000
      const price = Math.round((5_900_000 + rand() * 36_100_000) / 10_000) * 10_000;
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
        drive: "Полный привод",
        price,
        status: { type: "success", label: "В наличии" },
      });
    }
  }
  return cars;
}

const CARS: Car[] = buildCatalog();

/* ------------------------------ Публичный API ------------------------------ */

export function getCars(): Car[] {
  return CARS;
}

export function getCarBySlug(slug: string): Car | undefined {
  return CARS.find((c) => c.slug === slug);
}

/** Теги карточки: год · мощность · привод (по ТЗ — «бензин» заменён на л.с.). */
export function carTags(car: Car): string[] {
  return [String(car.year), `${car.power} л.с.`, car.drive];
}

/** Форматирование цены: 12 340 000 ₽ (без зависимости от локали рантайма). */
export function formatPrice(value: number): string {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}
