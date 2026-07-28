"use client";

import { HeartStrokeIcon, ListAddIcon } from "@/components/icons";
import { Bubble } from "@/components/ui/primitives";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";

function ActionCount({
  count,
  label,
  children,
}: {
  count: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="floating-vehicle-actions__item"
      aria-label={`${label}: ${count}`}
    >
      {children}
      {count > 0 && (
        <Bubble
          size="xl"
          color="green-500"
          className="floating-vehicle-actions__bubble"
        >
          {count}
        </Bubble>
      )}
    </div>
  );
}

export function FloatingVehicleActions() {
  const { favoriteCount, comparisonCount } = useVehicleActions();

  return (
    <aside
      className="floating-vehicle-actions"
      aria-label="Сохранённые автомобили"
    >
      <ActionCount count={favoriteCount} label="В избранном">
        <HeartStrokeIcon />
      </ActionCount>
      <ActionCount count={comparisonCount} label="В сравнении">
        <ListAddIcon />
      </ActionCount>
      <span className="floating-vehicle-actions__status" aria-live="polite">
        В избранном: {favoriteCount}. В сравнении: {comparisonCount}.
      </span>
    </aside>
  );
}
