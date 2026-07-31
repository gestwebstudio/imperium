import { Fragment } from "react";
import type { Car } from "@/lib/cars";
import { Badge } from "@/components";
import { Button } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { Crumbs } from "@/components/ui/Crumbs";
import { CarsSection } from "@/components/home/CarsSection";
import { Contacts } from "@/components/home/Contacts";

/* Данные страницы Trade-in (тексты и стили — из макета 775:4922). */
const HERO_STATS = [
  { value: "Экспресс-оценка", label: "по фото, видео и VIN" },
  { value: "Полная прозрачность", label: "без скрытых комиссий" },
  { value: "Сопровождение сделки", label: "на всех этапах" },
  { value: "Зачет стоимости", label: "в счёт нового автомобиля" },
];

const STEPS = [
  {
    stage: "Этап 1",
    title: "Заявка и консультация",
    text: "Оставьте заявку, пришлите VIN, фото и видео автомобиля. Персональный менеджер свяжется для уточнения деталей и назначит осмотр",
  },
  {
    stage: "Этап 2",
    title: "Осмотр и диагностика",
    text: "Автомобиль проходит экспертную проверку нашими экспертами: состояние кузова, салона, техническое состояние и юридическая чистота",
  },
  {
    stage: "Этап 3",
    title: "Финальная оценка",
    text: "Предлагаем итоговую сумму зачета. Она формируется прозрачно — на основе рыночных данных и реального состояния автомобиля",
  },
  {
    stage: "Этап 4",
    title: "Выбор нового автомобиля",
    text: "Подберем автомобиль из наличия или обсудим поставку под заказ. Оформим сделку с учетом зачета стоимости вашего текущего автомобиля",
  },
];

const FACTORS = [
  "Рыночная ситуация и спрос на модель",
  "Марка, год, пробег",
  "Техническое состояние",
  "Внешний вид, ЛКП, салон",
  "История обслуживания (сервисная книжка)",
  "Юридическая чистота, обременения",
];

const CONDITIONS = [
  "Авто принадлежит владельцу на законных основаниях;",
  "ПТС, СТС, паспорт владельца в порядке;",
  "Нет запрета на регистрационные действия;",
  "VIN и номера агрегатов совпадают с документами.",
];

export function TradeInPage({ cars }: { cars: Car[] }) {
  return (
    <main className="trade-in">
      {/* ---------- Hero ---------- */}
      <section className="ti-hero">
        <div className="ti-hero__inner home-wrap">
          <Crumbs
            items={[{ label: "Главная", href: "/" }, { label: "Трейд-ин" }]}
          />
          <div className="ti-hero__top">
            <h1 className="ti-hero__title">
              <span className="reg">TRADE-IN НА УСЛОВИЯХ,</span>
              <span className="bold">ДОСТОЙНЫХ ВАШЕГО СТАТУСА</span>
            </h1>
            <div className="ti-hero__aside">
              <p className="ti-hero__sub">
                Оценим ваш автомобиль, оформим сделку и подберем новый в Imperium
                Motors. Финальная цена формируется прозрачно — вы заранее знаете
                итоговую сумму и проходите все этапы без суеты
              </p>
              <Button variant="primary-surface" size="l" className="ti-hero__cta">
                Экспресс-оценка
              </Button>
            </div>
          </div>

        </div>

        {/* Преимущества — 4 отдельные стеклянные карточки (стекло как у шапки),
            ряд наезжает наполовину на кромку hero */}
        <div className="ti-hero__stats-wrap home-wrap">
          <div className="ti-hero__stats">
            {HERO_STATS.map((s) => (
              <GlassSurface
                key={s.value}
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
                <span className="ti-stat__value">{s.value}</span>
                <span className="ti-stat__label">{s.label}</span>
              </GlassSurface>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Как проходит trade-in ---------- */}
      <section className="home-wrap ti-steps">
        <h2 className="ti-section-title">Как проходит trade-in</h2>
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

      {/* ---------- Что влияет на оценку ---------- */}
      <section className="home-wrap ti-factors">
        <div className="ti-factors__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/services/podbor.webp" alt="Оценка автомобиля" />
        </div>
        <div className="ti-block__body ti-factors__body">
          <h2 className="ti-block__title">
            <span className="reg">Что влияет</span>
            <span className="bold">на оценку автомобиля?</span>
          </h2>
          <ul className="ti-list">
            {FACTORS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="ti-callout">
            <span className="reg">Чем полнее история автомобиля</span>
            <span className="bold">тем выгоднее итоговое предложение</span>
          </p>
        </div>
      </section>

      {/* ---------- Премиальные модели ---------- */}
      <CarsSection
        title="Премиальные модели для приобретения с trade-in"
        cars={cars}
      />

      {/* ---------- Мы готовы принять ---------- */}
      <section className="home-wrap ti-accept">
        <div className="ti-block__body ti-accept__body">
          <h2 className="ti-block__title">
            <span className="reg">Мы готовы принять ваш</span>
            <span className="bold">автомобиль в trade-in, если:</span>
          </h2>
          <ul className="ti-list">
            {CONDITIONS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="ti-callout">
            <span className="reg">Не ограничиваем</span>
            <span className="bold">марками и годами выпуска</span>
          </p>
          <p className="ti-accept__note">
            Принимаем любые автомобили при условии юридической чистоты и
            технической исправности
          </p>
        </div>
        <div className="ti-accept__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/services/podbor.webp"
            alt="Приём автомобиля в trade-in"
          />
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

export default TradeInPage;
