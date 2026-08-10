"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@heroui/react";
import type { Car } from "@/lib/cars";
import { carTags, formatPrice, getCarsByIds } from "@/lib/cars";
import { HeartStrokeIcon } from "@/components/icons";
import { Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
import { CarCard } from "@/components/cards/cards";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";

export function FavoritesClient() {
  const { favoriteCount, favoriteIds, setFavorite, storageReady } =
    useVehicleActions();
  const [loadedCars, setLoadedCars] = useState<Car[]>([]);
  const [carsReady, setCarsReady] = useState(false);
  const requestVersionRef = useRef(0);
  const favoriteIdsKey = favoriteIds.join(",");
  const loadedCarsById = useMemo(
    () => new Map(loadedCars.map((car) => [car.id, car])),
    [loadedCars],
  );
  const favoriteCars = [...favoriteIds].reverse().flatMap((id) => {
    const car = loadedCarsById.get(id);
    return car ? [car] : [];
  });
  const isLoading = !storageReady || !carsReady;

  useEffect(() => {
    if (!storageReady) return;

    const requestVersion = ++requestVersionRef.current;
    getCarsByIds(favoriteIds)
      .then((cars) => {
        if (requestVersion !== requestVersionRef.current) return;
        setLoadedCars((current) => {
          const merged = new Map(current.map((car) => [car.id, car]));
          cars.forEach((car) => merged.set(car.id, car));
          return [...merged.values()];
        });
      })
      .catch(() => {
        // The mock source is local; a future API failure must not leave a
        // permanent skeleton or an unhandled rejected promise.
      })
      .finally(() => {
        if (requestVersion === requestVersionRef.current) setCarsReady(true);
      });
  }, [favoriteIdsKey, storageReady]);

  function showRemovalUndo(car: Car, active: boolean) {
    if (active) return;

    const toastId = toast("Автомобиль удалён из избранного", {
      timeout: 6000,
      indicator: null,
      actionProps: {
        children: "Вернуть",
        onClick: () => {
          setFavorite(car.id, true);
          toast.close(toastId);
        },
      },
    });
  }

  return (
    <main className="favorites-page">
      <Crumbs
        className="favorites-crumbs"
        items={[{ label: "Главная", href: "/" }, { label: "Избранное" }]}
      />

      <header className="favorites-head">
        <h1 className="t-page-title">Избранное</h1>
        {storageReady && <Badge color="info">{favoriteCount}</Badge>}
      </header>

      {isLoading ? (
        <section
          className="favorites-loading-grid"
          role="status"
          aria-label="Загружаем избранные автомобили"
        >
          <span className="favorites-loading-grid__sr">
            Загружаем избранные автомобили…
          </span>
          {Array.from({ length: 4 }, (_, index) => (
            <article
              className="favorites-skeleton-card"
              aria-hidden="true"
              key={index}
            >
              <div className="favorites-skeleton-card__top">
                <span className="favorites-skeleton-card__brand" />
                <span className="favorites-skeleton-card__actions" />
              </div>
              <span className="favorites-skeleton-card__title" />
              <span className="favorites-skeleton-card__meta" />
              <span className="favorites-skeleton-card__photo" />
              <div className="favorites-skeleton-card__bottom">
                <span className="favorites-skeleton-card__price" />
                <span className="favorites-skeleton-card__button" />
              </div>
            </article>
          ))}
        </section>
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
              onFavoriteChange={(active) => showRemovalUndo(car, active)}
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
