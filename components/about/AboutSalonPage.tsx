import { ServiceImageCard } from "@/components/cards/cards";
import { Contacts } from "@/components/home/Contacts";
import { Testimonials } from "@/components/home/Testimonials";
import { ServiceCards } from "@/components/ServiceCards";
import { ButtonLink } from "@/components/ui/Button";
import { Crumbs } from "@/components/ui/Crumbs";
import { Badge } from "@/components/ui/primitives";

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

export function AboutSalonPage() {
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

          <div className="about-salon__gallery" aria-label="Интерьер салона Imperium Motors">
            <figure className="about-salon__gallery-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/contacts/2.webp"
                alt="Экспозиция автомобилей в салоне Imperium Motors"
              />
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/contacts/1.webp"
                alt="Зона приёма гостей Imperium Motors"
              />
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/contacts/3.webp"
                alt="Автомобиль в экспозиции Imperium Motors"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="home-wrap about-salon__story">
        <div className="about-salon__story-intro">
          <div>
            <p className="about-salon__eyebrow">Наш подход</p>
            <h2 className="about-salon__section-title">
              Не просто продаём автомобили
            </h2>
          </div>
          <div className="about-salon__story-copy">
            <p>
              Мы создаём прозрачный путь к автомобилю, который соответствует
              вашему образу жизни, характеру и ожиданиям. Команда берёт на себя
              сложные этапы — от поиска и проверки до оформления и подготовки к
              выдаче.
            </p>
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

      <section className="home-wrap about-salon__services" aria-labelledby="about-services-title">
        <div className="about-salon__section-head">
          <div>
            <p className="about-salon__eyebrow">Возможности</p>
            <h2 className="about-salon__section-title" id="about-services-title">
              Всё вокруг вашего автомобиля
            </h2>
          </div>
          <p className="about-salon__section-description">
            От финансовых программ и подбора до персонализации — одна команда
            сопровождает автомобиль на каждом этапе.
          </p>
        </div>

        <ServiceCards />

        <div className="about-salon__service-grid">
          <ServiceImageCard
            title="Ателье персонализации"
            image="/images/services/atelie.webp"
            text="Защита кузова, смена цвета, мультимедиа и подбор деталей — индивидуальная доработка автомобиля в одном месте."
          />
          <ServiceImageCard
            title="Индивидуальный подбор"
            image="/images/services/podbor.webp"
            text="Находим редкие комплектации и организуем поставку автомобиля под конкретный запрос."
            href="/car-selection"
          />
          <ServiceImageCard
            title="Авторский дизайн"
            image="/images/services/veles.webp"
            text="Создаём цельную концепцию экстерьера, которая делает автомобиль продолжением своего владельца."
          />
        </div>
      </section>

      <section className="home-wrap about-salon__reviews" aria-label="Отзывы клиентов">
        <Testimonials />
      </section>

      <Contacts />
    </main>
  );
}

export default AboutSalonPage;
