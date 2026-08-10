"use client";

import { Accordion, ColorSwatch } from "@heroui/react";
import type { Ref } from "react";
import { useCallback, useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Tooltip as KitTooltip } from "@/components/ui/primitives";
import { Checkbox as KitCheckbox } from "@/components/ui/Checkbox";
import { FACETS, type FacetKey, type FacetOption } from "@/lib/cars";
import { RangeFilter, type RangeValue } from "./RangeFilter";

export type FilterSidebarProps = {
  options: Record<FacetKey, FacetOption[]>;
  selected: Record<FacetKey, string[]>;
  onToggleFacet: (key: FacetKey, value: string) => void;
  onClearFacet: (key: FacetKey) => void;
  onClearAll: () => void;

  price: RangeValue;
  power: RangeValue;
  onPriceChange: (v: RangeValue) => void;
  onPowerChange: (v: RangeValue) => void;

  priceMin: number;
  priceMax: number;
  powerMin: number;
  powerMax: number;

  /** Открыт ли сайдбар как drawer (экраны уже 1200px). */
  open?: boolean;
  /** На узком экране фильтр становится модальным drawer. */
  isDrawer?: boolean;
  /** Закрыть мобильный drawer. */
  onClose?: () => void;
  /** DOM-узел нужен родителю для focus trap. */
  containerRef?: Ref<HTMLElement>;
  /** Фасеты, скрытые из фильтра (для урезанных подборок). */
  hiddenFacets?: FacetKey[];
};

export function FilterSidebar({
  options,
  selected,
  onToggleFacet,
  onClearFacet,
  onClearAll,
  price,
  power,
  onPriceChange,
  onPowerChange,
  priceMin,
  priceMax,
  powerMin,
  powerMax,
  open,
  isDrawer,
  onClose,
  containerRef,
  hiddenFacets,
}: FilterSidebarProps) {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const setSidebarRef = useCallback(
    (node: HTMLElement | null) => {
      sidebarRef.current = node;
      if (typeof containerRef === "function") containerRef(node);
      else if (containerRef && typeof containerRef === "object") {
        (containerRef as { current: HTMLElement | null }).current = node;
      }
    },
    [containerRef],
  );

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || isDrawer) {
      sidebar?.style.removeProperty("--cat-filters-available-height");
      return;
    }

    let frame = 0;
    const updateAvailableHeight = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const top = Math.max(0, sidebar.getBoundingClientRect().top);
        const available = Math.max(240, window.innerHeight - top);
        sidebar.style.setProperty("--cat-filters-available-height", `${available}px`);
      });
    };

    updateAvailableHeight();
    window.addEventListener("resize", updateAvailableHeight);
    window.addEventListener("scroll", updateAvailableHeight, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateAvailableHeight);
      window.removeEventListener("scroll", updateAvailableHeight);
      sidebar.style.removeProperty("--cat-filters-available-height");
    };
  }, [isDrawer]);

  const visibleFacets = FACETS.filter(
    (f) => !hiddenFacets?.includes(f.key),
  );
  const activeFacets = visibleFacets.filter(
    (f) => selected[f.key].length > 0,
  );
  const hasSelection = activeFacets.length > 0;
  const getOptionLabel = (key: FacetKey, value: string) =>
    options[key].find((option) => option.value === value)?.label ?? value;

  return (
    <aside
      id="catalog-filter-dialog"
      ref={setSidebarRef}
      className={`cat-filters${open ? " is-open" : ""}`}
      role={isDrawer && open ? "dialog" : undefined}
      aria-modal={isDrawer && open ? "true" : undefined}
      aria-labelledby={isDrawer && open ? "catalog-filter-dialog-title" : undefined}
      aria-hidden={isDrawer && !open ? "true" : undefined}
      inert={isDrawer && !open ? true : undefined}
      tabIndex={isDrawer ? -1 : undefined}
    >
      {/* Шапка мобильного drawer (на десктопе скрыта) */}
      <div className="cat-filters__bar">
        <span id="catalog-filter-dialog-title" className="cat-filters__bar-title">
          Фильтры
        </span>
        <Button
          bare
          className="cat-filters__close"
          aria-label="Закрыть фильтры"
          onClick={onClose}
        >
          <CloseIcon width={16} height={16} />
        </Button>
      </div>

      {/* --- Выбранные категории --- */}
      <div className="cat-filters__block cat-filters__block--selected">
        <h2 className="cat-filters__title">Выбранные категории</h2>
        <div className="cat-selected__row">
          {hasSelection ? (
            <>
              {activeFacets.map((f) => {
                const labels = selected[f.key].map((value) =>
                  getOptionLabel(f.key, value),
                );
                const summary =
                  labels.length === 1
                    ? `${f.label}: ${labels[0]}`
                    : `${f.selectionLabel}: ${labels.length}`;
                const tooltipId = `catalog-selected-${f.key}-tooltip`;

                return (
                  <Button
                    key={f.key}
                    bare
                    className="tag tag--filter cat-selected__tag"
                    onClick={() => onClearFacet(f.key)}
                    aria-label={`Очистить фильтр «${f.label}»`}
                    aria-describedby={labels.length > 1 ? tooltipId : undefined}
                  >
                    <span className="cat-selected__tag-text">{summary}</span>
                    <span className="tag__close">
                      <CloseIcon />
                    </span>
                    {labels.length > 1 && (
                      <KitTooltip
                        id={tooltipId}
                        role="tooltip"
                        size="m"
                        className="cat-selected__tag-tooltip"
                      >
                        {labels.join(", ")}
                      </KitTooltip>
                    )}
                  </Button>
                );
              })}
              <Button
                size="s"
                variant="secondary-outlined"
                className="cat-selected__clear"
                onClick={onClearAll}
              >
                Очистить
              </Button>
            </>
          ) : (
            <span className="cat-selected__empty">Нет выбранных фильтров</span>
          )}
        </div>
      </div>

      <div className="cat-filters__divider" />

      {/* --- Фильтры --- */}
      <div className="cat-filters__block cat-filters__block--controls">
        <h2 className="cat-filters__title">Фильтры</h2>
        <div className="cat-filters__list">
          <RangeFilter
            label="Цена, ₽"
            min={priceMin}
            max={priceMax}
            step={100_000}
            value={price}
            onChange={onPriceChange}
          />

          <Accordion className="cat-acc" allowsMultipleExpanded>
            {visibleFacets.map((f) => (
              <Accordion.Item key={f.key} id={f.key} className="cat-acc__item">
                <Accordion.Heading className="cat-acc__heading">
                  <Accordion.Trigger
                    className="ui-button ui-button--bare ui-button--no-ripple cat-acc__trigger"
                  >
                    <span className="cat-acc__label">{f.label}</span>
                    <Accordion.Indicator className="cat-acc__chevron" />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel
                  className={`cat-acc__panel${
                    f.key === "color" ? " cat-acc__panel--colors" : ""
                  }`}
                >
                  {f.key === "color"
                    ? options[f.key].map((option) => {
                        const isSelected = selected[f.key].includes(
                          option.value,
                        );
                        return (
                          <Button
                            key={option.value}
                            bare
                            className="cat-color-option"
                            aria-label={`Цвет: ${option.label}`}
                            aria-pressed={isSelected}
                            aria-describedby={`catalog-color-${option.value}-tooltip`}
                            onClick={() =>
                              onToggleFacet(f.key, option.value)
                            }
                          >
                            <ColorSwatch
                              color={option.swatch ?? "transparent"}
                              colorName={option.label}
                              size="sm"
                              shape="square"
                            />
                            <KitTooltip
                              id={`catalog-color-${option.value}-tooltip`}
                              role="tooltip"
                              size="m"
                              className="cat-color-option__tooltip"
                            >
                              {option.label}
                            </KitTooltip>
                          </Button>
                        );
                      })
                    : options[f.key].map((option) => (
                        <KitCheckbox
                          key={option.value}
                          className="cat-check"
                          size="m"
                          label={option.label}
                          isSelected={selected[f.key].includes(option.value)}
                          onChange={() =>
                            onToggleFacet(f.key, option.value)
                          }
                        />
                      ))}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>

          <RangeFilter
            label="Мощность, л.с."
            min={powerMin}
            max={powerMax}
            step={10}
            value={power}
            onChange={onPowerChange}
          />
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
