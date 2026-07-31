import type { Car } from "@/lib/cars";
import { Badge } from "@/components";
import { Button } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { Crumbs } from "@/components/ui/Crumbs";
import { Contacts } from "@/components/home/Contacts";

/* Страница «Авто под заказ» — макет Figma 821:212. Блоки переиспользованы с Trade-in. */
const HERO_STATS = [
  "Подбор под индивидуальный запрос",
  "Легальная поставка из-за рубежа",
  "Автомобиль полностью растаможен",
  "Сопровождение сделки на всех этапах",
];

const INCLUDED = [
  "Коммерческий утильсбор",
  "ЭПТС и СБКТС",
  "Таможенное оформление",
  "Подготовка автомобиля к передаче",
  "Сопровождение по документам на всех этапах",
];

const STEPS = [
  {
    stage: "Этап 1",
    title: "Заявка и консультация",
    text: "Вы оставляете заявку и описываете, какой автомобиль вам нужен. Персональный менеджер уточняет марку, модель, комплектацию, бюджет и особые пожелания.",
  },
  {
    stage: "Этап 2",
    title: "Подбор и согласование",
    text: "Подбираем варианты, фиксируем финальную стоимость и сроки, после согласования бронируем автомобиль.",
  },
  {
    stage: "Этап 3",
    title: "Поставка и таможня",
    text: "Организуем доставку автомобиля, прохождение таможни, оформление ЭПТС, СБКТС и полного пакета документов. Вы всегда в курсе статуса.",
  },
  {
    stage: "Этап 4",
    title: "Передача автомобиля",
    text: "Передаем вам полностью оформленный, растаможенный и готовый к постановке на учет автомобиль. Вам остаётся только сесть за руль.",
  },
];

const CONDITIONS = [
  "Автомобиль доступен для заказа в указанной стране;",
  "Вы предоставили точные параметры: марку, модель, комплектацию;",
  "Согласованы финальная стоимость и условия оплаты;",
  "Заключен договор и внесена предоплата в размере 20% (возможны индивидуальные условия).",
];

export function CarSelectionPage() {
  return (
    <main className="trade-in car-selection">
      {/* ---------- Hero ---------- */}
      <section className="ti-hero">
        <div className="ti-hero__inner home-wrap">
          <Crumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Авто под заказ" },
            ]}
          />
          <div className="ti-hero__top">
            <h1 className="ti-hero__title">
              <span className="reg">ПРЕМИАЛЬНЫЙ АВТОМОБИЛЬ</span>
              <span className="bold">ПОД ВАШ ЗАПРОС</span>
            </h1>
            <div className="ti-hero__aside">
              <p className="ti-hero__sub">
                Imperium Motors подберет, привезет и оформит автомобиль под ваш
                запрос. Автомобили из Европы, Кореи, Китая, США, Ближнего
                Востока — с понятными условиями, прозрачной стоимостью и
                сопровождением на каждом этапе.
              </p>
              <Button variant="primary-surface" size="l" className="ti-hero__cta">
                Заказать автомобиль
              </Button>
            </div>
          </div>
        </div>

        {/* Преимущества — 4 стеклянные карточки (только заголовок, 2 строки → 116px как trade-in) */}
        <div className="ti-hero__stats-wrap home-wrap">
          <div className="ti-hero__stats">
            {HERO_STATS.map((s) => (
              <GlassSurface
                key={s}
                className="ti-stat"
                borderRadius={30}
                height="auto"
                backgroundOpacity={0.06}
                saturation={1.02}
                lightAngle={-45}
                lightIntensity={35}
                refraction={100}
                depth={75}
                frost={3}
                splay={70}
              >
                <span className="ti-stat__value">{s}</span>
              </GlassSurface>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Что входит в стоимость (фото слева) ---------- */}
      <section className="home-wrap ti-factors">
        <div className="ti-factors__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/services/podbor.webp" alt="Автомобиль под заказ" />
        </div>
        <div className="ti-block__body ti-factors__body">
          <h2 className="ti-block__title">
            <span className="reg">Что входит в стоимость</span>
            <span className="bold">автомобиля под заказ</span>
          </h2>
          <ul className="ti-list">
            {INCLUDED.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="ti-callout">
            <span className="reg">Никаких скрытых платежей</span>
            <span className="bold">неожиданных процедур</span>
          </p>
          <p className="ti-accept__note">
            К моменту передачи автомобиль будет полностью растаможен, иметь
            действующий ЭПТС и готов к постановке на учет.
          </p>
        </div>
      </section>

      {/* ---------- Как проходит заказ автомобиля ---------- */}
      <section className="home-wrap ti-steps">
        <h2 className="ti-section-title">Как проходит заказ автомобиля</h2>
        <div className="ti-steps__grid">
          {STEPS.map((s) => (
            <article className="ti-step" key={s.stage}>
              <Badge color="info" className="ti-step__badge">
                {s.stage}
              </Badge>
              <h3 className="ti-step__title">{s.title}</h3>
              <p className="ti-step__text">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Необходимые условия (фото слева, текст слева — как блок #1) ---------- */}
      <section className="home-wrap ti-factors ti-cs-2">
        <div className="ti-factors__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/services/podbor.webp" alt="Условия заказа" />
        </div>
        <div className="ti-block__body ti-factors__body">
          <h2 className="ti-block__title">
            <span className="reg">Необходимые условия</span>
            <span className="bold">для старта</span>
          </h2>
          <ul className="ti-list">
            {CONDITIONS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="ti-callout">
            <span className="reg">Финансовые условия</span>
            <span className="bold">просты и прозрачны</span>
          </p>
          <p className="ti-accept__note">
            20% предоплата для бронирования, оставшиеся 80% — в день передачи
            ключей. Принимаем как наличные, так и безналичный перевод.
          </p>
        </div>
      </section>

      {/* ---------- Позвоните нам (баннер) ---------- */}
      <section className="home-wrap">
        <div className="ti-call">
          <div className="ti-call__text">
            <h2 className="ti-call__title">Позвоните нам</h2>
            <p className="ti-call__sub">
              Круглосуточная поддержка для клиентов автосалона: эвакуация, замена
              колеса, доставка топлива и выезд механика.
            </p>
          </div>
          <Button variant="primary-surface" inverse size="m">
            Подробнее
          </Button>
        </div>
      </section>

      <Contacts />
    </main>
  );
}

export default CarSelectionPage;
