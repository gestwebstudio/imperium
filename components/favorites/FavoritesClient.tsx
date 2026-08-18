"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@heroui/react";
import type { Car } from "@/lib/cars";
import { carTags, formatPrice, getCarsByIds } from "@/lib/cars";
import { HeartStrokeIcon } from "@/components/icons";
import { Badge } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
import { CarCard } from "@/components/cards/cards";
import { CarCardSkeleton } from "@/components/ui/Skeletons";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";

export function FavoritesClient() {
  const { favoriteCount, favoriteIds, setFavorite, storageReady } =
    useVehicleActions();
  const [loadedCars, setLoadedCars] = useState<Car[]>([]);
  const [carsReady, setCarsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
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
    setLoadError(false);
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
        if (requestVersion === requestVersionRef.current) setLoadError(true);
      })
      .finally(() => {
        if (requestVersion === requestVersionRef.current) setCarsReady(true);
      });
  }, [favoriteIdsKey, loadAttempt, storageReady]);

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
        {storageReady && (
          <Badge size="m" responsive color="info">
            {favoriteCount}
          </Badge>
        )}
      </header>

      {isLoading ? (
        <section
          className="favorites-loading-grid"
          role="status"
          aria-busy="true"
          aria-label="Загружаем избранные автомобили"
        >
          <span className="favorites-loading-grid__sr">
            Загружаем избранные автомобили…
          </span>
          {Array.from({ length: 4 }, (_, index) => (
            <CarCardSkeleton key={index} />
          ))}
        </section>
      ) : loadError ? (
        <section className="favorites-error" role="alert">
          <p>Не удалось загрузить избранные автомобили.</p>
          <Button
            size="m"
            variant="secondary-outlined"
            className="favorites-error__retry"
            onClick={() => {
              setCarsReady(false);
              setLoadAttempt((current) => current + 1);
            }}
          >
            Повторить
          </Button>
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
