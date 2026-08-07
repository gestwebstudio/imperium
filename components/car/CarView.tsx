"use client";

import { Wishlist } from "@/components/ui/Wishlist";
import { Comparison } from "@/components/ui/Comparison";
import { Crumbs } from "@/components/ui/Crumbs";
import { Badge, PriceBlock } from "@/components/ui/primitives";
import { type Car, formatPrice, getCarSpecs, getCars } from "@/lib/cars";
import { CarsSection } from "@/components/home/CarsSection";
import { Contacts } from "@/components/home/Contacts";
import { Gallery } from "./Gallery";
import type { GalleryPhoto } from "./GalleryModal";
import { Specs } from "./Specs";
import { Equipment } from "./Equipment";
import { Assurance } from "./Assurance";
import { Atelier } from "./Atelier";
import { CarActionModals } from "./CarActionModals";

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "exterior-side-1",
    src: "/images/gallery/1.webp",
    category: "exterior",
  },
  {
    id: "exterior-front-1",
    src: "/images/gallery/2.webp",
    category: "exterior",
  },
  {
    id: "exterior-side-2",
    src: "/images/gallery/1.webp",
    category: "exterior",
  },
  {
    id: "exterior-front-2",
    src: "/images/gallery/2.webp",
    category: "exterior",
  },
  {
    id: "interior-1",
    src: "/images/gallery/1.webp",
    category: "interior",
  },
  {
    id: "interior-2",
    src: "/images/gallery/2.webp",
    category: "interior",
  },
  {
    id: "multimedia-1",
    src: "/images/gallery/1.webp",
    category: "multimedia",
  },
  {
    id: "multimedia-2",
    src: "/images/gallery/2.webp",
    category: "multimedia",
  },
  // Доп. фото (моки), чтобы был виден горизонтальный скролл миниатюр
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `exterior-extra-${i + 1}`,
    src: `/images/gallery/${(i % 2) + 1}.webp`,
    category: "exterior" as const,
  })),
];

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
        <Crumbs
          className="cat-crumbs"
          compactOnMobile
          items={[{ label: "Главная", href: "/" }, { label: title }]}
        />
      </div>

      <Gallery photos={GALLERY_PHOTOS} alt={title} />

      <div className="car-wrap">
        <div className="car-main">
          <header className="car-title">
            <div className="car-title__head">
              <h1 className="car-title__name">{title}</h1>
              <Badge
                size="m"
                responsive
                color="success"
                className="car-title__badge"
              >
                {car.status.label}
              </Badge>
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
              <PriceBlock
                size="l"
                className="car-price__value"
                value={formatPrice(car.price)}
              />
              <div className="car-price__buttons">
                <CarActionModals
                  carTitle={title}
                  price={formatPrice(car.price)}
                />
              </div>
            </div>

            <div className="car-price__offers">
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
            </div>
          </aside>
        </div>
      </div>

      <CarsSection
        title="Рекомендованные автомобили"
        viewAll="Все автомобили"
        cars={recommended}
      />

      <Contacts />
    </main>
  );
}

export default CarView;
