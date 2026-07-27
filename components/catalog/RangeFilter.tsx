"use client";

import { useState } from "react";
import { Slider } from "@heroui/react";

/** Группировка разрядов пробелами: 4500000 → «4 500 000». */
const groupDigits = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Маска для сырого ввода: оставить цифры и сгруппировать. */
const maskRaw = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  return digits ? groupDigits(parseInt(digits, 10)) : "";
};

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(n, lo), hi);

export type RangeValue = [number, number];

export type RangeFilterProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  /** Префиксы в подсказке полей. */
  fromPrefix?: string;
  toPrefix?: string;
};

/**
 * Составной фильтр «диапазон»: два поля с маской сверху и HeroUI-слайдер снизу.
 * Поля работают как подсказка (placeholder) — по умолчанию пустые; при вводе
 * текст форматируется маской. Двусторонняя связь: правка поля двигает ползунок,
 * перетаскивание ползунка заполняет поле.
 */
export function RangeFilter({
  label,
  min,
  max,
  step,
  value,
  onChange,
  fromPrefix = "от",
  toPrefix = "до",
}: RangeFilterProps) {
  // какое поле сейчас редактируется и его «сырой» текст (чтобы ввод не перебивался)
  const [editing, setEditing] = useState<0 | 1 | null>(null);
  const [editText, setEditText] = useState("");

  const placeholders: [string, string] = [
    `${fromPrefix} ${groupDigits(min)}`,
    `${toPrefix} ${groupDigits(max)}`,
  ];

  // что показывать в поле: при фокусе — сырой текст; иначе значение (или пусто на краю → подсказка)
  const displayFor = (side: 0 | 1) => {
    if (editing === side) return editText;
    const bound = value[side];
    const isExtreme = side === 0 ? bound <= min : bound >= max;
    return isExtreme ? "" : groupDigits(bound);
  };

  const handleInput = (side: 0 | 1, raw: string) => {
    setEditing(side);
    setEditText(maskRaw(raw));
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      // очистили поле → сбрасываем этот край к границе диапазона
      onChange(side === 0 ? [min, value[1]] : [value[0], max]);
      return;
    }
    const n = parseInt(digits, 10);
    onChange(
      side === 0
        ? [clamp(n, min, value[1]), value[1]]
        : [value[0], clamp(n, value[0], max)],
    );
  };

  const handleFocus = (side: 0 | 1) => {
    setEditing(side);
    setEditText(displayFor(side));
  };
  const handleBlur = () => {
    setEditing(null);
    setEditText("");
  };

  const renderInput = (side: 0 | 1) => (
    <input
      className="cat-range__input"
      type="text"
      inputMode="numeric"
      aria-label={`${label}: ${side === 0 ? fromPrefix : toPrefix}`}
      placeholder={placeholders[side]}
      value={displayFor(side)}
      onChange={(e) => handleInput(side, e.target.value)}
      onFocus={() => handleFocus(side)}
      onBlur={handleBlur}
    />
  );

  return (
    <div className="cat-range">
      <span className="cat-range__label">{label}</span>

      <div className="cat-range__row">
        {renderInput(0)}
        {renderInput(1)}
      </div>

      <Slider
        className="cat-slider"
        aria-label={label}
        minValue={min}
        maxValue={max}
        step={step}
        value={value}
        onChange={(v) => onChange(v as RangeValue)}
      >
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb
            index={0}
            aria-label={fromPrefix}
          />
          <Slider.Thumb
            index={1}
            aria-label={toPrefix}
          />
        </Slider.Track>
      </Slider>
    </div>
  );
}

export default RangeFilter;
