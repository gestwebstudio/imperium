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
  /** Текст тултипа в неактивном состоянии. */
  tip?: string;
  /** Текст тултипа после добавления в избранное. */
  activeTip?: string;
  className?: string;
  disabled?: boolean;
};

/** Кнопка «в избранное» — сердечко-тоггл (контур → залитое красное). */
export function Wishlist({
  vehicleId,
  active,
  defaultActive = false,
  onChange,
  tip,
  activeTip = "Убрать из избранного",
  className,
  disabled = false,
}: WishlistProps) {
  const [internal, setInternal] = useState(defaultActive);
  const vehicleActions = useVehicleActionsOptional();
  const globalActive =
    vehicleId && vehicleActions
      ? vehicleActions.isFavorite(vehicleId)
      : undefined;
  const storagePending =
    active === undefined &&
    Boolean(vehicleId && vehicleActions && !vehicleActions.storageReady);
  const isActive = active ?? globalActive ?? internal;
  const resolvedTip = isActive
    ? activeTip
    : (tip ?? "В избранное");
  const showTip = tip != null;

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
      className={cn(
        "wishlist",
        isActive && "is-active",
        storagePending && "is-storage-pending",
        className,
      )}
      aria-pressed={isActive}
      aria-label={resolvedTip}
      aria-busy={storagePending || undefined}
      disabled={storagePending || disabled}
      onClick={toggle}
    >
      <HeartStrokeIcon className="icon-stroke" />
      <HeartFillIcon className="icon-fill" />
      {showTip && <span className="wishlist__tip">{resolvedTip}</span>}
    </Button>
  );
}
