"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ListAddIcon, ListCheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useVehicleActionsOptional } from "@/components/ui/VehicleActionsContext";

export type ComparisonProps = {
  vehicleId?: string;
  active?: boolean;
  defaultActive?: boolean;
  onChange?: (active: boolean) => void;
  /** Текст тултипа в неактивном состоянии. */
  tip?: string;
  /** Текст тултипа после добавления в сравнение. */
  activeTip?: string;
  className?: string;
};

/** Кнопка «в сравнение» — тоггл (List-Add → зелёный List-Check). */
export function Comparison({
  vehicleId,
  active,
  defaultActive = false,
  onChange,
  tip,
  activeTip = "Убрать из сравнения",
  className,
}: ComparisonProps) {
  const [internal, setInternal] = useState(defaultActive);
  const vehicleActions = useVehicleActionsOptional();
  const globalActive =
    vehicleId && vehicleActions
      ? vehicleActions.isCompared(vehicleId)
      : undefined;
  const isActive = active ?? globalActive ?? internal;
  const resolvedTip = isActive
    ? activeTip
    : (tip ?? "В сравнение");
  const showTip = tip != null;

  function toggle() {
    const next = !isActive;
    if (active === undefined) {
      if (vehicleId && vehicleActions) {
        vehicleActions.setCompared(vehicleId, next);
      } else {
        setInternal(next);
      }
    }
    onChange?.(next);
  }

  return (
    <Button
      bare
      className={cn("compare", isActive && "is-active", className)}
      aria-pressed={isActive}
      aria-label={resolvedTip}
      onClick={toggle}
    >
      <ListAddIcon className="icon-add" />
      <ListCheckIcon className="icon-check" />
      {showTip && <span className="compare__tip">{resolvedTip}</span>}
    </Button>
  );
}
