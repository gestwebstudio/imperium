"use client";

import { useEffect, useRef, useState } from "react";
import type { Car } from "@/lib/cars";
import { carTags, formatPrice } from "@/lib/cars";
import { CarCard } from "@/components/cards/cards";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function CarsSection({
  title,
  badge,
  viewAll,
  cars,
  variant = "available",
}: {
  title: string;
  badge?: number;
  viewAll?: string;
  cars: Car[];
  variant?: "available" | "upcoming";
}) {
  const isUpcoming = variant === "upcoming";
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollAvailability, setScrollAvailability] = useState({
    previous: false,
    next: false,
  });

  useEffect(() => {
    const currentRow = rowRef.current;
    if (!currentRow) return;
    const rowElement: HTMLDivElement = currentRow;

    function syncScrollAvailability() {
      const rowRect = rowElement.getBoundingClientRect();
      const lastCard = rowElement.lastElementChild;
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
  }, [cars.length]);

  function scrollCards(direction: -1 | 1) {
    rowRef.current?.scrollBy({
      left: direction * rowRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <section
      className={cn(
        "home-wrap",
        "cars-section",
        `cars-section--${variant}`,
      )}
    >
      <div className="cars-section__head">
        <h2 className="cars-section__title">
          {title}
          {badge != null && <span className="badge badge--info">{badge}</span>}
        </h2>
        {viewAll && (
          <ButtonLink href="/catalog" size="l" variant="secondary-outlined">
            {viewAll}
          </ButtonLink>
        )}
      </div>
      <div className="cars-carousel">
        <Button
          size="l"
          variant="secondary-flat"
          iconOnly
          startIcon={<ArrowIcon />}
          className="cars-section__nav"
          aria-label="Предыдущие автомобили"
          disabled={!scrollAvailability.previous}
          onClick={() => scrollCards(-1)}
        />
        <div className="cars-row" ref={rowRef}>
          {cars.map((car) => (
            <CarCard
              key={car.id}
              href={
                isUpcoming
                  ? "/catalog/lexus-gx-executive"
                  : `/catalog/${car.slug}`
              }
              brandLogo={
                isUpcoming ? "/images/logo_cards/lexus.webp" : car.brandLogo
              }
              brandName={isUpcoming ? "Lexus" : car.brand}
              title={isUpcoming ? "GX Executive" : car.name}
              status={
                isUpcoming
                  ? { type: "warning", label: "Ожидаем поступления" }
                  : car.status
              }
              tags={
                isUpcoming
                  ? ["2026", "Бензин", "Полный привод"]
                  : carTags(car)
              }
              photo={isUpcoming ? "/images/cars/mask.webp" : car.photo}
              photoAlt={isUpcoming ? "Автомобиль ожидается" : car.name}
              price={isUpcoming ? "15 490 000 ₽" : formatPrice(car.price)}
              action={{
                label: "Подробнее",
                variant: isUpcoming
                  ? "secondary-outlined"
                  : "primary-surface",
              }}
            />
          ))}
        </div>
        <Button
          size="l"
          variant="secondary-flat"
          iconOnly
          startIcon={<ArrowIcon />}
          className="cars-section__nav cars-section__nav--next"
          aria-label="Следующие автомобили"
          disabled={!scrollAvailability.next}
          onClick={() => scrollCards(1)}
        />
      </div>
    </section>
  );
}
