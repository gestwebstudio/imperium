"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, CarCard } from "@/components";
import { FiltersIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
import { SheetPortal } from "@/components/ui/SheetPortal";
import {
  type Car,
  type FacetKey,
  FACETS,
  carTags,
  formatPrice,
  getFacetOptions,
  PRICE_MIN,
  PRICE_MAX,
  POWER_MIN,
  POWER_MAX,
} from "@/lib/cars";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown, type SortKey } from "./SortDropdown";
import type { RangeValue } from "./RangeFilter";

const emptySelection = () =>
  Object.fromEntries(FACETS.map((f) => [f.key, [] as string[]])) as Record<
    FacetKey,
    string[]
  >;

export type CatalogClientProps = {
  cars: Car[];
  /** Заголовок H1 (по умолчанию — каталог). */
  title?: string;
  /** Подпись текущей хлебной крошки. */
  crumbLabel?: string;
  /** Фасеты, скрытые из сайдбара (для урезанных подборок: кузов/бренд). */
  hiddenFacets?: FacetKey[];
  /** Показывать ли фильтр. false → сайдбара нет, грид на колонку шире. */
  showFilters?: boolean;
};

export function CatalogClient({
  cars,
  title = "Автомобили в наличии",
  crumbLabel = "Каталог",
  hiddenFacets,
  showFilters = true,
}: CatalogClientProps) {
  const options = useMemo(() => getFacetOptions(cars), [cars]);

  const [selected, setSelected] =
    useState<Record<FacetKey, string[]>>(emptySelection);
  const [price, setPrice] = useState<RangeValue>([PRICE_MIN, PRICE_MAX]);
  const [power, setPower] = useState<RangeValue>([POWER_MIN, POWER_MAX]);
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersUseSheet, setFiltersUseSheet] = useState(false);

  // Кол-во активных фильтров — для бейджа на кнопке «Фильтры»
  const filterCount =
    FACETS.reduce((n, f) => n + selected[f.key].length, 0) +
    (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0) +
    (power[0] !== POWER_MIN || power[1] !== POWER_MAX ? 1 : 0);

  // Мобильный drawer фильтров: блокировка скролла, Escape, авто-закрытие >=1200
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1199px)");
    const syncSheetMode = () => {
      setFiltersUseSheet(mq.matches);
      if (!mq.matches) setFiltersOpen(false);
    };

    syncSheetMode();
    mq.addEventListener("change", syncSheetMode);
    return () => mq.removeEventListener("change", syncSheetMode);
  }, []);

  const toggleFacet = (key: FacetKey, value: string) =>
    setSelected((s) => {
      const cur = s[key];
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
      return { ...s, [key]: next };
    });

  const clearFacet = (key: FacetKey) =>
    setSelected((s) => ({ ...s, [key]: [] }));

  const clearAll = () => {
    setSelected(emptySelection());
    setPrice([PRICE_MIN, PRICE_MAX]);
    setPower([POWER_MIN, POWER_MAX]);
  };

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (c.price < price[0] || c.price > price[1]) return false;
      if (c.power < power[0] || c.power > power[1]) return false;
      for (const f of FACETS) {
        const sel = selected[f.key];
        if (sel.length && !sel.includes(f.get(c))) return false;
      }
      return true;
    });
  }, [cars, price, power, selected]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    return arr; // popular → исходный порядок
  }, [filtered, sort]);
  const displayedCars = sorted;

  const filterLayer = showFilters ? (
    <>
      <div
        className={`cat-filters-backdrop${filtersOpen ? " is-open" : ""}`}
        onClick={() => setFiltersOpen(false)}
      />
      <FilterSidebar
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        hiddenFacets={hiddenFacets}
        options={options}
        selected={selected}
        onToggleFacet={toggleFacet}
        onClearFacet={clearFacet}
        onClearAll={clearAll}
        price={price}
        power={power}
        onPriceChange={setPrice}
        onPowerChange={setPower}
        priceMin={PRICE_MIN}
        priceMax={PRICE_MAX}
        powerMin={POWER_MIN}
        powerMax={POWER_MAX}
      />
    </>
  ) : null;

  return (
    <div className="catalog-page">
      <Crumbs
        className="cat-crumbs"
        compactOnMobile
        items={[{ label: "Главная", href: "/" }, { label: crumbLabel }]}
      />

      <header className="catalog-head">
        <div className="catalog-head__title">
          <h1 className="t-page-title">{title}</h1>
          <Badge size="m" responsive color="info">
            {sorted.length}
          </Badge>
        </div>
        <div className="catalog-head__tools">
          {showFilters && (
            <Button
              bare
              className="cat-filters-toggle"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(true)}
            >
              <FiltersIcon className="cat-filters-toggle__icon" />
              <span>Фильтры</span>
              {filterCount > 0 && <Badge color="info">{filterCount}</Badge>}
            </Button>
          )}
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </header>

      <div className="catalog-body">
        {filtersUseSheet ? <SheetPortal>{filterLayer}</SheetPortal> : filterLayer}

        <div className="catalog-results">
          {sorted.length > 0 ? (
            <div className={`catalog-grid${showFilters ? "" : " catalog-grid--wide"}`}>
              {displayedCars.map((car) => (
                <CarCard
                  key={car.id}
                  vehicleId={car.id}
                  href={`/catalog/${car.slug}`}
                  brandLogo={car.brandLogo}
                  brandName={car.brand}
                  title={car.name}
                  status={car.status}
                  tags={carTags(car)}
                  photo={car.photo}
                  photoAlt={car.name}
                  price={formatPrice(car.price)}
                  action={{ label: "Подробнее", variant: "primary-surface" }}
                />
              ))}
            </div>
          ) : (
            <p className="catalog-empty">
              По заданным фильтрам ничего не найдено. Попробуйте изменить условия.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

export default CatalogClient;
