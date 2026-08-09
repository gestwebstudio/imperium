import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/icons";
import { Crumbs } from "@/components/ui/Crumbs";
import { HelpRoadsPricing } from "@/components/helproads/HelpRoadsPricing";
import { Contacts } from "@/components/home/Contacts";

/* Страница «Помощь на дорогах» — макет Figma 841:6808.
   Все блоки, кроме второго, переиспользуют разметку/кит Trade-in. Второй — свой. */
const GUARANTEES = [
  {
    term: "Безопасность",
    text: " — при неисправностях вы доверяете автомобиль проверенной организации.",
  },
  {
    term: "Удобство",
    text: " — при возникновении проблем на дороге наши специалисты всегда готовы помочь.",
  },
  {
    term: "Экономию",
    text: " — возможность сократить расходы на эвакуатор и другие непредвиденные услуги.",
  },
  {
    term: "Уверенность",
    text: " — вы знаете, что помощь прибудет быстро и профессионально.",
  },
];

export function HelpRoadsPage() {
  return (
    <main className="trade-in help-roads">
      {/* ---------- Hero (переиспользуем, кнопка — другая, из макета) ---------- */}
      <section className="ti-hero">
        <div className="ti-hero__inner home-wrap">
          <Crumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Помощь на дорогах" },
            ]}
          />
          <div className="ti-hero__top">
            <h1 className="ti-hero__title">
              <span className="reg">ПРОГРАММА ПОМОЩИ</span>
              <span className="bold">НА ДОРОГАХ РОССИИ И ЕВРОПЫ</span>
            </h1>
            <div className="ti-hero__aside">
              <p className="ti-hero__sub">
                <b>
                  Круглосуточная техническая поддержка и выездной автосервис
                </b>{" "}
                в любой точке маршрута. Одна телефонная линия, один стандарт
                качества — где бы вы ни находились, мы приедем и поможем.{" "}
                <b>Звонок бесплатный.</b>
              </p>
              <ButtonLink
                href="tel:88002507262"
                variant="primary-surface"
                size="l"
                className="ti-hero__cta hr-hero__phone"
                endIcon={<PhoneIcon width={16} height={16} />}
              >
                8-800-250-72-62
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Блок #2 — два белых блока (свой) ---------- */}
      <section className="home-wrap hr-section">
        <div className="hr-cards">
        <article className="hr-card">
          <h2 className="ti-block__title">
            <span className="reg">Европейские стандарты помощи</span>
            <span className="bold">на российских дорогах</span>
          </h2>
          <p className="hr-card__text">
            Автомобили технической помощи оборудованы в соответствии с
            требованиями ведущих европейских автоклубов. Аппаратура и инструменты
            адаптированы к климатическим условиям нашей страны. Квалифицированные
            механики имеют доступ к уникальной базе неисправностей и способам их
            устранения. Нам доверяет свыше миллиона авто- и мотовладельцев,
            передвигающихся по России и Европе.
          </p>
          <p className="ti-callout hr-card__callout">
            <span className="reg">Срочный выездной автосервис</span>
            <span className="bold">техническая помощь на дороге 24/7</span>
          </p>
        </article>

        <article className="hr-card">
          <h2 className="ti-block__title">
            <span className="reg">Многолетний опыт</span>
            <span className="bold">позволяет нам гарантировать:</span>
          </h2>
          <ul className="hr-guarantees">
            {GUARANTEES.map((g) => (
              <li key={g.term}>
                <b>{g.term}</b>
                {g.text}
              </li>
            ))}
          </ul>
          <p className="ti-callout hr-card__callout">
            <span className="reg">Ваша уверенность за рулём</span>
            <span className="bold">в любой точке маршрута</span>
          </p>
        </article>
        </div>
      </section>

      {/* ---------- Тарифы (таблица со страницы сравнения) ---------- */}
      <HelpRoadsPricing />

      {/* ---------- Позвоните нам (баннер, переиспользуем) ---------- */}
      <section className="home-wrap">
        <div className="ti-call">
          <div className="ti-call__text">
            <h2 className="ti-call__title">Помощь 24/7</h2>
            <p className="ti-call__sub">
              Круглосуточная поддержка для клиентов автосалона: эвакуация, замена
              колеса, доставка топлива и выезд механика.
            </p>
          </div>
          <ButtonLink
            href="tel:88002507262"
            variant="primary-surface"
            inverse
            size="m"
            endIcon={<PhoneIcon width={16} height={16} />}
          >
            8-800-250-72-62
          </ButtonLink>
        </div>
      </section>

      <Contacts />
    </main>
  );
}

export default HelpRoadsPage;
