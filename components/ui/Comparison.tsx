"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ListAddIcon, ListCheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export type ComparisonProps = {
  active?: boolean;
  defaultActive?: boolean;
  onChange?: (active: boolean) => void;
  tip?: string;
  className?: string;
};

/** Кнопка «в сравнение» — тоггл (List-Add → зелёный List-Check). */
export function Comparison({
  active,
  defaultActive = false,
  onChange,
  tip,
  className,
}: ComparisonProps) {
  const [internal, setInternal] = useState(defaultActive);
  const isActive = active ?? internal;

  function toggle() {
    const next = !isActive;
    if (active === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <Button
      bare
      className={cn("compare", isActive && "is-active", className)}
      aria-pressed={isActive}
      aria-label={tip ?? "В сравнение"}
      onClick={toggle}
    >
      <ListAddIcon className="icon-add" />
      <ListCheckIcon className="icon-check" />
      {tip && <span className="compare__tip">{tip}</span>}
    </Button>
  );
}
