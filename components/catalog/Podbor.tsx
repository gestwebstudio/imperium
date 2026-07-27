import { Button } from "@/components/ui/Button";

/**
 * Блок «Не нашли подходящий автомобиль?» (услуга подбора).
 * Размеры/тексты — по макету Figma 578:2501, фото — services/podbor.webp.
 */
export function Podbor() {
  return (
    <section className="home-wrap podbor">
      <div className="podbor__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/services/podbor.webp" alt="Подбор автомобиля" />
      </div>

      <div className="podbor__body">
        <div className="podbor__text">
          <h2 className="podbor__title">
            <span className="reg">Не нашли</span>
            <span className="bold">подходящий автомобиль?</span>
          </h2>
          <div className="podbor__desc">
            <p>
              Imperium Motors подберет и привезет конкретную модель, редкую
              комплектацию, нужный цвет или определенный набор опций.
            </p>
            <p>
              Полное сопровождение сделки: подбор подходящего варианта,
              согласование условий, организацию поставки, оформление документов и
              подготовку автомобиля к выдаче.
            </p>
            <p>
              К моменту передачи автомобиль будет полностью растаможен, иметь
              действующий ЭПТС и будет готов к постановке на учет.
            </p>
          </div>
        </div>

        <div className="podbor__actions">
          <Button size="l" variant="primary-surface">
            Подобрать автомобиль
          </Button>
          <Button size="l" variant="secondary-outlined">
            Подробнее об услуге
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Podbor;
