import { ServiceImageCard } from "@/components/cards/cards";
import { Crumbs } from "@/components/ui/Crumbs";
import { ButtonLink } from "@/components/ui/Button";
import { LeadModal } from "@/components/ui/LeadModal";
import { Contacts } from "@/components/contacts/Contacts";
import { ProjectsRow } from "@/components/atelier/ProjectsRow";

const ATELIER_MODAL = {
  title: "Обсудить работу",
  description:
    "Оставьте контакты — специалист ателье свяжется с вами, чтобы обсудить проект и детали.",
  submitLabel: "Отправить заявку",
  successTitle: "Заявка принята",
  successText:
    "Специалист Imperium Motors свяжется с вами, чтобы обсудить ваш проект.",
  comment: true,
  commentLabel: "Опишите задачу",
  commentPlaceholder: "Что хотите сделать с автомобилем",
} as const;

export function AtelierPage() {
  return (
    <main className="atelier">
      {/* ---------- Hero — общий блок трейд-ина (.ti-hero*), без фото/видео.
          Идентичен герою велеса по размерам и адаптации. ---------- */}
      <section className="ti-hero atelier-hero">
        <div className="ti-hero__inner home-wrap">
          <Crumbs
            items={[{ label: "Главная", href: "/" }, { label: "Автоателье" }]}
          />
          <div className="ti-hero__top">
            <h1 className="ti-hero__title">
              <span className="reg">АВТОМОБИЛЬ,</span>
              <span className="bold">С ВАШИМ ХАРАКТЕРОМ</span>
            </h1>
            <div className="ti-hero__aside">
              <p className="ti-hero__sub">
                Стандартная комплектация — это только начало. Мы помогаем
                раскрыть индивидуальность вашего автомобиля.
              </p>
              <LeadModal
                {...ATELIER_MODAL}
                triggerLabel="Обсудить работу"
                triggerClassName="ti-hero__cta"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Второй блок — вордмарк + лид + 3 карточки (общий .about__identity
          с главной / велеса). Тексты, фото и модалки — со старой вёрстки. ---------- */}
      <section className="atelier-identity">
        <div className="about__identity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="about__wordmark-bg"
            src="/images/logo_head.svg"
            alt=""
            aria-hidden="true"
          />
          <p className="about__lead">
            <span className="reg">Точечные настройки функций</span>
            <br />
            <span className="bold">или комплексное преображение автомобиля</span>
          </p>
          <ServiceImageCard
            className="svc-card--atelier"
            title="Электроника и мультимедиа"
            image="/images/services/atelie1.webp"
            text="Современный автомобиль — это мощный цифровой центр. Мы адаптируем его под вас: язык, функции, интерфейсы."
            modal={{
              description:
                "Оставьте контакты — обсудим адаптацию электроники и мультимедиа вашего автомобиля.",
              successText: ATELIER_MODAL.successText,
              comment: true,
              commentLabel: ATELIER_MODAL.commentLabel,
              commentPlaceholder: ATELIER_MODAL.commentPlaceholder,
            }}
          />
          <ServiceImageCard
            className="svc-card--selection"
            title="Диски и обвесы"
            image="/images/services/atelie2.webp"
            text="Посадка и силуэт решают всё. Подбираем колёса и аэродинамические элементы."
            modal={{
              description:
                "Оставьте контакты — подберём диски и аэродинамический обвес для вашего автомобиля.",
              successText: ATELIER_MODAL.successText,
              comment: true,
              commentLabel: ATELIER_MODAL.commentLabel,
              commentPlaceholder: ATELIER_MODAL.commentPlaceholder,
            }}
          />
          <ServiceImageCard
            className="svc-card--veles"
            title="Защита кузова и смена цвета"
            image="/images/services/atelie3.webp"
            text="Сохраняем безупречный вид автомобиля или меняем его образ без покраски"
            modal={{
              description:
                "Оставьте контакты — обсудим защиту кузова или смену цвета вашего автомобиля.",
              successText: ATELIER_MODAL.successText,
              comment: true,
              commentLabel: ATELIER_MODAL.commentLabel,
              commentPlaceholder: ATELIER_MODAL.commentPlaceholder,
            }}
          />
        </div>
      </section>

      {/* ---------- Баннер «Дизайн с Александром Велесом» (макет 1245:5894).
          По сути блок «Александр Велес» с велеса, но без декоративных вордмарков
          и с двумя кнопками. Ссылки кнопок — со старой вёрстки. ---------- */}
      <section className="atelier-cta-section">
        <div className="atelier-cta">
          <div className="atelier-cta__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/services/veles.webp"
              alt="Дизайн автомобиля с Александром Велесом"
            />
          </div>
          <div className="atelier-cta__body">
            <div className="atelier-cta__text">
              <h2 className="atelier-cta__title">
                <span className="reg">Авторский дизайн</span>
                <span className="bold">Александра Велеса</span>
              </h2>
              <p className="atelier-cta__sub">
                Когда автомобиль должен отражать вашу индивидуальность. Именитый
                автодизайнер создает уникальную концепцию от эскиза до реализации
                — без шаблонов и компромиссов
              </p>
            </div>
            <div className="atelier-cta__actions">
              <LeadModal
                {...ATELIER_MODAL}
                triggerLabel="Обсудить работу"
                triggerVariant="primary-surface"
              />
              <ButtonLink href="/veles" size="l" variant="secondary-outlined">
                Подробнее об услуге
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Проекты (карусель) — пока не трогаем ---------- */}
      <ProjectsRow />

      {/* ---------- Контакты — с главной ---------- */}
      <Contacts />
    </main>
  );
}

export default AtelierPage;
