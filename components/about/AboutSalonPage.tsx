import { AboutGallery } from "@/components/about/AboutGallery";
import { Contacts } from "@/components/home/Contacts";
import { Testimonials } from "@/components/home/Testimonials";
import { ButtonLink } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
import { Badge } from "@/components/ui/primitives";
import type { LightboxPhoto } from "@/components/car/PhotoLightbox";
import { getReviews } from "@/lib/reviews";

// Фото салона. В блоке видно первые 3, остальные — только в открытой галерее
// (позже сюда добавятся ещё кадры от заказчика).
const SALON_PHOTOS: LightboxPhoto[] = [
  {
    id: "salon-2",
    src: "/images/contacts/2.webp",
    alt: "Экспозиция автомобилей в салоне Imperium Motors",
  },
  {
    id: "salon-1",
    src: "/images/contacts/1.webp",
    alt: "Зона приёма гостей Imperium Motors",
  },
  {
    id: "salon-3",
    src: "/images/contacts/3.webp",
    alt: "Автомобиль в экспозиции Imperium Motors",
  },
];

const PRINCIPLES = [
  {
    number: "01",
    title: "Понимаем задачу",
    text: "Начинаем с диалога: как вы планируете использовать автомобиль, что для вас важно и какие компромиссы недопустимы.",
  },
  {
    number: "02",
    title: "Проверяем детали",
    text: "История, состояние, комплектация и документы проходят проверку до того, как автомобиль становится частью предложения.",
  },
  {
    number: "03",
    title: "Остаёмся рядом",
    text: "Сопровождаем оформление и выдачу, а после покупки помогаем с сервисом, персонализацией и дальнейшими вопросами.",
  },
] as const;

export async function AboutSalonPage() {
  const reviews = await getReviews();
  return (
    <main className="about-salon">
      <section className="about-salon__hero">
        <div className="home-wrap about-salon__hero-inner">
          <Crumbs
            items={[{ label: "Главная", href: "/" }, { label: "О салоне" }]}
          />

          <div className="about-salon__hero-head">
            <h1 className="about-salon__title">
              <span>Салон премиальных</span>
              <strong>автомобилей</strong>
            </h1>

            <div className="about-salon__hero-aside">
              <p>
                Imperium Motors — пространство для осознанного выбора автомобиля.
                Здесь редкие модели, персональный подход и понятный процесс
                соединяются в один спокойный клиентский опыт.
              </p>
              <ButtonLink href="#contacts" size="l" variant="primary-surface">
                Посетить салон
              </ButtonLink>
            </div>
          </div>

          <AboutGallery
            photos={SALON_PHOTOS}
            visibleCount={3}
            ariaLabel="Интерьер салона Imperium Motors"
          />
        </div>
      </section>

      <section className="home-wrap about-salon__story">
        <div className="about-salon__story-intro">
          <div>
            <h2 className="about-salon__section-title">
              Не просто продаём автомобили
            </h2>
          </div>
          <div className="about-salon__story-copy">
            <p>
              В салоне можно спокойно познакомиться с автомобилями, сравнить
              варианты и обсудить решение без давления и спешки.
            </p>
            <ButtonLink href="/catalog" size="l" variant="secondary-outlined">
              Смотреть автомобили
            </ButtonLink>
          </div>
        </div>

        <div className="about-salon__principles">
          {PRINCIPLES.map((principle) => (
            <article className="about-salon__principle" key={principle.number}>
              <Badge size="s" color="success" variant="outlined">
                {principle.number}
              </Badge>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Заглушка под видео о салоне — заменить на <video>/iframe. */}
      <section
        className="home-wrap about-salon__video-section"
        aria-label="Видео о салоне Imperium Motors"
      >
        <div className="about-salon__video" role="img" aria-label="Здесь будет видео о салоне Imperium Motors">
          <span className="about-salon__video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="about-salon__video-note">Видео о салоне</span>
        </div>
      </section>

      <section className="home-wrap about-salon__reviews" aria-label="Отзывы клиентов">
        <Testimonials reviews={reviews} />
      </section>

      <Contacts />
    </main>
  );
}

export default AboutSalonPage;
