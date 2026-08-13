import { ButtonLink } from "@/components/ui/Button";
import { LoadingIframe } from "@/components/ui/LoadingIframe";
import "./contacts.css";

// Виджет организации по oid — пин на здании с названием салона
// («Империум Моторс / Автосалон»), а не карточка адреса.
const MAP_SRC = "https://yandex.ru/map-widget/v1/org/28670517535/?z=16";

// Ссылка «Построить маршрут» — сохранена со старого блока.
const ROUTE_HREF =
  "https://yandex.ru/maps/213/moscow/?ll=37.487361%2C55.731719&mode=routes&rtext=~55.731895%2C37.488312&rtt=auto&ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D28670517535&z=16.38";

/**
 * Блок «Контакты» — главный на странице контактов, добавляется как есть
 * на остальные страницы. Стили едут вместе с компонентом (contacts.css).
 * Сохранено со старого блока: код карты (LoadingIframe + Яндекс-виджет),
 * ссылка в кнопке маршрута, горизонтальный скролл галереи на мобилке,
 * исправленный текст под заголовком (на макетах — старый вариант).
 */
export function Contacts({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;

  return (
    <section className="contacts cblock" id="contacts">
      <div className="cblock__grid">
        <div className="cblock__left">
          <div className="cblock__head">
            <Heading className="cblock__title">
              <span className="l1">Ждём вас в салоне</span>
              <span className="l2">Imperium Motors</span>
            </Heading>
            <p className="cblock__sub">
              Выберите удобное время, и мы подготовим автомобили к вашему приезду.
              Ответим на вопросы и обсудим детали сделки в комфортной обстановке.
            </p>
          </div>

          <div className="cblock__gallery">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tall" src="/images/contacts/1.webp" alt="Салон Imperium Motors" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/contacts/2.webp" alt="Салон Imperium Motors" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/contacts/3.webp" alt="Салон Imperium Motors" />
          </div>
        </div>

        <div className="cblock__info">
          <div className="cblock__rows">
            <div className="cblock__row">
              <span className="label">Телефон</span>
              <span className="value">+7 499 704-14-44</span>
            </div>
            <div className="cblock__row">
              <span className="label">Адрес</span>
              <span className="value">Москва, Кутузовский проспект 48</span>
              <span className="note">(Паркинг P1 ТЦ «Времена года»)</span>
            </div>
            <div className="cblock__row">
              <span className="label">Часы работы</span>
              <span className="value">11:00 – 21:00</span>
              <span className="note">(ежедневно)</span>
            </div>
            <ButtonLink
              href={ROUTE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              size="s"
              variant="primary-surface"
              className="cblock__cta"
            >
              Построить маршрут
            </ButtonLink>
          </div>

          <LoadingIframe
            containerClassName="cblock__map"
            src={MAP_SRC}
            title="Карта — Imperium Motors, Кутузовский проспект 48"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
