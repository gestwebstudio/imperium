"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Bubble } from "@/components/ui/primitives";

const categories = [
  "Экстерьер",
  "Комфорт",
  "Безопасность",
  "Мультимедиа",
  "Противоугонные системы",
  "Освещение и обзор",
];

const features = [
  {
    label: "Режимы вождения:",
    value: "Normal, Sport, Sport Plus, Individual",
  },
  {
    label: "Система стабилизации:",
    value: "Динамическая",
  },
  {
    label: "Выхлопная система:",
    value: "Спортивная с регулируемыми заслонками",
  },
  {
    label: "Выхлопная система:",
    value: "Спортивная с регулируемыми заслонками",
  },
];

export function Equipment() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section className="car-equipment">
      <h2 className="car-equipment__title">Комплектация</h2>

      <div className="car-equipment__body">
        <div className="car-equipment__tabs" aria-label="Разделы комплектации">
          {categories.map((category, index) => {
            const active = index === activeCategory;

            return (
              <Button
                key={category}
                type="button"
                size="m"
                variant={active ? "primary-surface" : "secondary-outlined"}
                endSlot={
                  <Bubble
                    size="m"
                    color={active ? "white" : "taupe-400"}
                  >
                    1
                  </Bubble>
                }
                aria-pressed={active}
                onClick={() => setActiveCategory(index)}
              >
                {category}
              </Button>
            );
          })}
        </div>

        <div className="car-equipment__grid">
          {Array.from({ length: 3 }, (_, column) => (
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
