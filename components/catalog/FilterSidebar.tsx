"use client";

import { Accordion, Checkbox } from "@heroui/react";
import { CloseIcon } from "@/components/icons";
import { FACETS, type FacetKey } from "@/lib/cars";
import { RangeFilter, type RangeValue } from "./RangeFilter";

export type FilterSidebarProps = {
  options: Record<FacetKey, string[]>;
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
}: FilterSidebarProps) {
  const activeFacets = FACETS.filter((f) => selected[f.key].length > 0);
  const hasSelection = activeFacets.length > 0;

  return (
    <aside className="cat-filters">
      {/* --- Выбранные категории --- */}
      <div className="cat-filters__block">
        <h2 className="cat-filters__title">Выбранные категории</h2>
        <div className="cat-selected__row">
          {hasSelection ? (
            <>
              {activeFacets.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className="tag tag--filter"
                  onClick={() => onClearFacet(f.key)}
                  aria-label={`Убрать фильтр «${f.label}»`}
                >
                  {selected[f.key].join(", ")}
                  <span className="tag__close">
                    <CloseIcon />
                  </span>
                </button>
              ))}
              <button
                type="button"
                className="btn btn--s btn--secondary-outlined cat-selected__clear"
                onClick={onClearAll}
              >
                Очистить
              </button>
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
                  <Accordion.Trigger className="cat-acc__trigger">
                    <span className="cat-acc__label">{f.label}</span>
                    <Accordion.Indicator className="cat-acc__chevron" />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel className="cat-acc__panel">
                  {options[f.key].map((v) => (
                    <Checkbox.Root
                      key={v}
                      className="cat-check"
                      isSelected={selected[f.key].includes(v)}
                      onChange={() => onToggleFacet(f.key, v)}
                    >
                      <Checkbox.Content className="cat-check__content">
                        <Checkbox.Control className="cat-check__box">
                          <Checkbox.Indicator className="cat-check__mark" />
                        </Checkbox.Control>
                        <span className="cat-check__label">{v}</span>
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
