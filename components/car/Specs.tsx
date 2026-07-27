"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import type { Spec } from "@/lib/cars";

export type SpecsProps = {
  primary: Spec[];
  extra: Spec[];
};

export function Specs({ primary, extra }: SpecsProps) {
  const [open, setOpen] = useState(false);
  const items = open ? [...primary, ...extra] : primary;

  return (
    <section className="car-specs">
      <h2 className="car-specs__title">Характеристики</h2>

      <div className="car-specs__list">
        {items.map((s) => (
          <div className="car-specs__row" key={s.label}>
            <span className="car-specs__label">{s.label}</span>
            <span className="car-specs__value">{s.value}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="car-specs__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Свернуть" : "Развернуть"}
        <ArrowIcon className="car-specs__chevron" width={8} height={8} />
      </button>
    </section>
  );
}

export default Specs;
