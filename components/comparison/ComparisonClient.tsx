"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Switch } from "@heroui/react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  ArrowIcon,
  CloseIcon,
  ListAddIcon,
  PlusIcon,
  ShareIcon,
} from "@/components/icons";
import { CarCard } from "@/components/cards/cards";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
import { Badge } from "@/components/ui/primitives";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";
import {
  type Car,
  type Spec,
  type SpecRawValue,
  carTags,
  formatPrice,
  getCarSpecs,
} from "@/lib/cars";

type ComparisonValue = {
  rawValue: SpecRawValue | undefined;
  displayValue: string;
};

type ComparisonRow = {
  key: string;
  label: string;
  values: ComparisonValue[];
  isDifferent: boolean;
};

const MAX_VISIBLE_COMPARISON_CARS = 4;
const MAX_INDEPENDENT_COMPARISON_CARS = 2;
const MIN_COMPARISON_COLUMN_WIDTH = 150;
const COMPACT_COMPARISON_GAP = 6;
const COMPACT_COMPARISON_PADDING = 12;

function normalizeRawValue(value: SpecRawValue | undefined): string {
  if (value === undefined) return "missing";
  if (typeof value === "string") {
    return `string:${value.trim().toLocaleLowerCase("ru-RU")}`;
  }
  return `${typeof value}:${String(value)}`;
}

function valuesAreDifferent(values: ComparisonValue[]): boolean {
  return new Set(values.map(({ rawValue }) => normalizeRawValue(rawValue))).size > 1;
}

export function buildComparisonRows(
  specs: { primary: Spec[]; extra: Spec[] }[],
  section: "primary" | "extra",
): ComparisonRow[] {
  if (specs.length === 0) return [];

  const definitions = new Map<string, Pick<Spec, "key" | "label">>();
  specs.forEach((carSpecs) => {
    carSpecs[section].forEach(({ key, label }) => {
      if (!definitions.has(key)) definitions.set(key, { key, label });
    });
  });

  return Array.from(definitions.values(), ({ key, label }) => {
    const values = specs.map((carSpecs) => {
      const spec = carSpecs[section].find((candidate) => candidate.key === key);
      return spec
        ? { rawValue: spec.rawValue, displayValue: spec.displayValue }
        : { rawValue: undefined, displayValue: "—" };
    });

    return {
      key,
      label,
      values,
      isDifferent: valuesAreDifferent(values),
    };
  });
}

export function getComparisonColumnCount(viewportWidth: number): number {
  if (viewportWidth >= 1000) return 4;
  if (viewportWidth >= 800) return 3;

  const minimumWidthForPair =
    MIN_COMPARISON_COLUMN_WIDTH * 2 +
    COMPACT_COMPARISON_GAP +
    COMPACT_COMPARISON_PADDING;
  const pageGutters = viewportWidth <= 480 ? 40 : viewportWidth <= 640 ? 60 : 80;
  const availableWidth = viewportWidth - pageGutters;
  return availableWidth >= minimumWidthForPair ? 2 : 1;
}

export function getCyclicComparisonCandidate(
  cars: Car[],
  currentId: string,
  occupiedIds: ReadonlySet<string>,
  direction: -1 | 1,
): Car | null {
  const currentIndex = cars.findIndex((car) => car.id === currentId);
  if (currentIndex < 0) return null;

  for (let offset = 1; offset < cars.length; offset += 1) {
    const index =
      (currentIndex + direction * offset + cars.length) % cars.length;
    const candidate = cars[index];
    if (!occupiedIds.has(candidate.id)) return candidate;
  }

  return null;
}

function getBestVisibleStart(
  cars: Car[],
  selectedIds: string[],
  columnCount: number,
  currentStart: number,
): number {
  const maxStart = Math.max(0, cars.length - columnCount);
  let bestStart = Math.min(currentStart, maxStart);
  let bestScore = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let start = 0; start <= maxStart; start += 1) {
    const ids = new Set(cars.slice(start, start + columnCount).map((car) => car.id));
    const score = selectedIds.filter((id) => ids.has(id)).length;
    const distance = Math.abs(start - currentStart);
    if (score > bestScore || (score === bestScore && distance < bestDistance)) {
      bestStart = start;
      bestScore = score;
      bestDistance = distance;
    }
  }

  return bestStart;
}

export function ComparisonClient({ cars }: { cars: Car[] }) {
  const { comparisonIds, setCompared, storageReady } = useVehicleActions();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [shareStatus, setShareStatus] = useState<
    "idle" | "shared" | "copied" | "error"
  >("idle");
  const [visibleColumnCount, setVisibleColumnCount] = useState(
    MAX_VISIBLE_COMPARISON_CARS,
  );
  const [visibleStart, setVisibleStart] = useState(0);
  const [independentVisibleIds, setIndependentVisibleIds] = useState<string[]>(
    [],
  );
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const comparisonViewportRef = useRef<HTMLDivElement>(null);
  const specificationsRef = useRef<HTMLElement>(null);
  const previousIndependentModeRef = useRef<boolean | null>(null);
  const sharedComparisonAppliedRef = useRef(false);
  const shareStatusTimerRef = useRef<number | null>(null);
  const carsById = new Map(cars.map((car) => [car.id, car]));
  const comparedCars = comparisonIds.flatMap((id) => {
    const car = carsById.get(id);
    return car ? [car] : [];
  });
  const specs = comparedCars.map(getCarSpecs);
  const effectiveOnlyDifferences = onlyDifferences && comparedCars.length > 1;

  const priceValues: ComparisonValue[] = comparedCars.map((car) => ({
    rawValue: car.price,
    displayValue: formatPrice(car.price),
  }));
  const allRows: ComparisonRow[] = [
    {
      key: "price",
      label: "Стоимость",
      values: priceValues,
      isDifferent: valuesAreDifferent(priceValues),
    },
    ...buildComparisonRows(specs, "primary"),
    ...buildComparisonRows(specs, "extra"),
  ];
  const rows = effectiveOnlyDifferences
    ? allRows.filter((row) => row.isDifferent)
    : allRows;

  const renderedColumnCount = Math.max(
    1,
    Math.min(visibleColumnCount, comparedCars.length),
  );
  const maxVisibleStart = Math.max(
    0,
    comparedCars.length - renderedColumnCount,
  );
  const resolvedVisibleStart = Math.min(visibleStart, maxVisibleStart);
  const windowVisibleCars = comparedCars.slice(
    resolvedVisibleStart,
    resolvedVisibleStart + renderedColumnCount,
  );
  const usesIndependentSelectors = visibleColumnCount <= 2;
  const normalizedIndependentIds = independentVisibleIds
    .filter(
      (id, index, ids) =>
        carsById.has(id) &&
        comparisonIds.includes(id) &&
        ids.indexOf(id) === index,
    )
    .slice(0, MAX_INDEPENDENT_COMPARISON_CARS);

  for (const car of comparedCars) {
    if (
      normalizedIndependentIds.length >=
      Math.min(MAX_INDEPENDENT_COMPARISON_CARS, comparedCars.length)
    ) {
      break;
    }
    if (!normalizedIndependentIds.includes(car.id)) {
      normalizedIndependentIds.push(car.id);
    }
  }

  const independentVisibleCars = normalizedIndependentIds
    .slice(0, renderedColumnCount)
    .flatMap((id) => {
      const car = carsById.get(id);
      return car ? [car] : [];
    });
  const visibleCars = usesIndependentSelectors
    ? independentVisibleCars
    : windowVisibleCars;
  const canShowPrevious = resolvedVisibleStart > 0;
  const canShowNext = resolvedVisibleStart < maxVisibleStart;
  const hasIndependentNavigation =
    usesIndependentSelectors && comparedCars.length > 1;
  const hasWindowNavigation =
    !usesIndependentSelectors && comparedCars.length > renderedColumnCount;

  const comparisonStyle = {
    "--comparison-columns": visibleCars.length,
  } as CSSProperties;

  useEffect(() => {
    if (!storageReady || sharedComparisonAppliedRef.current) return;
    sharedComparisonAppliedRef.current = true;

    const url = new URL(window.location.href);
    const sharedSlugs = url.searchParams
      .get("cars")
      ?.split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);

    if (!sharedSlugs?.length) return;

    const carsBySlug = new Map(cars.map((car) => [car.slug, car.id]));
    const sharedIds = Array.from(
      new Set(
        sharedSlugs.flatMap((slug) => {
          const id = carsBySlug.get(slug);
          return id ? [id] : [];
        }),
      ),
    );

    url.searchParams.delete("cars");
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );

    if (sharedIds.length === 0) return;

    comparisonIds.forEach((id) => setCompared(id, false));
    sharedIds.forEach((id) => setCompared(id, true));
  }, [cars, comparisonIds, setCompared, storageReady]);

  useEffect(
    () => () => {
      if (shareStatusTimerRef.current !== null) {
        window.clearTimeout(shareStatusTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    document.body.classList.add("comparison-route");
    return () => document.body.classList.remove("comparison-route");
  }, []);

  useLayoutEffect(() => {
    const viewport = comparisonViewportRef.current;
    if (!viewport || !storageReady || comparedCars.length === 0) return;

    const updateVisibleColumns = () => {
      const nextColumnCount = getComparisonColumnCount(window.innerWidth);

      setVisibleColumnCount((current) =>
        current === nextColumnCount
          ? current
          : Math.min(MAX_VISIBLE_COMPARISON_CARS, nextColumnCount),
      );
    };

    updateVisibleColumns();
    const resizeObserver = new ResizeObserver(updateVisibleColumns);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [comparedCars.length, storageReady]);

  useEffect(() => {
    setVisibleStart((current) => Math.min(current, maxVisibleStart));
  }, [maxVisibleStart]);

  const normalizedIndependentIdsKey = normalizedIndependentIds.join(",");

  useEffect(() => {
    setIndependentVisibleIds((current) =>
      current.join(",") === normalizedIndependentIdsKey
        ? current
        : normalizedIndependentIds,
    );
  }, [normalizedIndependentIdsKey]);

  useEffect(() => {
    const previousMode = previousIndependentModeRef.current;
    previousIndependentModeRef.current = usesIndependentSelectors;

    if (previousMode === true && !usesIndependentSelectors) {
      setVisibleStart((current) =>
        getBestVisibleStart(
          comparedCars,
          normalizedIndependentIds,
          renderedColumnCount,
          current,
        ),
      );
    }
  }, [
    usesIndependentSelectors,
    renderedColumnCount,
    normalizedIndependentIdsKey,
    comparedCars,
  ]);

  function getIndependentCandidate(
    columnIndex: number,
    direction: -1 | 1,
  ): Car | null {
    const currentCar = independentVisibleCars[columnIndex];
    if (!currentCar) return null;

    const occupiedIds = new Set(
      independentVisibleCars
        .filter((_, index) => index !== columnIndex)
        .map((car) => car.id),
    );

    return getCyclicComparisonCandidate(
      comparedCars,
      currentCar.id,
      occupiedIds,
      direction,
    );
  }

  function selectIndependentCar(columnIndex: number, car: Car) {
    setIndependentVisibleIds(() => {
      const next = [...normalizedIndependentIds];
      const duplicateIndex = next.findIndex(
        (id, index) => index !== columnIndex && id === car.id,
      );
      if (duplicateIndex >= 0) next[duplicateIndex] = next[columnIndex];
      next[columnIndex] = car.id;
      return next;
    });
  }

  function setTemporaryShareStatus(
    status: Exclude<typeof shareStatus, "idle">,
  ) {
    setShareStatus(status);
    if (shareStatusTimerRef.current !== null) {
      window.clearTimeout(shareStatusTimerRef.current);
    }
    shareStatusTimerRef.current = window.setTimeout(
      () => setShareStatus("idle"),
      2200,
    );
  }

  useEffect(() => {
    if (!storageReady || comparedCars.length === 0) {
      setIsStickyVisible(false);
      return;
    }

    let frameId = 0;
    const updateStickyVisibility = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const products = comparisonViewportRef.current;
        const specifications = specificationsRef.current;
        if (!products || !specifications) return;

        const stickyTop = window.innerWidth <= 640 ? 10 : 18;
        const productsRect = products.getBoundingClientRect();
        const specificationsRect = specifications.getBoundingClientRect();
        const shouldShow =
          productsRect.bottom <= stickyTop &&
          specificationsRect.bottom > stickyTop + 80;

        setIsStickyVisible((current) =>
          current === shouldShow ? current : shouldShow,
        );
      });
    };

    updateStickyVisibility();
    window.addEventListener("scroll", updateStickyVisibility, { passive: true });
    window.addEventListener("resize", updateStickyVisibility);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateStickyVisibility);
      window.removeEventListener("resize", updateStickyVisibility);
    };
  }, [comparedCars.length, storageReady]);

  async function shareComparison() {
    const shareUrl = new URL("/comparison", window.location.origin);
    shareUrl.searchParams.set(
      "cars",
      comparedCars.map((car) => car.slug).join(","),
    );

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Сравнение автомобилей — Imperium Motors",
          url: shareUrl.toString(),
        });
        setTemporaryShareStatus("shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(shareUrl.toString());
      setTemporaryShareStatus("copied");
    } catch {
      setTemporaryShareStatus("error");
    }
  }

  const shareLabel = {
    idle: "Поделиться",
    shared: "Ссылка отправлена",
    copied: "Ссылка скопирована",
    error: "Не удалось скопировать ссылку",
  }[shareStatus];

  function renderIndependentPager(
    car: Car,
    columnIndex: number,
    location: "products" | "sticky",
  ) {
    const carIndex = comparedCars.findIndex(
      (candidate) => candidate.id === car.id,
    );
    const previousCar = getIndependentCandidate(columnIndex, -1);
    const nextCar = getIndependentCandidate(columnIndex, 1);

    return (
      <div
        className={`comparison-products__pager comparison-products__pager--${location}`}
        aria-label={`Автомобиль ${carIndex + 1} из ${comparedCars.length}`}
      >
        <Button
          className="comparison-products__pager-button comparison-products__pager-button--previous"
          bare
          iconOnly
          startIcon={<ArrowIcon width={8} height={8} />}
          aria-label={`Показать предыдущий автомобиль в колонке ${columnIndex + 1}`}
          disabled={!previousCar}
          onClick={() => {
            if (previousCar) selectIndependentCar(columnIndex, previousCar);
          }}
        />
        <span className="comparison-products__pager-label">
          {carIndex + 1} из {comparedCars.length}
        </span>
        <Button
          className="comparison-products__pager-button comparison-products__pager-button--next"
          bare
          iconOnly
          startIcon={<ArrowIcon width={8} height={8} />}
          aria-label={`Показать следующий автомобиль в колонке ${columnIndex + 1}`}
          disabled={!nextCar}
          onClick={() => {
            if (nextCar) selectIndependentCar(columnIndex, nextCar);
          }}
        />
      </div>
    );
  }

  return (
    <main className="comparison-page">
      <Crumbs
        className="comparison-crumbs"
        items={[{ label: "Главная", href: "/" }, { label: "Сравнение" }]}
      />

      <header className="comparison-head">
        <div className="comparison-head__title">
          <h1 className="t-page-title">Сравнение автомобилей</h1>
          {storageReady && (
            <Badge color="info" size="m" responsive>
              {comparedCars.length}
            </Badge>
          )}
        </div>

        {storageReady && comparedCars.length > 0 && (
          <div className="comparison-head__tools">
            <ButtonLink
              href="/catalog"
              className="comparison-head__action"
              bare
              ripple={false}
              startIcon={
                <span className="comparison-head__action-icon">
                  <PlusIcon width={16} height={16} />
                </span>
              }
            >
              Добавить автомобиль
            </ButtonLink>
            <Button
              className="comparison-head__action"
              bare
              ripple={false}
              startIcon={
                <span className="comparison-head__action-icon">
                  <ShareIcon width={16} height={16} />
                </span>
              }
              onClick={shareComparison}
              aria-live="polite"
            >
              {shareLabel}
            </Button>
          </div>
        )}
      </header>

      {!storageReady ? (
        <section
          className="comparison-loading comparison-loading--skeleton"
          role="status"
          aria-label="Загружаем сравнение автомобилей"
        >
          <span className="comparison-loading__sr">Загружаем сравнение…</span>
          <div className="comparison-loading__products" aria-hidden="true">
            {Array.from({ length: MAX_VISIBLE_COMPARISON_CARS }, (_, index) => (
              <div className="comparison-loading__card" key={index}>
                <span className="comparison-loading__line comparison-loading__line--short" />
                <span className="comparison-loading__line" />
                <span className="comparison-loading__photo" />
                <span className="comparison-loading__line comparison-loading__line--price" />
              </div>
            ))}
          </div>
        </section>
      ) : comparedCars.length === 0 ? (
        <section className="comparison-empty">
          <ListAddIcon className="comparison-empty__icon" />
          <div className="comparison-empty__text">
            <h2>В сравнении пока ничего нет</h2>
            <p>
              Добавьте несколько автомобилей, чтобы сопоставить их
              характеристики и выбрать подходящий.
            </p>
          </div>
          <ButtonLink href="/catalog" size="l" variant="primary-surface">
            Перейти в каталог
          </ButtonLink>
        </section>
      ) : (
        <>
          {comparedCars.length === 1 && (
            <aside className="comparison-hint">
              <span>
                Добавьте ещё один автомобиль, чтобы увидеть различия.
              </span>
              <ButtonLink
                href="/catalog"
                size="m"
                variant="secondary-outlined"
              >
                Добавить автомобиль
              </ButtonLink>
            </aside>
          )}

          <div
            className="comparison-scroll"
            aria-label="Таблица сравнения автомобилей"
          >
            <div className="comparison-data" style={comparisonStyle}>
              <div
                className="comparison-products-shell"
                ref={comparisonViewportRef}
              >
                <div className="comparison-products" aria-live="polite">
                  {visibleCars.map((car, columnIndex) => (
                    <div className="comparison-products__column" key={car.id}>
                      <div className="comparison-products__card">
                        <CarCard
                          size="m"
                          variant="comparison"
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
                          action={{
                            label: "Подробнее",
                            variant: "primary-surface",
                          }}
                        />
                      </div>

                      {hasIndependentNavigation &&
                        renderIndependentPager(car, columnIndex, "products")}
                    </div>
                  ))}
                </div>

                {hasWindowNavigation && (
                  <>
                    <Button
                      className="comparison-products__nav comparison-products__nav--previous"
                      bare
                      iconOnly
                      startIcon={<ArrowIcon />}
                      aria-label="Показать предыдущий автомобиль"
                      disabled={!canShowPrevious}
                      onClick={() =>
                        setVisibleStart(Math.max(0, resolvedVisibleStart - 1))
                      }
                    />
                    <Button
                      className="comparison-products__nav comparison-products__nav--next"
                      bare
                      iconOnly
                      startIcon={<ArrowIcon />}
                      aria-label="Показать следующий автомобиль"
                      disabled={!canShowNext}
                      onClick={() =>
                        setVisibleStart(
                          Math.min(maxVisibleStart, resolvedVisibleStart + 1),
                        )
                      }
                    />
                  </>
                )}
              </div>

              <section
                className="comparison-specifications"
                ref={specificationsRef}
              >
                <div className="comparison-specifications__head">
                  <h2 className="comparison-specifications__title">
                    Характеристики
                  </h2>
                  <Switch.Root
                    className="comparison-switch"
                    isSelected={effectiveOnlyDifferences}
                    isDisabled={comparedCars.length < 2}
                    onChange={setOnlyDifferences}
                  >
                    <Switch.Content className="comparison-switch__content">
                      <Switch.Control className="comparison-switch__control">
                        <Switch.Thumb className="comparison-switch__thumb" />
                      </Switch.Control>
                      <span className="comparison-switch__label">
                        Только различия
                      </span>
                    </Switch.Content>
                  </Switch.Root>
                </div>

                {rows.length === 0 ? (
                  <div className="comparison-no-differences">
                    У выбранных автомобилей нет различий в доступных
                    характеристиках.
                  </div>
                ) : (
                  <div
                    className="comparison-characteristics"
                    aria-label="Характеристики"
                  >
                    {rows.map((row, rowIndex) => {
                      const labelId = `comparison-spec-${rowIndex}`;
                      const visibleValues = visibleCars.map((car) => {
                        const carIndex = comparedCars.findIndex(
                          (candidate) => candidate.id === car.id,
                        );
                        return row.values[carIndex];
                      });

                      return (
                        <div
                          className={`comparison-characteristic${row.isDifferent ? " is-different" : ""}`}
                          role="group"
                          aria-labelledby={labelId}
                          key={row.key}
                        >
                          <span
                            className="comparison-characteristic__label"
                            id={labelId}
                          >
                            {row.label}
                          </span>
                          <div className="comparison-characteristic__values">
                            {visibleValues.map((value, carIndex) => (
                              <div
                                className="comparison-characteristic__value"
                                key={visibleCars[carIndex].id}
                              >
                                {row.key === "color" &&
                                  value.rawValue !== undefined && (
                                    <span
                                      className="comparison-characteristic__swatch"
                                      style={{
                                        backgroundColor:
                                          visibleCars[carIndex].color.swatch,
                                      }}
                                      aria-hidden="true"
                                    />
                                  )}
                                {value.displayValue}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>

          {isStickyVisible &&
            typeof document !== "undefined" &&
            createPortal(
              <aside
                className="comparison-sticky is-visible"
                style={comparisonStyle}
                aria-label="Закреплённые сравниваемые автомобили"
              >
                <div className="comparison-sticky__grid">
                  {visibleCars.map((car, columnIndex) => (
                    <div className="comparison-sticky__column" key={car.id}>
                      <article className="comparison-sticky-card">
                        <Link
                          className="comparison-sticky-card__link"
                          href={`/catalog/${car.slug}`}
                          aria-hidden="true"
                          tabIndex={-1}
                        />
                        <div className="comparison-sticky-card__media">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={car.photo} alt="" />
                        </div>
                        <Link
                          className="comparison-sticky-card__content"
                          href={`/catalog/${car.slug}`}
                          aria-label={`Открыть страницу ${car.name}`}
                        >
                          <strong>{car.name}</strong>
                          <span>{formatPrice(car.price)}</span>
                        </Link>
                        <Button
                          className="comparison-sticky-card__remove"
                          bare
                          iconOnly
                          startIcon={<CloseIcon />}
                          aria-label={`Удалить ${car.name} из сравнения`}
                          onClick={() => setCompared(car.id, false)}
                        />
                      </article>
                      {hasIndependentNavigation &&
                        renderIndependentPager(car, columnIndex, "sticky")}
                    </div>
                  ))}
                </div>
              </aside>,
              document.body,
            )}
        </>
      )}
    </main>
  );
}
