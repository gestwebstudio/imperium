import { ServiceImageCard } from "@/components/cards/cards";
import { Crumbs } from "@/components/ui/Crumbs";
import { LeadModal } from "@/components/ui/LeadModal";
import { Contacts } from "@/components/home/Contacts";

/* Страница «Индивидуальный дизайн авто» (Александр Велес) — макет Figma 1006:2197. */

const VELES_MODAL = {
  title: "Назначить встречу с дизайнером",
  description:
    "Оставьте контакты — мы свяжемся, чтобы назначить встречу с Александром Велесом и обсудить ваш проект.",
  submitLabel: "Отправить заявку",
  successTitle: "Заявка принята",
  successText:
    "Менеджер Imperium Motors свяжется с вами, чтобы согласовать встречу с дизайнером.",
  comment: true,
  commentLabel: "Идея проекта",
  commentPlaceholder: "Автомобиль, пожелания, референсы",
  photo: true,
  photoLabel: "Референсы или примеры",
  photoHint: "Прикрепите изображения-референсы — необязательно",
} as const;

const STEPS = [
  {
    stage: "Этап 1",
    title: "Встреча и бриф",
    text: "Личная (или онлайн) беседа с Александром, чтобы понять ваши ожидания, образ жизни, любимые цвета и референсы.",
  },
  {
    stage: "Этап 2",
    title: "Разработка концепции",
    text: "Александр предлагает 1–2 варианта образа и объясняет каждое решение: почему выбран этот цвет, как линии лягут на кузов, какой эффект получится в жизни.",
  },
  {
    stage: "Этап 3",
    title: "Визуализация и корректировки",
    text: "Вы видите фотореалистичную картинку будущего автомобиля. Если нужно, вносите правки — дорабатываем до полного попадания в ваше ожидание.",
  },
  {
    stage: "Этап 4",
    title: "Реализация",
    text: "Концепция воплощается либо в нашем ателье под ключ, либо в выбранной вами мастерской с нашей поддержкой.",
  },
];

export function VelesPage() {
  return (
    <main className="veles">
      {/* ---------- Hero (1006:2865) ---------- */}
      <section className="veles-hero">
        <div className="veles-hero__inner home-wrap">
          <Crumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Индивидуальный дизайн" },
            ]}
          />
          <div className="veles-hero__top">
            <h1 className="veles-hero__title">
              <span className="reg">ИНДИВИДУАЛЬНЫЙ</span>
              <span className="bold">ДИЗАЙН АВТОМОБИЛЯ</span>
            </h1>
            <div className="veles-hero__aside">
              <p className="veles-hero__sub">
                Ваш автомобиль может стать больше, чем средством передвижения. В
                партнёрстве с автомобильным дизайнером Александром Велесом мы
                превращаем его в арт-объект, отражающий вашу личность.
              </p>
              <LeadModal
                {...VELES_MODAL}
                triggerLabel="Записаться на консультацию"
                triggerVariant="primary-surface"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Баннер «Александр Велес» (1006:2317) ---------- */}
      <section className="home-wrap veles-cta-section">
        <div className="veles-cta">
          <div className="veles-cta__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/services/veles1.webp" alt="Александр Велес" />
          </div>
          <div className="veles-cta__body">
            <h2 className="veles-cta__title">Александр Велес</h2>
            <p className="veles-cta__sub">
              Автор индивидуальных концепций автомобильного дизайна,
              специализирующийся на персонализации премиальных и гоночных
              автомобилей. Его работы — это всегда синтез вкуса клиента,
              продуманной эстетики и технической точности. Он умеет услышать то,
              что вы сами не можете сформулировать, и перевести это на язык форм,
              цвета и материалов.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Второй блок — вордмарк + лид + 3 карточки (с ателье) ---------- */}
      <section className="home-wrap veles-identity">
        <div className="about__identity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="about__wordmark-bg"
            src="/images/logo_head.svg"
            alt=""
            aria-hidden="true"
          />
          <p className="about__lead">
            <span className="reg">Превратите автомобиль</span>
            <br />
            <span className="bold">в произведение искусства</span>
          </p>
          <ServiceImageCard
            className="svc-card--atelier"
            title="Индивидуальный дизайн-код"
            image="/images/services/veles2.webp"
            text="Художник разрабатывает уникальную графическую концепцию именно для вашего автомобиля. Повтор исключён."
            modal={{
              description:
                "Оставьте контакты — обсудим уникальную графическую концепцию для вашего автомобиля.",
              comment: true,
              commentLabel: "Идея проекта",
              commentPlaceholder: "Автомобиль, пожелания, референсы",
              photo: true,
              photoLabel: "Референсы или примеры",
              photoHint: "Прикрепите изображения-референсы — необязательно",
            }}
          />
          <ServiceImageCard
            className="svc-card--selection"
            title="Авторская графика"
            image="/images/services/veles3.webp"
            text="Рисунок любой сложности — от лаконичной линии на кузове до полноценной художественной росписи."
            modal={{
              description:
                "Оставьте контакты — обсудим рисунок и художественную роспись для вашего автомобиля.",
              comment: true,
              commentLabel: "Идея проекта",
              commentPlaceholder: "Автомобиль, пожелания, референсы",
              photo: true,
              photoLabel: "Референсы или примеры",
              photoHint: "Прикрепите изображения-референсы — необязательно",
            }}
          />
          <ServiceImageCard
            className="svc-card--veles"
            title="Брендирование и ливреи"
            image="/images/services/veles4.webp"
            text="Гоночные схемы окраски, фирменный стиль для вашего бизнеса или личного бренда."
            modal={{
              description:
                "Оставьте контакты — обсудим ливрею или фирменный стиль для вашего автомобиля.",
              comment: true,
              commentLabel: "Идея проекта",
              commentPlaceholder: "Автомобиль, пожелания, референсы",
              photo: true,
              photoLabel: "Референсы или примеры",
              photoHint: "Прикрепите изображения-референсы — необязательно",
            }}
          />
        </div>
      </section>

      {/* ---------- Процесс работы (4 этапа, 1006:2917) ---------- */}
      <section className="home-wrap veles-process">
        <h2 className="veles-process__title">Процесс работы</h2>
        <div className="veles-steps">
          {STEPS.map((s) => (
            <article className="veles-step" key={s.stage}>
              <span className="veles-step__badge">{s.stage}</span>
              <h3 className="veles-step__title">{s.title}</h3>
              <p className="veles-step__text">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Баннер «Назначить встречу» (1006:2908) ---------- */}
      <section className="home-wrap veles-call-section">
        <div className="veles-call">
          <div className="veles-call__text">
            <h2 className="veles-call__title">Назначить встречу с дизайнером</h2>
            <p className="veles-call__sub">
              Оставьте контакты — мы свяжемся, чтобы назначить встречу с
              дизайнером и обсудить ваш проект.
            </p>
          </div>
          <LeadModal
            {...VELES_MODAL}
            triggerLabel="Оставить заявку"
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

export default VelesPage;
