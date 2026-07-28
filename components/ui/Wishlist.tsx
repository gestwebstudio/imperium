"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { HeartStrokeIcon, HeartFillIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useVehicleActionsOptional } from "@/components/ui/VehicleActionsContext";

export type WishlistProps = {
  /** Стабильный ID автомобиля для синхронизации с глобальным избранным. */
  vehicleId?: string;
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
  vehicleId,
  active,
  defaultActive = false,
  onChange,
  tip,
  className,
}: WishlistProps) {
  const [internal, setInternal] = useState(defaultActive);
  const vehicleActions = useVehicleActionsOptional();
  const globalActive =
    vehicleId && vehicleActions
      ? vehicleActions.isFavorite(vehicleId)
      : undefined;
  const isActive = active ?? globalActive ?? internal;

  function toggle() {
    const next = !isActive;
    if (active === undefined) {
      if (vehicleId && vehicleActions) {
        vehicleActions.setFavorite(vehicleId, next);
      } else {
        setInternal(next);
      }
    }
    onChange?.(next);
  }

  return (
    <Button
      bare
      className={cn("wishlist", isActive && "is-active", className)}
      aria-pressed={isActive}
      aria-label={tip ?? "В избранное"}
      onClick={toggle}
    >
      <HeartStrokeIcon className="icon-stroke" />
      <HeartFillIcon className="icon-fill" />
      {tip && <span className="wishlist__tip">{tip}</span>}
    </Button>
  );
}
