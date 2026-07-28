"use client";

import { Breadcrumbs } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";
import { Wishlist } from "@/components/ui/Wishlist";
import { Comparison } from "@/components/ui/Comparison";
import { type Car, formatPrice, getCarSpecs, getCars } from "@/lib/cars";
import { CarsSection } from "@/components/home/CarsSection";
import { Contacts } from "@/components/home/Contacts";
import { Gallery } from "./Gallery";
import { Specs } from "./Specs";
import { Equipment } from "./Equipment";
import { Assurance } from "./Assurance";
import { Atelier } from "./Atelier";
import { CarActionModals } from "./CarActionModals";

const GALLERY_PHOTOS = ["/images/gallery/1.webp", "/images/gallery/2.webp"];

export type CarViewProps = {
  car: Car;
};

export function CarView({ car }: CarViewProps) {
  const { primary, extra } = getCarSpecs(car);
  const title = `${car.brand} ${car.name}`;
  const recommended = getCars()
    .filter((c) => c.slug !== car.slug)
    .slice(0, 8);

  return (
    <main className="car">
      <div className="car-wrap car-wrap--top">
        <Breadcrumbs
          className="cat-crumbs"
          separator={
            <ArrowIcon className="cat-crumbs__sep" width={12} height={12} />
          }
        >
          <Breadcrumbs.Item href="/" className="cat-crumbs__item">
            Главная
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="/catalog" className="cat-crumbs__item">
            Каталог
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

      <Gallery photos={GALLERY_PHOTOS} alt={title} />

      <div className="car-wrap">
        <div className="car-main">
          <header className="car-title">
            <div className="car-title__head">
              <h1 className="car-title__name">{title}</h1>
              <span className="car-title__badge">{car.status.label}</span>
            </div>
            <div className="car-title__actions">
              <Wishlist vehicleId={car.id} tip="В избранное" />
              <Comparison vehicleId={car.id} tip="В сравнение" />
            </div>
          </header>

          <div className="car-details">
            <div className="car-details__technical">
              <Specs primary={primary} extra={extra} />
              <Equipment />
            </div>

            <Assurance />

            <Atelier />
          </div>

          <aside className="car-price">
            <div className="car-price__section">
              <div className="car-price__value">
                <span className="car-price__label">Стоимость автомобиля</span>
                <span className="car-price__amount">{formatPrice(car.price)}</span>
              </div>
              <div className="car-price__buttons">
                <CarActionModals
                  carTitle={title}
                  price={formatPrice(car.price)}
                />
              </div>
            </div>

            {[
              { title: "Трейд-ин", note: "Ваше авто в зачёт" },
              { title: "Лизинг", note: "Ставка от 5%" },
              { title: "Кредит", note: "Ставка от 9%" },
            ].map((row) => (
              <div className="car-price__row" key={row.title}>
                <div className="car-price__row-head">
                  <span className="car-price__dot" />
                  {row.title}
                </div>
                <p className="car-price__note">{row.note}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>

      <CarsSection title="Рекомендованные автомобили" cars={recommended} />

      <Contacts />
    </main>
  );
}

export default CarView;
