"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Skeleton } from "@heroui/react";
import { Badge, CarCard, CarCardSkeleton } from "@/components";
import { FiltersIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
import { SheetPortal } from "@/components/ui/SheetPortal";
import {
  type Car,
  type FacetKey,
  type FacetOption,
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

const SORT_VALUES: SortKey[] = ["popular", "price-asc", "price-desc"];
const RANGE_QUERY_KEYS = ["priceMin", "priceMax", "powerMin", "powerMax"] as const;

type CatalogUrlState = {
  selected: Record<FacetKey, string[]>;
  price: RangeValue;
  power: RangeValue;
  sort: SortKey;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function readCatalogUrl(
  search: string,
  options: Record<FacetKey, FacetOption[]>,
): CatalogUrlState {
  const params = new URLSearchParams(search);
  const selected = emptySelection();

  for (const facet of FACETS) {
    const allowed = new Set(options[facet.key].map((option) => option.value));
    const values = (params.get(facet.key) ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter((value, index, list) =>
        Boolean(value) && allowed.has(value) && list.indexOf(value) === index,
      );
    selected[facet.key] = values;
  }

  const numberParam = (key: string, fallback: number, min: number, max: number) => {
    const parsed = Number(params.get(key));
    return Number.isFinite(parsed) && params.has(key)
      ? clamp(Math.round(parsed), min, max)
      : fallback;
  };

  const priceMin = numberParam("priceMin", PRICE_MIN, PRICE_MIN, PRICE_MAX);
  const priceMax = numberParam("priceMax", PRICE_MAX, PRICE_MIN, PRICE_MAX);
  const powerMin = numberParam("powerMin", POWER_MIN, POWER_MIN, POWER_MAX);
  const powerMax = numberParam("powerMax", POWER_MAX, POWER_MIN, POWER_MAX);
  const requestedSort = params.get("sort") as SortKey | null;

  return {
    selected,
    price: [Math.min(priceMin, priceMax), priceMax],
    power: [Math.min(powerMin, powerMax), powerMax],
    sort: requestedSort && SORT_VALUES.includes(requestedSort)
      ? requestedSort
      : "popular",
  };
}

function catalogSearchForState(search: string, state: CatalogUrlState) {
  const params = new URLSearchParams(search);

  for (const facet of FACETS) {
    params.delete(facet.key);
    if (state.selected[facet.key].length) {
      params.set(facet.key, state.selected[facet.key].join(","));
    }
  }

  for (const key of RANGE_QUERY_KEYS) params.delete(key);
  if (state.price[0] !== PRICE_MIN) params.set("priceMin", String(state.price[0]));
  if (state.price[1] !== PRICE_MAX) params.set("priceMax", String(state.price[1]));
  if (state.power[0] !== POWER_MIN) params.set("powerMin", String(state.power[0]));
  if (state.power[1] !== POWER_MAX) params.set("powerMax", String(state.power[1]));

  params.delete("sort");
  if (state.sort !== "popular") params.set("sort", state.sort);

  return params.toString();
}

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
  /** Подготовлено для будущего API/1С; синхронные моки не включают loading. */
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
};

export function CatalogClient({
  cars,
  title = "Автомобили в наличии",
  crumbLabel = "Каталог",
  hiddenFacets,
  showFilters = true,
  loading = false,
  error,
  onRetry,
}: CatalogClientProps) {
  const options = useMemo(() => getFacetOptions(cars), [cars]);

  const [selected, setSelected] =
    useState<Record<FacetKey, string[]>>(emptySelection);
  const [price, setPrice] = useState<RangeValue>([PRICE_MIN, PRICE_MAX]);
  const [power, setPower] = useState<RangeValue>([POWER_MIN, POWER_MAX]);
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersUseSheet, setFiltersUseSheet] = useState(false);
  const [urlReady, setUrlReady] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement | null>(null);
  const filterDialogRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const wasFiltersOpenRef = useRef(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const previousResultCountRef = useRef(cars.length);
  const shouldSyncUrl = showFilters && crumbLabel === "Каталог";

  // Кол-во активных фильтров — для бейджа на кнопке «Фильтры»
  const filterCount = useMemo(
    () =>
      FACETS.reduce((n, f) => n + selected[f.key].length, 0) +
      (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0) +
      (power[0] !== POWER_MIN || power[1] !== POWER_MAX ? 1 : 0),
    [power, price, selected],
  );

  // Мобильный drawer фильтров: блокировка скролла, Escape, авто-закрытие >=1200
  useEffect(() => {
    if (!filtersOpen || !filtersUseSheet) return;

    const previousOverflow = document.body.style.overflow;
    previousBodyOverflowRef.current = previousOverflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = previousBodyOverflowRef.current ?? previousOverflow;
      }
      previousBodyOverflowRef.current = null;
    };
  }, [filtersOpen, filtersUseSheet]);

  useEffect(() => {
    if (!filtersOpen || !filtersUseSheet) return;

    const dialog = filterDialogRef.current;
    if (!dialog) return;

    const layer = dialog.closest(".ui-sheet-layer");
    const backgroundNodes = Array.from(document.body.children)
      .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== layer)
      .map((node) => ({ node, inert: node.inert }));
    for (const entry of backgroundNodes) entry.node.inert = true;

    const focusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          element.getClientRects().length > 0 &&
          !element.closest('[aria-hidden="true"]'),
      );

    const focusFrame = window.requestAnimationFrame(() => {
      (focusableElements()[0] ?? dialog).focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFiltersOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = focusableElements();
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown, true);
      for (const entry of backgroundNodes) entry.node.inert = entry.inert;
    };
  }, [filtersOpen, filtersUseSheet]);

  useEffect(() => {
    if (filtersOpen) {
      wasFiltersOpenRef.current = true;
      return;
    }
    if (!wasFiltersOpenRef.current) return;

    wasFiltersOpenRef.current = false;
    const focusFrame = window.requestAnimationFrame(() => {
      const trigger = filterTriggerRef.current;
      if (trigger?.isConnected && trigger.getClientRects().length > 0) trigger.focus();
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [filtersOpen]);

  useEffect(() => {
    // Порог совпадает с CSS-переключателем блока (min-width:1200): фильтр —
    // drawer ниже 1200, прилипающий сайдбар с 1200. Ключ по min-width (а не
    // max-width:1199) закрывает дырку на дробных ширинах ~1199.5.
    const mq = window.matchMedia("(min-width: 1200px)");
    const syncSheetMode = () => {
      setFiltersUseSheet(!mq.matches);
      if (mq.matches) setFiltersOpen(false);
    };

    syncSheetMode();
    mq.addEventListener("change", syncSheetMode);
    return () => mq.removeEventListener("change", syncSheetMode);
  }, []);

  useEffect(() => {
    if (!shouldSyncUrl) {
      setUrlReady(true);
      return;
    }

    const applyUrlState = () => {
      const next = readCatalogUrl(window.location.search, options);
      setSelected(next.selected);
      setPrice(next.price);
      setPower(next.power);
      setSort(next.sort);

      const canonical = catalogSearchForState(window.location.search, next);
      const current = window.location.search.slice(1);
      if (canonical !== current) {
        const url = `${window.location.pathname}${canonical ? `?${canonical}` : ""}${window.location.hash}`;
        window.history.replaceState(window.history.state, "", url);
      }
      setUrlReady(true);
    };

    applyUrlState();
    window.addEventListener("popstate", applyUrlState);
    return () => window.removeEventListener("popstate", applyUrlState);
  }, [options, shouldSyncUrl]);

  useEffect(() => {
    if (!shouldSyncUrl || !urlReady) return;

    const updateTimer = window.setTimeout(() => {
      const nextSearch = catalogSearchForState(window.location.search, {
        selected,
        price,
        power,
        sort,
      });
      if (nextSearch === window.location.search.slice(1)) return;

      const url = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
      window.history.pushState(window.history.state, "", url);
    }, 180);

    return () => window.clearTimeout(updateTimer);
  }, [power, price, selected, shouldSyncUrl, sort, urlReady]);

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

  useEffect(() => {
    const previousCount = previousResultCountRef.current;
    previousResultCountRef.current = displayedCars.length;
    if (previousCount === displayedCars.length) return;

    const scrollFrame = window.requestAnimationFrame(() => {
      const results = resultsRef.current;
      if (!results) return;
      const rect = results.getBoundingClientRect();
      const resultsTop = rect.top + window.scrollY;
      const resultsBottom = rect.bottom + window.scrollY;
      if (window.scrollY <= resultsBottom - 48) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: Math.max(0, resultsTop - 24),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(scrollFrame);
  }, [displayedCars.length]);

  const filterLayer = showFilters ? (
    <>
      <div
        className={`cat-filters-backdrop${filtersOpen ? " is-open" : ""}`}
        onClick={() => setFiltersOpen(false)}
        aria-hidden="true"
      />
      <FilterSidebar
        open={filtersOpen}
        isDrawer={filtersUseSheet}
        containerRef={filterDialogRef}
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
          {loading ? (
            <Skeleton
              className="imperium-skeleton catalog-head__count-skeleton"
              aria-hidden="true"
            />
          ) : (
            <Badge size="m" responsive color="info">
              {sorted.length}
            </Badge>
          )}
        </div>
        <div className="catalog-head__tools">
          {showFilters && (
            <Button
              bare
              ripple={false}
              className="cat-filters-toggle"
              aria-controls="catalog-filter-dialog"
              aria-haspopup="dialog"
              aria-expanded={filtersOpen}
              onClick={(event) => {
                filterTriggerRef.current = event.currentTarget;
                setFiltersOpen(true);
              }}
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

        <div
          ref={resultsRef}
          className="catalog-results"
          aria-busy={loading || undefined}
        >
          {loading ? (
            <div
              className={`catalog-grid catalog-grid--loading${showFilters ? "" : " catalog-grid--wide"}`}
              role="status"
              aria-label="Загружаем автомобили"
            >
              {Array.from({ length: showFilters ? 6 : 8 }, (_, index) => (
                <CarCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="catalog-empty catalog-error" role="alert">
              <p>{error}</p>
              {onRetry && (
                <Button size="m" variant="secondary-outlined" onClick={onRetry}>
                  Повторить
                </Button>
              )}
            </div>
          ) : sorted.length > 0 ? (
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
            <div className="catalog-empty" role="status">
              <p>По заданным фильтрам ничего не найдено. Попробуйте изменить условия.</p>
              <Button size="m" variant="secondary-outlined" onClick={clearAll}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default CatalogClient;
