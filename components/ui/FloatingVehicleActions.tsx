"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartStrokeIcon, ListAddIcon } from "@/components/icons";
import { Bubble } from "@/components/ui/primitives";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";

function ActionCount({
  count,
  label,
  href,
  current = false,
  children,
}: {
  count: number;
  label: string;
  href?: string;
  current?: boolean;
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

  if (href && !current) {
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
      className={`floating-vehicle-actions__item${current ? " is-current" : ""}`}
      aria-label={`${label}: ${count}`}
      aria-current={current ? "page" : undefined}
    >
      {content}
    </div>
  );
}

export function FloatingVehicleActions() {
  const pathname = usePathname();
  const { favoriteCount, comparisonCount, storageReady } = useVehicleActions();
  const isFavoritesPage = pathname === "/favorites";
  const isComparisonPage = pathname === "/comparison";

  return (
    <aside
      className={`floating-vehicle-actions${storageReady ? "" : " is-storage-pending"}`}
      aria-label="Сохранённые автомобили"
      aria-busy={!storageReady}
    >
      <ActionCount
        count={favoriteCount}
        label="В избранном"
        href="/favorites"
        current={isFavoritesPage}
      >
        <HeartStrokeIcon />
      </ActionCount>
      <ActionCount
        count={comparisonCount}
        label="В сравнении"
        href="/comparison"
        current={isComparisonPage}
      >
        <ListAddIcon />
      </ActionCount>
      <span className="floating-vehicle-actions__status" aria-live="polite">
        В избранном: {favoriteCount}. В сравнении: {comparisonCount}.
      </span>
    </aside>
  );
}
