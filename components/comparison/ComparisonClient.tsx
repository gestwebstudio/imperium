"use client";

import { Fragment, useState, type CSSProperties } from "react";
import { Breadcrumbs, Switch } from "@heroui/react";
import { ArrowIcon, ListAddIcon } from "@/components/icons";
import { CarCard } from "@/components/cards/cards";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/primitives";
import { useVehicleActions } from "@/components/ui/VehicleActionsContext";
import {
  type Car,
  type Spec,
  carTags,
  formatPrice,
  getCarSpecs,
} from "@/lib/cars";

type ComparisonRow = {
  label: string;
  values: string[];
};

type ComparisonGroup = {
  title: string;
  rows: ComparisonRow[];
};

function buildRows(
  specs: { primary: Spec[]; extra: Spec[] }[],
  section: "primary" | "extra",
): ComparisonRow[] {
  if (specs.length === 0) return [];

  return specs[0][section].map((spec, index) => ({
    label: spec.label,
    values: specs.map((carSpecs) => carSpecs[section][index].value),
  }));
}

export function ComparisonClient({ cars }: { cars: Car[] }) {
  const {
    comparisonIds,
    setCompared,
    storageReady,
  } = useVehicleActions();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const carsById = new Map(cars.map((car) => [car.id, car]));
  const comparedCars = comparisonIds.flatMap((id) => {
    const car = carsById.get(id);
    return car ? [car] : [];
  });
  const specs = comparedCars.map(getCarSpecs);
  const effectiveOnlyDifferences =
    onlyDifferences && comparedCars.length > 1;

  const groups: ComparisonGroup[] = [
    {
      title: "Основные характеристики",
      rows: [
        {
          label: "Стоимость",
          values: comparedCars.map((car) => formatPrice(car.price)),
        },
        ...buildRows(specs, "primary"),
      ],
    },
    {
      title: "Габариты и эксплуатация",
      rows: buildRows(specs, "extra"),
    },
  ].map((group) => ({
    ...group,
    rows: effectiveOnlyDifferences
      ? group.rows.filter((row) => new Set(row.values).size > 1)
      : group.rows,
  }));

  const tableStyle: CSSProperties = {
    gridTemplateColumns: `minmax(190px, 240px) repeat(${comparedCars.length}, minmax(300px, 1fr))`,
    minWidth: `${220 + comparedCars.length * 324}px`,
  };

  function clearComparison() {
    comparisonIds.forEach((id) => setCompared(id, false));
  }

  return (
    <main className="comparison-page">
      <Breadcrumbs
        className="comparison-crumbs"
        separator={<ArrowIcon width={12} height={12} />}
      >
        <Breadcrumbs.Item href="/" className="comparison-crumbs__item">
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item className="comparison-crumbs__item comparison-crumbs__item--current">
          Сравнение
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <header className="comparison-head">
        <div className="comparison-head__title">
          <h1>Сравнение автомобилей</h1>
          {storageReady && <Badge color="info">{comparedCars.length}</Badge>}
        </div>

        {storageReady && comparedCars.length > 0 && (
          <div className="comparison-head__tools">
            <Switch.Root
              className="comparison-switch"
              isSelected={effectiveOnlyDifferences}
              isDisabled={comparedCars.length < 2}
              onChange={setOnlyDifferences}
            >
              <Switch.Content className="comparison-switch__content">
                <Switch.Control className="comparison-switch__control">
                  <Switch.Thumb className="comparison-switch__thumb" />
                </Switch.Control>
                <span className="comparison-switch__label">
                  Только различия
                </span>
              </Switch.Content>
            </Switch.Root>
            <Button
              size="m"
              variant="secondary-outlined"
              onClick={clearComparison}
            >
              Очистить
            </Button>
          </div>
        )}
      </header>

      {!storageReady ? (
        <div
          className="comparison-loading"
          role="status"
          aria-label="Загружаем сравнение автомобилей"
        />
      ) : comparedCars.length === 0 ? (
        <section className="comparison-empty">
          <ListAddIcon className="comparison-empty__icon" />
          <div className="comparison-empty__text">
            <h2>В сравнении пока ничего нет</h2>
            <p>
              Добавьте несколько автомобилей, чтобы сопоставить их
              характеристики и выбрать подходящий.
            </p>
          </div>
          <ButtonLink href="/catalog" size="l" variant="primary-surface">
            Перейти в каталог
          </ButtonLink>
        </section>
      ) : (
        <>
          {comparedCars.length === 1 && (
            <aside className="comparison-hint">
              <span>
                Добавьте ещё один автомобиль, чтобы увидеть различия.
              </span>
              <ButtonLink
                href="/catalog"
                size="m"
                variant="secondary-outlined"
              >
                Добавить автомобиль
              </ButtonLink>
            </aside>
          )}

          <div
            className="comparison-scroll"
            tabIndex={0}
            aria-label="Таблица сравнения автомобилей"
          >
            <div className="comparison-table" style={tableStyle}>
              <div className="comparison-table__corner">
                Выбранные автомобили
              </div>
              {comparedCars.map((car) => (
                <div className="comparison-table__card" key={car.id}>
                  <CarCard
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
                    action={{
                      label: "Подробнее",
                      variant: "primary-surface",
                    }}
                  />
                </div>
              ))}

              {groups.map(
                (group) =>
                  group.rows.length > 0 && (
                    <Fragment key={group.title}>
                      <div className="comparison-table__group">
                        {group.title}
                      </div>
                      {group.rows.flatMap((row) => [
                        <div
                          className="comparison-table__label"
                          key={`${group.title}-${row.label}-label`}
                        >
                          {row.label}
                        </div>,
                        ...row.values.map((value, carIndex) => (
                          <div
                            className="comparison-table__value"
                            key={`${group.title}-${row.label}-${comparedCars[carIndex].id}`}
                          >
                            {row.label === "Цвет" && (
                              <span
                                className="comparison-table__swatch"
                                style={{
                                  backgroundColor:
                                    comparedCars[carIndex].color.swatch,
                                }}
                                aria-hidden="true"
                              />
                            )}
                            {value}
                          </div>
                        )),
                      ])}
                    </Fragment>
                  ),
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
