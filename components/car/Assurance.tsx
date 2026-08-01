import { ButtonLink } from "@/components/ui/Button";

/**
 * Блок «Страхование / Гарантия / Помощь на дорогах» (макет 639:2747).
 * Две белые карточки в ряд + широкая зелёная плашка с фото (help.webp).
 */
export function Assurance() {
  return (
    <section className="car-assur">
      <div className="car-assur__cards">
        <article className="car-assur__card">
          <h3 className="car-assur__title">Страхование КАСКО</h3>
          <p className="car-assur__text">
            Полная защита автомобиля от угона, ДТП и других рисков.
            Индивидуальные тарифы и быстрая выплата.
          </p>
        </article>
        <article className="car-assur__card">
          <h3 className="car-assur__title">Расширенная гарантия</h3>
          <p className="car-assur__text">
            Дополнительные 3 года или 100 000 км пробега. Бесплатное
            обслуживание в официальных центрах.
          </p>
        </article>
      </div>

      <div className="car-help">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="car-help__img" src="/images/help.webp" alt="" aria-hidden="true" />
        <div className="car-help__body">
          <div className="car-help__text">
            <h3 className="car-help__title">Помощь на дорогах</h3>
            <p className="car-help__desc">
              Круглосуточная поддержка для клиентов автосалона: эвакуация,
              замена колеса, доставка топлива и выезд механика.
            </p>
          </div>
          <ButtonLink
            href="/help-on-roads"
            size="m"
            variant="primary-surface"
            inverse
            className="car-help__btn"
          >
            Подробнее
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default Assurance;
