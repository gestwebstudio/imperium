"use client";

import Link from "next/link";
import { HeartStrokeIcon, ListAddIcon } from "@/components/icons";
import { Bubble } from "@/components/ui/primitives";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";

function ActionCount({
  count,
  label,
  href,
  children,
}: {
  count: number;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const content = (
    <>
      {children}
      {count > 0 && (
        <Bubble
          size="s"
          color="green-500"
          className="floating-vehicle-actions__bubble"
        >
          {count}
        </Bubble>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="floating-vehicle-actions__item"
        aria-label={`${label}: ${count}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className="floating-vehicle-actions__item"
      aria-label={`${label}: ${count}`}
    >
      {content}
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
      <ActionCount
        count={favoriteCount}
        label="В избранном"
        href="/favorites"
      >
        <HeartStrokeIcon />
      </ActionCount>
      <ActionCount
        count={comparisonCount}
        label="В сравнении"
        href="/comparison"
      >
        <ListAddIcon />
      </ActionCount>
      <span className="floating-vehicle-actions__status" aria-live="polite">
        В избранном: {favoriteCount}. В сравнении: {comparisonCount}.
      </span>
    </aside>
  );
}
