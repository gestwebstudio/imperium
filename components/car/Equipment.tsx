"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Bubble } from "@/components/ui/primitives";

type EquipmentFeature = {
  label: string;
  value: string;
};

type EquipmentCategory = {
  name: string;
  features: EquipmentFeature[];
};

const categories: EquipmentCategory[] = [
  {
    name: "Экстерьер",
    features: [
      { label: "Диски:", value: "R21, кованые, чёрный глянец" },
      { label: "Окраска кузова:", value: "Металлик, двухслойная" },
      { label: "Крыша:", value: "Панорамная, электропривод" },
      { label: "Стёкла:", value: "Атермальные, тонированные" },
      { label: "Зеркала:", value: "Складные, с подогревом" },
      {
        label: "Выхлопная система:",
        value: "Спортивная с регулируемыми заслонками",
      },
      { label: "Аэродинамический пакет:", value: "Sport Design" },
      { label: "Спойлер:", value: "Активный, с электроприводом" },
      { label: "Решётка радиатора:", value: "Чёрный глянец" },
      { label: "Наружный декор:", value: "Карбон" },
      { label: "Дверные ручки:", value: "В цвет кузова" },
      { label: "Защита кузова:", value: "Керамическое покрытие" },
    ],
  },
  {
    name: "Комфорт",
    features: [
      { label: "Климат-контроль:", value: "4-зонный" },
      { label: "Передние сиденья:", value: "Вентиляция и массаж" },
      { label: "Руль:", value: "С подогревом, кожа" },
      { label: "Память настроек:", value: "Водитель и пассажир" },
      { label: "Доступ в салон:", value: "Бесключевой, старт с кнопки" },
      { label: "Багажник:", value: "Электропривод, сенсор ноги" },
      { label: "Задние сиденья:", value: "Подогрев и регулировка" },
      { label: "Доводчики дверей:", value: "Автоматические" },
      { label: "Лобовое стекло:", value: "С электрообогревом" },
      { label: "Подлокотники:", value: "С охлаждаемыми нишами" },
      { label: "Освещение салона:", value: "Контурное, многоцветное" },
      { label: "Шумоизоляция:", value: "Акустические стёкла" },
    ],
  },
  {
    name: "Безопасность",
    features: [
      { label: "Подушки безопасности:", value: "8 шт." },
      { label: "Автоторможение:", value: "City Brake (AEB)" },
      { label: "Контроль полосы:", value: "Удержание и предупреждение" },
      { label: "Слепые зоны:", value: "Мониторинг с подсветкой" },
      { label: "Круиз-контроль:", value: "Адаптивный, Stop & Go" },
      { label: "Обзор:", value: "Камеры кругового обзора 360°" },
      { label: "Парковка:", value: "Автоматический ассистент" },
      { label: "Распознавание знаков:", value: "С проекцией на дисплей" },
      { label: "Контроль усталости:", value: "Активный мониторинг" },
      { label: "Ассистент перекрёстков:", value: "Предупреждение и торможение" },
      { label: "Система стабилизации:", value: "Динамическая" },
      { label: "Экстренный вызов:", value: "ЭРА-ГЛОНАСС" },
    ],
  },
  {
    name: "Мультимедиа",
    features: [
      { label: "Центральный экран:", value: "12.3″, сенсорный" },
      { label: "Приборная панель:", value: "Цифровая, 12.3″" },
      { label: "Аудиосистема:", value: "Premium, 16 динамиков" },
      { label: "Смартфон:", value: "Apple CarPlay / Android Auto" },
      { label: "Зарядка:", value: "Беспроводная и USB-C" },
      { label: "Проекция:", value: "Head-Up Display" },
      { label: "Навигация:", value: "Онлайн-карты и пробки" },
      { label: "Голосовое управление:", value: "Расширенное" },
      { label: "Интернет:", value: "Встроенный LTE-модем" },
      { label: "Задние экраны:", value: "Два сенсорных дисплея" },
      { label: "Обновления:", value: "По воздуху (OTA)" },
      { label: "Приложение:", value: "Удалённое управление" },
    ],
  },
  {
    name: "Противоугонные системы",
    features: [
      { label: "Сигнализация:", value: "Заводская, датчик наклона" },
      { label: "Иммобилайзер:", value: "Транспондерный" },
      { label: "Мониторинг:", value: "GPS / ГЛОНАСС-трекер" },
      { label: "Блокировка руля:", value: "Электронная" },
      { label: "Маркировка:", value: "Скрытая, по стёклам" },
      { label: "Датчик объёма:", value: "Ультразвуковой" },
      { label: "Защита периметра:", value: "Все двери и багажник" },
      { label: "Метка владельца:", value: "Bluetooth-транспондер" },
      { label: "Удалённая блокировка:", value: "Через приложение" },
      { label: "Резервное питание:", value: "Автономная сирена" },
      { label: "История событий:", value: "В мобильном приложении" },
      { label: "Защита разъёма OBD:", value: "Электронная" },
    ],
  },
  {
    name: "Освещение и обзор",
    features: [
      { label: "Фары:", value: "Матричные LED" },
      { label: "Ходовые огни:", value: "Светодиодные" },
      { label: "Подсветка салона:", value: "Многоцветная, 64 цвета" },
      { label: "Датчики:", value: "Света и дождя" },
      { label: "Салонное зеркало:", value: "Автозатемнение" },
      { label: "Дальний свет:", value: "Автоматическое управление" },
      { label: "Поворотный свет:", value: "Динамический" },
      { label: "Противотуманные фары:", value: "Светодиодные" },
      { label: "Омыватели фар:", value: "Высокого давления" },
      { label: "Камера заднего вида:", value: "С динамической разметкой" },
      { label: "Парковочные датчики:", value: "Передние и задние" },
      { label: "Тепловизор:", value: "Ночное видение" },
    ],
  },
];

function toColumns(features: EquipmentFeature[]) {
  const perColumn = Math.ceil(features.length / 3);

  return Array.from({ length: 3 }, (_, column) =>
    features.slice(column * perColumn, (column + 1) * perColumn),
  );
}

export function Equipment() {
  const [activeCategory, setActiveCategory] = useState(0);
  const activeFeatures = categories[activeCategory].features;
  const columns = toColumns(activeFeatures);

  return (
    <section className="car-equipment">
      <h2 className="car-equipment__title">Комплектация</h2>

      <div className="car-equipment__body">
        <div
          className="car-equipment__tabs"
          role="tablist"
          aria-label="Разделы комплектации"
        >
          {categories.map((category, index) => {
            const active = index === activeCategory;

            return (
              <Button
                key={category.name}
                type="button"
                size="m"
                variant={active ? "primary-surface" : "secondary-outlined"}
                role="tab"
                aria-selected={active}
                endSlot={
                  <Bubble
                    size="m"
                    color={active ? "white" : "taupe-400"}
                  >
                    {category.features.length}
                  </Bubble>
                }
                onClick={() => setActiveCategory(index)}
              >
                {category.name}
              </Button>
            );
          })}
        </div>

        <div className="car-equipment__grid">
          {columns.map((features, column) => (
            <div className="car-equipment__column" key={column}>
              {features.map((feature, index) => (
                <div
                  className="car-equipment__feature"
                  key={`${feature.label}-${index}`}
                >
                  <span className="car-equipment__label">{feature.label}</span>
                  <span className="car-equipment__value">{feature.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Equipment;
