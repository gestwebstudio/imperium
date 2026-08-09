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
 * текст форматируется маской. Ручной ввод применяется только при blur/Enter,
 * поэтому фильтр не пересчитывается на каждый символ. Слайдер обновляет
 * применённый диапазон сразу.
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
  };

  const handleFocus = (side: 0 | 1) => {
    setEditing(side);
    setEditText(displayFor(side));
  };
  const commitInput = (side: 0 | 1) => {
    const digits = editText.replace(/\D/g, "");
    const requested = digits
      ? parseInt(digits, 10)
      : side === 0
        ? min
        : max;

    const bounded = clamp(requested, min, max);
    const next: RangeValue =
      side === 0
        ? [Math.min(bounded, value[1]), value[1]]
        : [value[0], Math.max(bounded, value[0])];

    if (next[0] !== value[0] || next[1] !== value[1]) onChange(next);
    setEditing(null);
    setEditText("");
  };

  const handleSliderChange = (next: RangeValue) => {
    setEditing(null);
    setEditText("");
    onChange(next);
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
      onBlur={() => commitInput(side)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
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
        onChange={(v) => handleSliderChange(v as RangeValue)}
      >
        <Slider.Track>
          <Slider.Marks className="cat-slider__marks" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => (
              <span key={index} className="cat-slider__mark" />
            ))}
          </Slider.Marks>
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
