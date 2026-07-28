"use client";

import { Accordion, Checkbox, ColorSwatch } from "@heroui/react";
import { CloseIcon } from "@/components/icons";
import {
  Button,
  ButtonRippleLayer,
  handleButtonRipplePointerDown,
} from "@/components/ui/Button";
import { Tooltip as KitTooltip } from "@/components/ui/primitives";
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

  /** Открыт ли сайдбар как drawer (мобилка ≤1200). */
  open?: boolean;
  /** Закрыть мобильный drawer. */
  onClose?: () => void;
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
  onClose,
}: FilterSidebarProps) {
  const activeFacets = FACETS.filter((f) => selected[f.key].length > 0);
  const hasSelection = activeFacets.length > 0;
  const getOptionLabel = (key: FacetKey, value: string) =>
    options[key].find((option) => option.value === value)?.label ?? value;

  return (
    <aside className={`cat-filters${open ? " is-open" : ""}`}>
      {/* Шапка мобильного drawer (на десктопе скрыта) */}
      <div className="cat-filters__bar">
        <span className="cat-filters__bar-title">Фильтры</span>
        <button
          type="button"
          className="cat-filters__close"
          aria-label="Закрыть фильтры"
          onClick={onClose}
        >
          <CloseIcon width={16} height={16} />
        </button>
      </div>

      {/* --- Выбранные категории --- */}
      <div className="cat-filters__block">
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

                return (
                  <Button
                    key={f.key}
                    bare
                    className="tag tag--filter cat-selected__tag"
                    onClick={() => onClearFacet(f.key)}
                    aria-label={`Очистить фильтр «${f.label}»`}
                  >
                    <span className="cat-selected__tag-text">{summary}</span>
                    <span className="tag__close">
                      <CloseIcon />
                    </span>
                    {labels.length > 1 && (
                      <KitTooltip
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
      <div className="cat-filters__block">
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
            {FACETS.map((f) => (
              <Accordion.Item key={f.key} id={f.key} className="cat-acc__item">
                <Accordion.Heading className="cat-acc__heading">
                  <Accordion.Trigger
                    className="ui-button ui-button--bare cat-acc__trigger"
                    onPointerDown={handleButtonRipplePointerDown}
                  >
                    <ButtonRippleLayer />
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
                              size="m"
                              className="cat-color-option__tooltip"
                            >
                              {option.label}
                            </KitTooltip>
                          </Button>
                        );
                      })
                    : options[f.key].map((option) => (
                        <Checkbox.Root
                          key={option.value}
                          className="cat-check"
                          isSelected={selected[f.key].includes(option.value)}
                          onChange={() =>
                            onToggleFacet(f.key, option.value)
                          }
                        >
                          <Checkbox.Content className="cat-check__content">
                            <Checkbox.Control className="cat-check__box">
                              <Checkbox.Indicator className="cat-check__mark" />
                            </Checkbox.Control>
                            <span className="cat-check__label">
                              {option.label}
                            </span>
                          </Checkbox.Content>
                        </Checkbox.Root>
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
