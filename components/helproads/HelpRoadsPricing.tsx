"use client";

import { Table } from "@heroui/react";

/* Тарифы техпомощи и эвакуации. Таблица переиспользует стили сравнения
   (comparison-spec-table*, comparison.css импортируется на странице). */
type Row = { label: string; price: string };
type Sub = { title?: string; rows: Row[] };
type Section = { title: string; subs: Sub[] };

const SECTIONS: Section[] = [
  {
    title: "Техническая помощь",
    subs: [
      {
        rows: [
          {
            label:
              "Запуск двигателя, замена колеса (без демонтажа секреток), подвоз топлива — в пределах границ городов РФ (МКАД для Москвы), 1 час работ на месте",
            price: "5 000 ₽",
          },
          { label: "Вскрытие автомобиля без повреждений", price: "6 500 ₽" },
          { label: "Отключение сигнализации", price: "6 500 ₽" },
          { label: "Переадресация", price: "2 500 ₽" },
          {
            label:
              "Стоимость 1 км пробега за пределами границ городов РФ (МКАД для Москвы), оплата только в одну сторону",
            price: "125 ₽/км",
          },
          { label: "Выкатывание из гаража/паркинга", price: "25 000 ₽" },
        ],
      },
    ],
  },
  {
    title: "Эвакуация",
    subs: [
      {
        title:
          "Транспортировка легковых автомобилей до 3,5 т (эвакуатор со сдвижной платформой) в пределах границ городов РФ (в пределах МКАД для Москвы)",
        rows: [
          { label: "Автомобили полной массой до 3,5 т", price: "7 500 ₽" },
          { label: "Сложность погрузки", price: "от 2 000 ₽" },
          {
            label: "Эвакуация с заблокированными колесами",
            price: "доп. 2 000 ₽/колесо",
          },
          {
            label:
              "Стоимость простоя эвакуатора по вине/просьбе Заказчика (тарификация начинается с 15 минуты)",
            price: "60 ₽/1 мин.",
          },
          { label: "Переадресация", price: "3 500 ₽" },
          {
            label:
              "Стоимость 1 км груженого пробега чертой города (за МКАД в случае Москвы)",
            price: "150 ₽/км",
          },
        ],
      },
      {
        title:
          "Транспортировка легковых автомобилей до 3,5 т (эвакуатор с крано-манипуляторной установкой) в пределах границ городов РФ (в пределах МКАД для Москвы)",
        rows: [
          { label: "Автомобили полной массой до 3,5 т", price: "15 000 ₽" },
          {
            label:
              "Стоимость 1 км груженого пробега эвакуатора за чертой города (за МКАД в случае Москвы)",
            price: "200 ₽/км",
          },
          {
            label:
              "Стоимость простоя крана-манипулятора по вине/просьбе Заказчика (тарификация начинается с 15 минуты)",
            price: "60 ₽/1 мин",
          },
          { label: "Переадресация", price: "2 500 ₽" },
        ],
      },
      {
        title:
          "Транспортировка коммерческих автомобилей до 5,0 т в пределах границ городов РФ (в пределах МКАД для Москвы)",
        rows: [
          {
            label: "Автомобили полной массой до 3,5 т, габаритной длиной до 5 м.",
            price: "10 000 ₽",
          },
          {
            label:
              "Автомобили полной массой от 3,5 до 5 т, габаритной длиной более 5 м.",
            price: "15 000 ₽",
          },
          {
            label:
              "Стоимость простоя эвакуатора по вине/просьбе Заказчика (тарификация начинается с 15 минуты)",
            price: "25 ₽/1 мин.",
          },
          { label: "Эвакуация частичной погрузкой", price: "25 000 ₽" },
          { label: "Переадресация", price: "3 500 ₽" },
          {
            label: "Стоимость 1 км груженого пробега эвакуатора за чертой города",
            price: "200 ₽/км",
          },
        ],
      },
    ],
  },
];

const NOTE: Row = {
  label:
    "Ложный вызов по вине Заказчика или Клиента для всех случаев оказания технической помощи или эвакуации",
  price: "50% от полной стоимости Заказа + полная стоимость пробега",
};

function PriceTable({ rows, ariaLabel }: { rows: Row[]; ariaLabel: string }) {
  return (
    <Table.Root className="comparison-spec-table" variant="primary">
      <Table.Content
        className="comparison-spec-table__content"
        aria-label={ariaLabel}
      >
        <Table.Header className="comparison-spec-table__header">
          <Table.Column
            className="comparison-spec-table__column comparison-spec-table__column--label"
            isRowHeader
          >
            Услуга
          </Table.Column>
          <Table.Column className="comparison-spec-table__column comparison-spec-table__column--price">
            Стоимость
          </Table.Column>
        </Table.Header>
        <Table.Body className="comparison-spec-table__body">
          {rows.map((row) => (
            <Table.Row
              className="comparison-spec-table__row"
              id={row.label}
              key={row.label}
            >
              <Table.Cell className="comparison-spec-table__cell comparison-spec-table__cell--label">
                {row.label}
              </Table.Cell>
              <Table.Cell className="comparison-spec-table__cell comparison-spec-table__cell--value hr-pricing__price">
                {row.price}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table.Root>
  );
}

export function HelpRoadsPricing() {
  return (
    <section className="home-wrap hr-pricing">
      {SECTIONS.map((section) => (
        <div className="hr-pricing__section" key={section.title}>
          <h2 className="comparison-table-section__title">{section.title}</h2>
          {section.subs.map((sub, i) => (
            <div className="hr-pricing__sub" key={sub.title ?? i}>
              {sub.title && <h3 className="hr-pricing__subtitle">{sub.title}</h3>}
              <PriceTable rows={sub.rows} ariaLabel={sub.title ?? section.title} />
            </div>
          ))}
        </div>
      ))}

      <PriceTable rows={[NOTE]} ariaLabel="Ложный вызов" />
    </section>
  );
}

export default HelpRoadsPricing;
