import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/icons";
import { Crumbs } from "@/components/ui/Crumbs";
import { HelpOnRoadServices } from "@/components/helproads/HelpOnRoadServices";

/* Приватная страница «Помощь на дорогах» (доступ по QR на картах в салоне,
   закрыта от индексации — см. metadata в app/help-on-road/page.tsx).
   Первый блок и таблица переиспуют «Помощь на дорогах»/Trade-in,
   третий блок — картинка + маркированный список (из переданного файла). */

const PROGRAM_POINTS = [
  "Европейский уровень сервиса!",
  "Широкий спектр услуг",
  "Собственная служба техпомощи в Москве и Санкт-Петербурге. Автомобили технической помощи оборудованы по стандартам немецкого клуба ADAC.",
  "Территория покрытия: более 400 городов России и 48 стран Европы.",
  "Участие в Международной программе скидок Show Your Card",
];

export function HelpOnRoadPage() {
  return (
    <main className="trade-in help-roads">
      {/* ---------- Hero (переиспользуем; заменён только текст справа) ---------- */}
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
                Поздравляем с приобретением автомобиля! Ваш доступ к программе
                помощи на дорогах активирован. При возникновении любых проблем на
                дороге наши специалисты всегда готовы помочь.
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

      {/* ---------- Таблица «Услуга / Событие» (из файла) ---------- */}
      <HelpOnRoadServices />

      {/* ---------- Картинка + маркированный список (из файла) ---------- */}
      <section className="home-wrap ti-factors">
        <div className="ti-factors__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/services/tradein1.webp"
            alt="Программа помощи на дорогах"
          />
        </div>
        <div className="ti-block__body ti-factors__body">
          <ul className="ti-list">
            {PROGRAM_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HelpOnRoadPage;
