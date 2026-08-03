import type { Car } from "@/lib/cars";
import { Badge } from "@/components";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { Crumbs } from "@/components/ui/Crumbs";
import { LeadModal } from "@/components/ui/LeadModal";
import { CarsSection } from "@/components/home/CarsSection";
import { Contacts } from "@/components/home/Contacts";

const LEASING_MODAL = {
  title: "Расчёт лизинга",
  description:
    "Оставьте контакты — менеджер подберёт программу под ваш бюджет и рассчитает ежемесячный платёж.",
  submitLabel: "Отправить заявку",
  successTitle: "Заявка принята",
  successText:
    "Менеджер Imperium Motors свяжется с вами и подготовит индивидуальный расчёт лизинга.",
} as const;

/* Данные страницы Лизинг (тексты и стили — из макета 812:8593). Разметка/кит — как у Trade-in. */
const HERO_STATS = [
  "Ставка от 5%",
  "Лимит до 30 млн ₽",
  "Срок 12–60 месяцев",
  "Одобрение 90% заявок",
];

const STEPS = [
  {
    stage: "Этап 1",
    title: "Заявка и консультация",
    text: "Вы оставляете заявку, и с вами связывается персональный менеджер-эксперт. Уточняем задачу, бюджет, предпочтительную модель и формат владения.",
  },
  {
    stage: "Этап 2",
    title: "Автомобиль и расчёт",
    text: "Подбираем автомобиль в наличии или под заказ и одновременно формируем оптимальные параметры лизинга с учётом вашего финансового сценария.",
  },
  {
    stage: "Этап 3",
    title: "Одобрение и договор",
    text: "Готовим данные и отправляем заявку в лизинговую компанию. После согласования фиксируем условия и подписываем договор.",
  },
  {
    stage: "Этап 4",
    title: "Передача автомобиля",
    text: "Передаём вам автомобиль с полным сопровождением по документам, страхованию и всем организационным вопросам.",
  },
];

const FACTORS = [
  "Срок договора — от 12 до 60 месяцев",
  "Размер аванса — подбирается индивидуально",
  "Статус клиента — физлицо, ИП или юридическое лицо",
  "Стоимость автомобиля и ваш финансовый профиль",
  "Возможность досрочного выкупа без штрафов",
];

const CONDITIONS = [
  "Вам от 21 года, гражданство РФ;",
  "У вас постоянный источник дохода;",
  "Есть минимальный пакет документов: паспорт, ИНН, справка 2-НДФЛ;",
  "Для бизнеса — свидетельство о регистрации и финансовая отчётность.",
];

export function LeasingPage({ cars }: { cars: Car[] }) {
  return (
    <main className="trade-in leasing">
      {/* ---------- Hero ---------- */}
      <section className="ti-hero">
        <div className="ti-hero__inner home-wrap">
          <Crumbs
            items={[{ label: "Главная", href: "/" }, { label: "Лизинг" }]}
          />
          <div className="ti-hero__top">
            <h1 className="ti-hero__title">
              <span className="reg">ЛИЗИНГ НА УСЛОВИЯХ,</span>
              <span className="bold">ДОСТОЙНЫХ ВАШЕГО СТАТУСА</span>
            </h1>
            <div className="ti-hero__aside">
              <p className="ti-hero__sub">
                Подберём программу для физических лиц, ИП и бизнеса. Гибкие
                условия, прозрачные расчёты и полное сопровождение сделки.
              </p>
              <LeadModal
                {...LEASING_MODAL}
                triggerLabel="Получить предложение"
                triggerClassName="ti-hero__cta"
              />
            </div>
          </div>
        </div>

        {/* Преимущества — 4 стеклянные карточки, только заголовок (короче на 30px);
            отступы вокруг блока те же, что на trade-in (см. leasing.css) */}
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

      {/* ---------- Как оформить лизинг ---------- */}
      <section className="home-wrap ti-steps">
        <h2 className="ti-section-title">Как оформить лизинг</h2>
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

      {/* ---------- Из чего складываются ваши условия ---------- */}
      <section className="home-wrap ti-factors">
        <div className="ti-factors__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/services/leasing.png" alt="Условия лизинга" />
        </div>
        <div className="ti-block__body ti-factors__body">
          <h2 className="ti-block__title">
            <span className="reg">Из чего складываются</span>
            <span className="bold">ваши условия</span>
          </h2>
          <ul className="ti-list">
            {FACTORS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="ti-callout">
            <span className="reg">Чем детальнее мы проработаем ваш запрос</span>
            <span className="bold">тем выгоднее будут итоговые условия</span>
          </p>
        </div>
      </section>

      {/* ---------- Премиальные модели ---------- */}
      <CarsSection
        title="Премиальные модели для приобретения в лизинг"
        cars={cars}
      />

      {/* ---------- Мы поможем оформить лизинг ---------- */}
      <section className="home-wrap ti-accept">
        <div className="ti-block__body ti-accept__body">
          <h2 className="ti-block__title">
            <span className="reg">Мы поможем</span>
            <span className="bold">оформить лизинг, если:</span>
          </h2>
          <ul className="ti-list">
            {CONDITIONS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="ti-callout">
            <span className="reg">Подберём решение</span>
            <span className="bold">даже при нестандартных запросах</span>
          </p>
          <p className="ti-accept__note">
            Рассматриваем клиентов с разной кредитной историей
          </p>
        </div>
        <div className="ti-accept__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/services/podbor.webp" alt="Оформление лизинга" />
        </div>
      </section>

      {/* ---------- Позвоните нам (баннер) ---------- */}
      <section className="home-wrap">
        <div className="ti-call">
          <div className="ti-call__text">
            <h2 className="ti-call__title">
              Рассчитайте выгодные условия лизинга
            </h2>
            <p className="ti-call__sub">
              Оставьте заявку на расчёт. Менеджер подберёт программу под ваш
              бюджет, рассчитает ежемесячный платёж и график погашения.
            </p>
          </div>
          <LeadModal
            {...LEASING_MODAL}
            triggerLabel="Рассчитать лизинг"
            triggerVariant="primary-surface"
            triggerInverse
            triggerSize="m"
          />
        </div>
      </section>

      <Contacts />
    </main>
  );
}

export default LeasingPage;
