"use client";

import type { ReactNode } from "react";
import { Table } from "@heroui/react";

/* Таблица «Услуга / Событие» — бесплатный перечень услуг по программе
   (данные из переданного файла). Стили переиспользуют таблицу сравнения
   (comparison-spec-table*, comparison.css импортируется на странице). */

type ServiceRow = { service: ReactNode; event: string };

const TECH_HELP: ReactNode = (
  <>
    <span className="hor-serv__lead">Техническая помощь:</span>
    <ul className="hor-serv__list">
      <li>Подзарядка ВВ тяговой батареи мобильной зарядной станцией</li>
      <li>Замена колеса на запасное</li>
      <li>Вскрытие автомобиля</li>
      <li>Подвоз топлива (кроме СПГ)</li>
      <li>Запуск двигателя от внешнего источника*</li>
    </ul>
    <span className="hor-serv__note">* Для авто с ДВС</span>
  </>
);

const SERVICES: ServiceRow[] = [
  { service: "Техническая консультация", event: "без ограничений" },
  {
    service: "Юридическая консультация по телефону в рабочее время",
    event: "без ограничений",
  },
  {
    service: TECH_HELP,
    event:
      "Заряда ВВ батареи недостаточно для доезда до источника восполнения заряда / ДТП или поломка",
  },
  { service: "Эвакуация", event: "ДТП или поломка" },
  { service: "Такси (до 50 км, 1500 руб. max)", event: "ДТП" },
  { service: "Аварийный комиссар (до 50 км)", event: "ДТП" },
  {
    service:
      "Помощь в сборе документов для СК и передача их в СК/Клиенту (до 50 км)",
    event: "ДТП",
  },
  {
    service:
      "Справка из гидрометеоцентра при повреждении авто в результате атмосферных явлений",
    event: "без ограничений",
  },
  {
    service: "Поиск местонахождения эвакуированного автомобиля",
    event: "без ограничений",
  },
  {
    service: "Независимая экспертиза при ДТП (на пункте осмотра)",
    event: "1 раз на 1 ДТП",
  },
  {
    service:
      "Возвращение в РФ автомобиля, водителя и пассажиров в случае тотальной гибели автомобиля (репатриация)",
    event: "без ограничений",
  },
  {
    service:
      "Европейское покрытие (43 страны) + 30 км от городов присутствия партнёров",
    event: "ДТП или поломка",
  },
  { service: "Трезвый водитель", event: "1 раз в год" },
  { service: "Такси в аэропорт/на вокзал", event: "1 раз в год" },
  {
    service: "Лимит бесплатного километража за чертой города, км",
    event: "200 км",
  },
];

export function HelpOnRoadServices() {
  return (
    <section className="home-wrap hr-pricing hor-services">
      <h2 className="comparison-table-section__title">
        Что входит в бесплатный перечень услуг по программе
      </h2>

      <Table.Root className="comparison-spec-table" variant="primary">
        <Table.Content
          className="comparison-spec-table__content"
          aria-label="Бесплатный перечень услуг по программе"
        >
          <Table.Header className="comparison-spec-table__header">
            <Table.Column
              className="comparison-spec-table__column comparison-spec-table__column--label"
              isRowHeader
            >
              Услуга
            </Table.Column>
            <Table.Column className="comparison-spec-table__column comparison-spec-table__column--price">
              Событие
            </Table.Column>
          </Table.Header>
          <Table.Body className="comparison-spec-table__body">
            {SERVICES.map((row, i) => (
              <Table.Row
                className="comparison-spec-table__row"
                id={`service-${i}`}
                key={i}
              >
                <Table.Cell className="comparison-spec-table__cell comparison-spec-table__cell--label">
                  {row.service}
                </Table.Cell>
                <Table.Cell className="comparison-spec-table__cell comparison-spec-table__cell--value">
                  {row.event}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.Root>

      <p className="hr-pricing__footnote">
        Количество обращений не ограничено за период действия услуг.
      </p>
    </section>
  );
}

export default HelpOnRoadServices;
