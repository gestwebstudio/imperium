"use client";

import type { Key } from "react";
import { Dropdown } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";

/** react-aria Selection без прямой зависимости на пакет. */
type Selection = "all" | Set<Key>;

export type SortKey = "popular" | "price-asc" | "price-desc";

/** Пункты сортировки (порядок и тексты — по ТЗ). */
const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price-asc", label: "По возрастанию цены" },
  { key: "price-desc", label: "По убыванию цены" },
  { key: "popular", label: "Популярные" },
];

const labelOf = (key: SortKey) =>
  OPTIONS.find((o) => o.key === key)?.label ?? "";

export type SortDropdownProps = {
  value: SortKey;
  onChange: (value: SortKey) => void;
};

/**
 * Блок сортировки: собственный дизайн триггера («Сортировать по: …»), а сама
 * всплывашка — HeroUI Dropdown, стилизованная под кит (см. catalog.css).
 */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const handleSelection = (keys: Selection) => {
    if (keys === "all") return;
    const next = [...keys][0] as SortKey | undefined;
    if (next) onChange(next);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger className="cat-sort">
        <span className="cat-sort__label">Сортировать по:</span>
        <span className="cat-sort__value">
          {labelOf(value)}
          <ArrowIcon className="cat-sort__arrow" width={8} height={8} />
        </span>
      </Dropdown.Trigger>
      <Dropdown.Popover className="cat-sort-pop" placement="bottom end">
        <Dropdown.Menu
          aria-label="Сортировка"
          selectionMode="single"
          selectedKeys={new Set([value])}
          onSelectionChange={handleSelection}
        >
          {OPTIONS.map((o) => (
            <Dropdown.Item key={o.key} id={o.key} className="cat-sort-pop__item">
              {o.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default SortDropdown;
