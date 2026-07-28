"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { Spec } from "@/lib/cars";

export type SpecsProps = {
  primary: Spec[];
  extra: Spec[];
};

export function Specs({ primary, extra }: SpecsProps) {
  const [open, setOpen] = useState(false);
  const items = open ? [...primary, ...extra] : primary;
  const chunkSize = Math.ceil(items.length / 3);
  const columns = Array.from({ length: 3 }, (_, index) =>
    items.slice(index * chunkSize, (index + 1) * chunkSize),
  ).filter((column) => column.length > 0);

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
