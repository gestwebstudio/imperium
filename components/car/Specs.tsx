"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { Spec } from "@/lib/cars";

export type SpecsProps = {
  primary: Spec[];
  extra: Spec[];
};

function distributeIntoColumns(items: Spec[], columnCount: number) {
  const baseSize = Math.floor(items.length / columnCount);
  const remainder = items.length % columnCount;
  let offset = 0;

  return Array.from({ length: columnCount }, (_, index) => {
    const size = baseSize + (index < remainder ? 1 : 0);
    const column = items.slice(offset, offset + size);
    offset += size;
    return column;
  });
}

export function Specs({ primary, extra }: SpecsProps) {
  const [open, setOpen] = useState(false);
  const primaryColumns = distributeIntoColumns(primary, 3);
  const extraColumns = distributeIntoColumns(extra, 3);
  const columns = primaryColumns
    .map((column, index) =>
      open ? [...column, ...extraColumns[index]] : column,
    )
    .filter((column) => column.length > 0);

  return (
    <section className={`car-specs${open ? " is-open" : ""}`}>
      <h2 className="car-specs__title">Характеристики</h2>

      <div className="car-specs__list">
        {columns.map((column, index) => (
          <div className="car-specs__column" key={index}>
            {column.map((spec) => (
              <div className="car-specs__row" key={spec.label}>
                <span className="car-specs__label">{spec.label}</span>
                <span className="car-specs__value">{spec.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Button
        bare
        className="car-specs__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Свернуть" : "Развернуть"}
        <ArrowIcon className="car-specs__chevron" width={8} height={8} />
      </Button>
    </section>
  );
}

export default Specs;
