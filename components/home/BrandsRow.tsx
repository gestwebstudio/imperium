"use client";

import { BrandCard } from "@/components/cards/cards";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import {
  INFINITE_CAROUSEL_COPIES,
  INFINITE_CAROUSEL_MIDDLE_COPY,
  useInfiniteCarousel,
} from "@/components/ui/useInfiniteCarousel";

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
  const { rowRef, scroll } = useInfiniteCarousel(brands.length);

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
          onClick={() => scroll(-1)}
        />
        <div className="brands-row" ref={rowRef}>
          {INFINITE_CAROUSEL_COPIES.map((copy) =>
            brands.map(({ name, src, className }, index) => {
              const isMiddleCopy = copy === INFINITE_CAROUSEL_MIDDLE_COPY;
              return (
                <div
                  key={`${copy}-${name}`}
                  className="brands-carousel__item"
                  data-carousel-cycle-start={index === 0 ? "" : undefined}
                  aria-hidden={isMiddleCopy ? undefined : true}
                  inert={isMiddleCopy ? undefined : true}
                >
                  <BrandCard src={src} alt={name} className={className} />
                </div>
              );
            }),
          )}
        </div>
        <Button
          size="l"
          variant="secondary-flat"
          iconOnly
          startIcon={<ArrowIcon />}
          className="brands-carousel__nav brands-carousel__nav--next"
          aria-label="Следующие бренды"
          onClick={() => scroll(1)}
        />
      </div>
    </section>
  );
}
