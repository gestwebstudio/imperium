"use client";

import { Fragment, useState } from "react";

type Option = { label: string; value: string };
type Category = { name: string; options: Option[] };

/** Мок-данные комплектации (одинаковые для всех авто — заменяются на API позже). */
const COMPLECTATION: Category[] = [
  {
    name: "Экстерьер",
    options: [
      { label: "Диски", value: "R21, кованые, чёрный глянец" },
      { label: "Окраска кузова", value: "Металлик, двухслойная" },
      { label: "Крыша", value: "Панорамная, электропривод" },
      { label: "Стёкла", value: "Атермальные, тонированные" },
      { label: "Зеркала", value: "Складные, с подогревом" },
      { label: "Выхлопная система", value: "Спортивная с заслонками" },
    ],
  },
  {
    name: "Комфорт",
    options: [
      { label: "Климат-контроль", value: "4-зонный" },
      { label: "Передние сиденья", value: "Вентиляция и массаж" },
      { label: "Руль", value: "С подогревом, кожа" },
      { label: "Память настроек", value: "Водитель + пассажир" },
      { label: "Доступ в салон", value: "Бесключевой, старт с кнопки" },
      { label: "Багажник", value: "Электропривод, сенсор ноги" },
    ],
  },
  {
    name: "Безопасность",
    options: [
      { label: "Подушки безопасности", value: "8 шт." },
      { label: "Автоторможение", value: "City Brake (AEB)" },
      { label: "Контроль полосы", value: "Удержание и предупреждение" },
      { label: "Слепые зоны", value: "Мониторинг с подсветкой" },
      { label: "Круиз-контроль", value: "Адаптивный, Stop & Go" },
      { label: "Обзор", value: "Камеры кругового обзора 360°" },
    ],
  },
  {
    name: "Мультимедиа",
    options: [
      { label: "Центральный экран", value: "12.3″, сенсорный" },
      { label: "Приборная панель", value: "Цифровая, 12.3″" },
      { label: "Аудиосистема", value: "Premium, 16 динамиков" },
      { label: "Смартфон", value: "Apple CarPlay / Android Auto" },
      { label: "Зарядка", value: "Беспроводная + USB-C" },
      { label: "Проекция", value: "Head-Up Display" },
    ],
  },
  {
    name: "Противоугонные системы",
    options: [
      { label: "Сигнализация", value: "Заводская, датчик наклона" },
      { label: "Иммобилайзер", value: "Транспондерный" },
      { label: "Спутниковый мониторинг", value: "GPS / ГЛОНАСС-трекер" },
      { label: "Блокировка руля", value: "Электронная" },
      { label: "Маркировка", value: "Скрытая, по стёклам" },
    ],
  },
  {
    name: "Освещение и обзор",
    options: [
      { label: "Фары", value: "Матричные LED" },
      { label: "Ходовые огни", value: "Светодиодные" },
      { label: "Подсветка салона", value: "Многоцветная, 64 цвета" },
      { label: "Датчики", value: "Света и дождя" },
      { label: "Салонное зеркало", value: "Автозатемнение" },
    ],
  },
];

/** Разбить опции на 3 колонки (по столбцам, как в макете). */
function toColumns(options: Option[]): Option[][] {
  const per = Math.ceil(options.length / 3);
  return [
    options.slice(0, per),
    options.slice(per, per * 2),
    options.slice(per * 2),
  ].filter((c) => c.length > 0);
}

export function Complectation() {
  const [active, setActive] = useState(0);
  const cols = toColumns(COMPLECTATION[active].options);

  return (
    <section className="car-comp">
      <h2 className="car-comp__title">Комплектация</h2>

      <div className="car-comp__inner">
        <div className="car-comp__tabs" role="tablist" aria-label="Категории комплектации">
          {COMPLECTATION.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`car-comp__tab${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              {c.name}
              <span className="car-comp__count">{c.options.length}</span>
            </button>
          ))}
        </div>

        <div className="car-comp__grid">
          {cols.map((col, ci) => (
            <Fragment key={ci}>
              {ci > 0 && <div className="car-comp__div" aria-hidden />}
              <div className="car-comp__col">
                {col.map((o) => (
                  <div className="car-comp__opt" key={o.label}>
                    <span className="car-comp__opt-label">{o.label}</span>
                    <span className="car-comp__opt-value">{o.value}</span>
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Complectation;
