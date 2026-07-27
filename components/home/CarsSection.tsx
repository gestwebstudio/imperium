import type { Car } from "@/lib/cars";
import { carTags, formatPrice } from "@/lib/cars";
import { CarCard } from "@/components/cards/cards";

export function CarsSection({
  title,
  badge,
  viewAll,
  cars,
}: {
  title: string;
  badge?: number;
  viewAll?: string;
  cars: Car[];
}) {
  return (
    <section className="home-wrap cars-section">
      <div className="cars-section__head">
        <h2 className="cars-section__title">
          {title}
          {badge != null && <span className="badge badge--info">{badge}</span>}
        </h2>
        {viewAll && (
          <a href="/catalog" className="btn btn--l btn--secondary-outlined">
            <span>{viewAll}</span>
          </a>
        )}
      </div>
      <div className="cars-row">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            brandLogo={car.brandLogo}
            brandName={car.brand}
            title={car.name}
            status={car.status}
            tags={carTags(car)}
            photo={car.photo}
            photoAlt={car.name}
            price={formatPrice(car.price)}
            action={{ label: "Подробнее", variant: "primary-surface" }}
          />
        ))}
      </div>
    </section>
  );
}
