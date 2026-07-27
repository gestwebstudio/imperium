"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { HeartStrokeIcon, HeartFillIcon } from "@/components/icons";

export type WishlistProps = {
  /** Управляемый режим. */
  active?: boolean;
  /** Начальное значение в неуправляемом режиме. */
  defaultActive?: boolean;
  onChange?: (active: boolean) => void;
  /** Текст тултипа на наведении. */
  tip?: string;
  className?: string;
};

/** Кнопка «в избранное» — сердечко-тоггл (контур → залитое красное). */
export function Wishlist({
  active,
  defaultActive = false,
  onChange,
  tip,
  className,
}: WishlistProps) {
  const [internal, setInternal] = useState(defaultActive);
  const isActive = active ?? internal;

  function toggle() {
    const next = !isActive;
    if (active === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <button
      type="button"
      className={cn("wishlist", isActive && "is-active", className)}
      aria-pressed={isActive}
      aria-label={tip ?? "В избранное"}
      onClick={toggle}
    >
      <HeartStrokeIcon className="icon-stroke" />
      <HeartFillIcon className="icon-fill" />
      {tip && <span className="wishlist__tip">{tip}</span>}
    </button>
  );
}
