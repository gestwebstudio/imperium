"use client";

import { useEffect, useMemo, useState } from "react";
import { Breadcrumbs } from "@heroui/react";
import { Badge, CarCard } from "@/components";
import { ArrowIcon } from "@/components/icons";
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
};

export function CatalogClient({ cars }: CatalogClientProps) {
  const options = useMemo(() => getFacetOptions(cars), [cars]);

  const [selected, setSelected] =
    useState<Record<FacetKey, string[]>>(emptySelection);
  const [price, setPrice] = useState<RangeValue>([PRICE_MIN, PRICE_MAX]);
  const [power, setPower] = useState<RangeValue>([POWER_MIN, POWER_MAX]);
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Кол-во активных фильтров — для бейджа на кнопке «Фильтры»
  const filterCount =
    FACETS.reduce((n, f) => n + selected[f.key].length, 0) +
    (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0) +
    (power[0] !== POWER_MIN || power[1] !== POWER_MAX ? 1 : 0);

  // Мобильный drawer фильтров: блокировка скролла, Escape, авто-закрытие >1200
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
    const mq = window.matchMedia("(min-width: 1201px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setFiltersOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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

  return (
    <div className="catalog-page">
      <Breadcrumbs
        className="cat-crumbs"
        separator={
          <ArrowIcon className="cat-crumbs__sep" width={12} height={12} />
        }
      >
        <Breadcrumbs.Item href="/" className="cat-crumbs__item">
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item className="cat-crumbs__item cat-crumbs__item--current">
          Каталог
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <header className="catalog-head">
        <div className="catalog-head__title">
          <h1>Автомобили в наличии</h1>
          <Badge color="info">{sorted.length}</Badge>
        </div>
        <div className="catalog-head__tools">
          <button
            type="button"
            className="cat-filters-toggle"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(true)}
          >
            Фильтры
            {filterCount > 0 && <Badge color="info">{filterCount}</Badge>}
          </button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </header>

      <div className="catalog-body">
        <div
          className={`cat-filters-backdrop${filtersOpen ? " is-open" : ""}`}
          onClick={() => setFiltersOpen(false)}
        />
        <FilterSidebar
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
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

        <div className="catalog-results">
          {sorted.length > 0 ? (
            <div className="catalog-grid">
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
