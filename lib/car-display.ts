import type { Car } from "@/lib/cars";

/** Теги карточки: год · мощность · привод. */
export function carTags(car: Car): string[] {
  return [String(car.year), `${car.power} л.с.`, `${car.drive} привод`];
}

/** Форматирование цены без зависимости от локали рантайма. */
export function formatPrice(value: number): string {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}
