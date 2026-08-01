"use client";

import type { Car } from "@/lib/cars";
import { carTags, formatPrice } from "@/lib/cars";
import { CarCard } from "@/components/cards/cards";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import {
  INFINITE_CAROUSEL_COPIES,
  INFINITE_CAROUSEL_MIDDLE_COPY,
  useInfiniteCarousel,
} from "@/components/ui/useInfiniteCarousel";

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
  const { rowRef, scroll } = useInfiniteCarousel(cars.length);

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
          onClick={() => scroll(-1)}
        />
        <div className="cars-row" ref={rowRef}>
          {INFINITE_CAROUSEL_COPIES.map((copy) =>
            cars.map((car, index) => {
              const isMiddleCopy = copy === INFINITE_CAROUSEL_MIDDLE_COPY;
              return (
                <div
                  key={`${copy}-${car.id}`}
                  className="cars-carousel__item"
                  data-carousel-cycle-start={index === 0 ? "" : undefined}
                  aria-hidden={isMiddleCopy ? undefined : true}
                  inert={isMiddleCopy ? undefined : true}
                >
                  <CarCard
                    vehicleId={isUpcoming ? "lexus-gx-executive" : car.id}
                    href={
                      isUpcoming
                        ? "/catalog/lexus-gx-executive"
                        : `/catalog/${car.slug}`
                    }
                    brandLogo={
                      isUpcoming
                        ? "/images/logo_cards/lexus.webp"
                        : car.brandLogo
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
                    price={
                      isUpcoming ? "15 490 000 ₽" : formatPrice(car.price)
                    }
                    action={{
                      label: isUpcoming ? "Забронировать" : "Подробнее",
                      variant: isUpcoming
                        ? "secondary-outlined"
                        : "primary-surface",
                    }}
                    comparisonEnabled={!isUpcoming}
                  />
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
          className="cars-section__nav cars-section__nav--next"
          aria-label="Следующие автомобили"
          onClick={() => scroll(1)}
        />
      </div>
    </section>
  );
}
