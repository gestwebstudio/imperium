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
  carTags,
  formatPrice,
  getCarSpecs,
} from "@/lib/cars";

type ComparisonRow = {
  label: string;
  values: string[];
  isDifferent: boolean;
};

const MAX_VISIBLE_COMPARISON_CARS = 4;

function buildRows(
  specs: { primary: Spec[]; extra: Spec[] }[],
  section: "primary" | "extra",
): ComparisonRow[] {
  if (specs.length === 0) return [];

  return specs[0][section].map((spec, index) => {
    const values = specs.map((carSpecs) => carSpecs[section][index].value);

    return {
      label: spec.label,
      values,
      isDifferent: new Set(values).size > 1,
    };
  });
}

export function ComparisonClient({ cars }: { cars: Car[] }) {
  const { comparisonIds, setCompared, storageReady } = useVehicleActions();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [visibleColumnCount, setVisibleColumnCount] = useState(
    MAX_VISIBLE_COMPARISON_CARS,
  );
  const [visibleStart, setVisibleStart] = useState(0);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const comparisonViewportRef = useRef<HTMLDivElement>(null);
  const specificationsRef = useRef<HTMLElement>(null);
  const sharedComparisonAppliedRef = useRef(false);
  const shareStatusTimerRef = useRef<number | null>(null);
  const carsById = new Map(cars.map((car) => [car.id, car]));
  const comparedCars = comparisonIds.flatMap((id) => {
    const car = carsById.get(id);
    return car ? [car] : [];
  });
  const specs = comparedCars.map(getCarSpecs);
  const effectiveOnlyDifferences = onlyDifferences && comparedCars.length > 1;

  const priceValues = comparedCars.map((car) => formatPrice(car.price));
  const allRows: ComparisonRow[] = [
    {
      label: "Стоимость",
      values: priceValues,
      isDifferent: new Set(priceValues).size > 1,
    },
    ...buildRows(specs, "primary"),
    ...buildRows(specs, "extra"),
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
  const visibleCars = comparedCars.slice(
    resolvedVisibleStart,
    resolvedVisibleStart + renderedColumnCount,
  );
  const canShowPrevious = resolvedVisibleStart > 0;
  const canShowNext = resolvedVisibleStart < maxVisibleStart;
  const hasCarouselNavigation = comparedCars.length > renderedColumnCount;

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

    const updateVisibleColumns = (width: number) => {
      const nextColumnCount =
        width >= 1000 ? 4 : width >= 800 ? 3 : width >= 350 ? 2 : 1;

      setVisibleColumnCount((current) =>
        current === nextColumnCount
          ? current
          : Math.min(MAX_VISIBLE_COMPARISON_CARS, nextColumnCount),
      );
    };

    updateVisibleColumns(viewport.clientWidth);
    const resizeObserver = new ResizeObserver(([entry]) => {
      updateVisibleColumns(entry.contentRect.width);
    });
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [comparedCars.length, storageReady]);

  useEffect(() => {
    setVisibleStart((current) => Math.min(current, maxVisibleStart));
  }, [maxVisibleStart]);

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
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await navigator.clipboard.writeText(shareUrl.toString());
    setShareStatus("copied");
    if (shareStatusTimerRef.current !== null) {
      window.clearTimeout(shareStatusTimerRef.current);
    }
    shareStatusTimerRef.current = window.setTimeout(
      () => setShareStatus("idle"),
      2200,
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
              startIcon={
                <span className="comparison-head__action-icon">
                  <ShareIcon width={16} height={16} />
                </span>
              }
              onClick={shareComparison}
            >
              {shareStatus === "copied" ? "Ссылка скопирована" : "Поделиться"}
            </Button>
          </div>
        )}
      </header>

      {!storageReady ? (
        <div
          className="comparison-loading"
          role="status"
          aria-label="Загружаем сравнение автомобилей"
        />
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

                      {hasCarouselNavigation && (
                        <div
                          className="comparison-products__pager"
                          aria-label={`Автомобиль ${resolvedVisibleStart + columnIndex + 1} из ${comparedCars.length}`}
                        >
                          <Button
                            className="comparison-products__pager-button comparison-products__pager-button--previous"
                            bare
                            iconOnly
                            startIcon={<ArrowIcon width={8} height={8} />}
                            aria-label="Показать предыдущий автомобиль"
                            disabled={!canShowPrevious}
                            onClick={() =>
                              setVisibleStart(
                                Math.max(0, resolvedVisibleStart - 1),
                              )
                            }
                          />
                          <span className="comparison-products__pager-label">
                            {resolvedVisibleStart + columnIndex + 1} из{" "}
                            {comparedCars.length}
                          </span>
                          <Button
                            className="comparison-products__pager-button comparison-products__pager-button--next"
                            bare
                            iconOnly
                            startIcon={<ArrowIcon width={8} height={8} />}
                            aria-label="Показать следующий автомобиль"
                            disabled={!canShowNext}
                            onClick={() =>
                              setVisibleStart(
                                Math.min(
                                  maxVisibleStart,
                                  resolvedVisibleStart + 1,
                                ),
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {hasCarouselNavigation && (
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
                      const visibleValues = row.values.slice(
                        resolvedVisibleStart,
                        resolvedVisibleStart + visibleCars.length,
                      );

                      return (
                        <div
                          className={`comparison-characteristic${row.isDifferent ? " is-different" : ""}`}
                          role="group"
                          aria-labelledby={labelId}
                          key={row.label}
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
                                {row.label === "Цвет" && (
                                  <span
                                    className="comparison-spec-table__swatch"
                                    style={{
                                      backgroundColor:
                                        visibleCars[carIndex].color.swatch,
                                    }}
                                    aria-hidden="true"
                                  />
                                )}
                                {value}
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
                  {visibleCars.map((car) => (
                    <article className="comparison-sticky-card" key={car.id}>
                      <Link
                        className="comparison-sticky-card__link"
                        href={`/catalog/${car.slug}`}
                        aria-label={`Открыть страницу ${car.name}`}
                      />
                      <div className="comparison-sticky-card__media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={car.photo} alt="" />
                      </div>
                      <div className="comparison-sticky-card__content">
                        <strong>{car.name}</strong>
                        <span>{formatPrice(car.price)}</span>
                      </div>
                      <Button
                        className="comparison-sticky-card__remove"
                        bare
                        iconOnly
                        startIcon={<CloseIcon />}
                        aria-label={`Удалить ${car.name} из сравнения`}
                        onClick={() => setCompared(car.id, false)}
                      />
                    </article>
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
