"use client";

import { Breadcrumbs } from "@heroui/react";
import type { Car } from "@/lib/cars";
import { carTags, formatPrice } from "@/lib/cars";
import { ArrowIcon, HeartStrokeIcon } from "@/components/icons";
import { Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { CarCard } from "@/components/cards/cards";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";

export function FavoritesClient({ cars }: { cars: Car[] }) {
  const { favoriteIds, storageReady } = useVehicleActions();
  const carsById = new Map(cars.map((car) => [car.id, car]));
  const favoriteCars = favoriteIds.flatMap((id) => {
    const car = carsById.get(id);
    return car ? [car] : [];
  });

  return (
    <main className="favorites-page">
      <Breadcrumbs
        className="favorites-crumbs"
        separator={
          <ArrowIcon width={12} height={12} />
        }
      >
        <Breadcrumbs.Item href="/" className="favorites-crumbs__item">
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item className="favorites-crumbs__item favorites-crumbs__item--current">
          Избранное
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <header className="favorites-head">
        <h1>Избранное</h1>
        {storageReady && <Badge color="info">{favoriteCars.length}</Badge>}
      </header>

      {!storageReady ? (
        <div
          className="favorites-loading"
          role="status"
          aria-label="Загружаем избранные автомобили"
        />
      ) : favoriteCars.length > 0 ? (
        <div className="favorites-grid">
          {favoriteCars.map((car) => (
            <CarCard
              key={car.id}
              vehicleId={car.id}
              href={`/catalog/${car.slug}`}
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
      ) : (
        <section className="favorites-empty">
          <HeartStrokeIcon className="favorites-empty__icon" />
          <div className="favorites-empty__text">
            <h2>В избранном пока ничего нет</h2>
            <p>
              Добавляйте автомобили с помощью сердечка, чтобы быстро вернуться
              к ним позже.
            </p>
          </div>
          <ButtonLink href="/catalog" size="l" variant="primary-surface">
            Перейти в каталог
          </ButtonLink>
        </section>
      )}
    </main>
  );
}
