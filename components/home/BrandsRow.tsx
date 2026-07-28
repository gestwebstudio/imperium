"use client";

import { useEffect, useRef, useState } from "react";
import { BrandCard } from "@/components/cards/cards";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

const brands = [
  {
    name: "Mercedes-Benz",
    src: "/images/logo_brands/mercedes.webp",
    className: "brand-card--mercedes",
  },
  {
    name: "BMW",
    src: "/images/logo_brands/bmw.webp",
    className: "brand-card--bmw",
  },
  {
    name: "Lexus",
    src: "/images/logo_brands/lexus.webp",
    className: "brand-card--lexus",
  },
  {
    name: "Ferrari",
    src: "/images/logo_brands/ferrari.webp",
    className: "brand-card--ferrari",
  },
  {
    name: "Rolls-Royce",
    src: "/images/logo_brands/rollsroyce.webp",
    className: "brand-card--rollsroyce",
  },
  {
    name: "Audi",
    src: "/images/logo_brands/audi.webp",
    className: "brand-card--audi",
  },
];

export function BrandsRow() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollAvailability, setScrollAvailability] = useState({
    previous: false,
    next: false,
  });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const rowElement: HTMLDivElement = row;

    function syncScrollAvailability() {
      const lastCard = rowElement.lastElementChild;
      const rowRect = rowElement.getBoundingClientRect();
      const nextAvailability = {
        previous: rowElement.scrollLeft > 2,
        next:
          lastCard != null &&
          lastCard.getBoundingClientRect().right > rowRect.right + 2,
      };

      setScrollAvailability((current) =>
        current.previous === nextAvailability.previous &&
        current.next === nextAvailability.next
          ? current
          : nextAvailability,
      );
    }

    syncScrollAvailability();
    rowElement.addEventListener("scroll", syncScrollAvailability, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(syncScrollAvailability);
    resizeObserver.observe(rowElement);
    Array.from(rowElement.children).forEach((card) =>
      resizeObserver.observe(card),
    );

    return () => {
      rowElement.removeEventListener("scroll", syncScrollAvailability);
      resizeObserver.disconnect();
    };
  }, []);

  function scrollBrands(direction: -1 | 1) {
    rowRef.current?.scrollBy({
      left: direction * rowRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <section className="home-wrap brands">
      <div className="brands-carousel">
        <Button
          size="l"
          variant="secondary-flat"
          iconOnly
          startIcon={<ArrowIcon />}
          className="brands-carousel__nav"
          aria-label="Предыдущие бренды"
          disabled={!scrollAvailability.previous}
          onClick={() => scrollBrands(-1)}
        />
        <div className="brands-row" ref={rowRef}>
          {brands.map(({ name, src, className }) => (
            <BrandCard
              key={name}
              src={src}
              alt={name}
              className={className}
            />
          ))}
        </div>
        <Button
          size="l"
          variant="secondary-flat"
          iconOnly
          startIcon={<ArrowIcon />}
          className="brands-carousel__nav brands-carousel__nav--next"
          aria-label="Следующие бренды"
          disabled={!scrollAvailability.next}
          onClick={() => scrollBrands(1)}
        />
      </div>
    </section>
  );
}
