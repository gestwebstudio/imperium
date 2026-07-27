"use client";

import { Slider } from "@heroui/react";

/** Группировка разрядов пробелами: 4500000 → «4 500 000». */
const groupDigits = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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
  /** Префиксы в полях ввода. */
  fromPrefix?: string;
  toPrefix?: string;
};

/**
 * Составной фильтр «диапазон»: два кастомных поля с маской сверху и HeroUI-слайдер
 * (двухползунковый) снизу. Двусторонняя связь: правка поля двигает ползунок и наоборот.
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
  const [lo, hi] = value;

  const parseDigits = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return digits ? parseInt(digits, 10) : min;
  };

  const handleFrom = (raw: string) => {
    onChange([clamp(parseDigits(raw), min, hi), hi]);
  };
  const handleTo = (raw: string) => {
    onChange([lo, clamp(parseDigits(raw), lo, max)]);
  };

  return (
    <div className="cat-range">
      <span className="cat-range__label">{label}</span>

      <div className="cat-range__row">
        <input
          className="cat-range__input"
          type="text"
          inputMode="numeric"
          aria-label={`${label}: ${fromPrefix}`}
          value={`${fromPrefix} ${groupDigits(lo)}`}
          onChange={(e) => handleFrom(e.target.value)}
        />
        <input
          className="cat-range__input"
          type="text"
          inputMode="numeric"
          aria-label={`${label}: ${toPrefix}`}
          value={`${toPrefix} ${groupDigits(hi)}`}
          onChange={(e) => handleTo(e.target.value)}
        />
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
        <Slider.Track className="cat-slider__track">
          <Slider.Fill className="cat-slider__fill" />
          <Slider.Thumb index={0} className="cat-slider__thumb" aria-label={fromPrefix} />
          <Slider.Thumb index={1} className="cat-slider__thumb" aria-label={toPrefix} />
        </Slider.Track>
      </Slider>
    </div>
  );
}

export default RangeFilter;
