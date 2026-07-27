import type { Metadata } from "next";
import "./catalog.css";
import { getCars, carTags, formatPrice } from "@/lib/cars";
import { CarCard } from "@/components";

export const metadata: Metadata = {
  title: "Каталог — Imperium Motors",
  description: "Каталог автомобилей в наличии.",
};

export default function CatalogPage() {
  const cars = getCars();
  return (
    <main className="catalog-wrap">
      <header className="catalog-head">
        <h1>Каталог</h1>
        <p>{cars.length} автомобилей в наличии</p>
      </header>

      <div className="catalog-grid">
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
    </main>
  );
}
