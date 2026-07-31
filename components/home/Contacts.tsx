import { ButtonLink } from "@/components/ui/Button";

const MAP_SRC =
  "https://yandex.ru/map-widget/v1/?text=" +
  encodeURIComponent("Москва, Кутузовский проспект, 48") +
  "&z=16";

export function Contacts({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;

  return (
    <section className="home-wrap contacts" id="contacts">
      <div className="contacts__grid">
        <div className="contacts__left">
          <div className="contacts__head">
            <Heading className="contacts__title">
              <span className="l1">Ждём вас в салоне</span>
              <span className="l2">Imperium Motors</span>
            </Heading>
            <p className="contacts__sub">
              Выберите удобное время, и мы подготовим автомобили к вашему приезду.
              Ответим на вопросы, проведём тест-драйв и обсудим детали сделки в
              комфортной обстановке.
            </p>
          </div>

          <div className="contacts__gallery">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tall" src="/images/contacts/1.webp" alt="Салон Imperium Motors" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/contacts/2.webp" alt="Салон Imperium Motors" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/contacts/3.webp" alt="Салон Imperium Motors" />
          </div>
        </div>

        <div className="contacts__info">
          <div className="contacts__rows">
            <div className="contacts__row">
              <span className="label">Телефон</span>
              <span className="value">+7 499 704-14-44</span>
            </div>
            <div className="contacts__row">
              <span className="label">Адрес</span>
              <span className="value">Москва, Кутузовский проспект 48</span>
              <span className="note">(Паркинг P1 ТЦ «Времена года»)</span>
            </div>
            <div className="contacts__row">
              <span className="label">Часы работы</span>
              <span className="value">11:00 – 21:00</span>
              <span className="note">(ежедневно)</span>
            </div>
            <ButtonLink
              href="https://yandex.ru/maps/213/moscow/?ll=37.487361%2C55.731719&mode=routes&rtext=~55.731895%2C37.488312&rtt=auto&ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D28670517535&z=16.38"
              target="_blank"
              rel="noopener noreferrer"
              size="l"
              variant="primary-surface"
            >
              Построить маршрут
            </ButtonLink>
          </div>

          <div className="contacts__map">
            <iframe
              src={MAP_SRC}
              title="Карта — Imperium Motors, Кутузовский проспект 48"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
