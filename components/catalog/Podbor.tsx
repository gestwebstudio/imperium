import { ButtonLink } from "@/components/ui/Button";
import { LeadModal } from "@/components/ui/LeadModal";

/**
 * Блок «Не нашли подходящий автомобиль?» (услуга подбора).
 * Раскладка/размеры переиспуют эталонный блок картинка+текст трейд-ина
 * (.ti-factors): mobile-first, фото слева + текст справа. Вместо зелёного
 * выделения — две кнопки. Секция сама задаёт контейнер (без .home-wrap).
 * Первая кнопка — окно-заявка, вторая — ссылка на страницу подбора.
 */
export function Podbor() {
  return (
    <section className="podbor">
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
          <LeadModal
            triggerLabel="Подобрать автомобиль"
            triggerVariant="primary-surface"
            title="Подбор автомобиля"
            description="Оставьте контакты и опишите желаемый автомобиль — менеджер подберёт варианты и рассчитает стоимость с доставкой и оформлением."
            submitLabel="Отправить заявку"
            successTitle="Заявка принята"
            successText="Менеджер свяжется с вами, уточнит параметры и предложит варианты под ваш запрос."
            comment
            commentLabel="Какой автомобиль ищете"
            commentPlaceholder="Марка, модель, комплектация, бюджет"
          />
          <ButtonLink size="l" variant="secondary-outlined" href="/car-selection">
            Подробнее об услуге
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default Podbor;
