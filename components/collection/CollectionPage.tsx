import type { Car, FacetKey } from "@/lib/cars";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { TradeLeasing } from "@/components/catalog/TradeLeasing";
import { Podbor } from "@/components/catalog/Podbor";
import { BodyTypesNav } from "@/components/collection/BodyTypesNav";
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
  /** Лейбл плитки кузова, который скрыть в блоке «типы кузова». */
  excludeBody?: string;
};

export function CollectionPage({
  title,
  crumbLabel,
  cars,
  hiddenFacets,
  viewed,
  excludeBody,
}: CollectionPageProps) {
  return (
    <main className="catalog">
      <CatalogClient
        cars={cars}
        title={title}
        crumbLabel={crumbLabel}
        hiddenFacets={hiddenFacets}
      />
      <BodyTypesNav exclude={excludeBody} />
      <Podbor />
      <TradeLeasing />
      <CarsSection title="Просмотренные автомобили" cars={viewed} />
      <Contacts />
    </main>
  );
}

export default CollectionPage;
