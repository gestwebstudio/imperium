import type { Car, FacetKey } from "@/lib/cars";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { TradeLeasing } from "@/components/catalog/TradeLeasing";
import { Podbor } from "@/components/catalog/Podbor";
import { BodyTypes } from "@/components/home/BodyTypes";
import { CarsSection } from "@/components/home/CarsSection";
import { Contacts } from "@/components/home/Contacts";

/**
 * SEO-страница-подборка (по кузову/бренду). Похожа на каталог, но с урезанным
 * фильтром: `hiddenFacets` прячет фасет подборки (напр. «Кузов» на странице
 * внедорожников), а `cars` уже отфильтрованы под тип. Почти все блоки —
 * переиспользование существующих.
 */
export type CollectionPageProps = {
  /** Заголовок H1, напр. «Новые внедорожники в наличии в Москве». */
  title: string;
  /** Подпись текущей хлебной крошки, напр. «Внедорожники». */
  crumbLabel: string;
  /** Машины подборки (уже отфильтрованы под тип). */
  cars: Car[];
  /** Фасеты, скрытые из фильтра (напр. ["body"] для кузова). */
  hiddenFacets: FacetKey[];
  /** Машины для блока «Просмотренные автомобили». */
  viewed: Car[];
};

export function CollectionPage({
  title,
  crumbLabel,
  cars,
  hiddenFacets,
  viewed,
}: CollectionPageProps) {
  return (
    <main className="catalog">
      <CatalogClient
        cars={cars}
        title={title}
        crumbLabel={crumbLabel}
        hiddenFacets={hiddenFacets}
      />
      <BodyTypes />
      <Podbor />
      <TradeLeasing />
      <CarsSection title="Просмотренные автомобили" cars={viewed} />
      <Contacts />
    </main>
  );
}

export default CollectionPage;
