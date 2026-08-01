"use client";

import { useState, type CSSProperties } from "react";
import { Switch, Table } from "@heroui/react";
import { ListAddIcon } from "@/components/icons";
import { CarCard } from "@/components/cards/cards";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
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

  const comparisonStyle = {
    "--comparison-columns": comparedCars.length,
    minWidth: `${220 + comparedCars.length * 324}px`,
  } as CSSProperties;

  function clearComparison() {
    comparisonIds.forEach((id) => setCompared(id, false));
  }

  return (
    <main className="comparison-page">
      <Crumbs
        className="comparison-crumbs"
        items={[{ label: "Главная", href: "/" }, { label: "Сравнение" }]}
      />

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
            <div className="comparison-data" style={comparisonStyle}>
              <div className="comparison-products">
                <div className="comparison-products__corner">
                  Выбранные автомобили
                </div>
                {comparedCars.map((car) => (
                  <div className="comparison-products__card" key={car.id}>
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
              </div>

              <div className="comparison-table-stack">
                {groups.map(
                  (group) =>
                    group.rows.length > 0 && (
                      <section
                        className="comparison-table-section"
                        key={group.title}
                      >
                        <h2 className="comparison-table-section__title">
                          {group.title}
                        </h2>

                        <Table.Root
                          className="comparison-spec-table"
                          variant="primary"
                        >
                          <Table.Content
                            className="comparison-spec-table__content"
                            aria-label={group.title}
                          >
                            <Table.Header className="comparison-spec-table__header">
                              <Table.Column
                                className="comparison-spec-table__column comparison-spec-table__column--label"
                                isRowHeader
                              >
                                Характеристика
                              </Table.Column>
                              {comparedCars.map((car) => (
                                <Table.Column
                                  className="comparison-spec-table__column"
                                  key={car.id}
                                >
                                  {car.name}
                                </Table.Column>
                              ))}
                            </Table.Header>

                            <Table.Body className="comparison-spec-table__body">
                              {group.rows.map((row) => (
                                <Table.Row
                                  className="comparison-spec-table__row"
                                  id={`${group.title}-${row.label}`}
                                  key={row.label}
                                >
                                  <Table.Cell className="comparison-spec-table__cell comparison-spec-table__cell--label">
                                    {row.label}
                                  </Table.Cell>
                                  {row.values.map((value, carIndex) => (
                                    <Table.Cell
                                      className="comparison-spec-table__cell comparison-spec-table__cell--value"
                                      key={comparedCars[carIndex].id}
                                    >
                                      {row.label === "Цвет" && (
                                        <span
                                          className="comparison-spec-table__swatch"
                                          style={{
                                            backgroundColor:
                                              comparedCars[carIndex].color
                                                .swatch,
                                          }}
                                          aria-hidden="true"
                                        />
                                      )}
                                      {value}
                                    </Table.Cell>
                                  ))}
                                </Table.Row>
                              ))}
                            </Table.Body>
                          </Table.Content>
                        </Table.Root>
                      </section>
                    ),
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
