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
  const cards = (
    <div className="cars-row">
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
  );

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
      {isUpcoming ? (
        <div className="cars-carousel">
          <Button
            size="l"
            variant="secondary-flat"
            iconOnly
            startIcon={<ArrowIcon />}
            className="cars-section__nav"
            aria-label="Предыдущие автомобили"
          />
          {cards}
          <Button
            size="l"
            variant="secondary-flat"
            iconOnly
            startIcon={<ArrowIcon />}
            className="cars-section__nav cars-section__nav--next"
            aria-label="Следующие автомобили"
          />
        </div>
      ) : (
        cards
      )}
    </section>
  );
}
