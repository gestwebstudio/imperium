import { ServiceImageCard } from "@/components/cards/cards";
import { ServiceCards } from "@/components/ServiceCards";
import { Testimonials } from "@/components/home/Testimonials";

export function About() {
  return (
    <section className="home-wrap about">
      <ServiceCards />

      <div className="about__identity">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="about__wordmark-bg" src="/images/logo_head.svg" alt="" aria-hidden="true" />
        <p className="about__lead">
          <span className="reg">
            От доработки серийных моделей до поиска редких экземпляров —{" "}
          </span>
          <span className="bold">
            воплощаем индивидуальный подход в каждой детали
          </span>
        </p>
        <ServiceImageCard
          className="svc-card--atelier"
          title="Ателье персонализации"
          image="/images/services/atelie.webp"
          href="/atelier"
          text="Защита бронепленкой, смена цвета автомобиля, апгрейд мультимедиа, подбор дисков — всё в одном месте."
        />
        <ServiceImageCard
          className="svc-card--selection"
          title="Индивидуальный подбор"
          image="/images/services/podbor.webp"
          href="/car-selection"
          text="Мы находим редкие комплектации и привозим автомобили под заказ со всего мира."
        />
        <ServiceImageCard
          className="svc-card--veles"
          title="Дизайн с Александром Велесом"
          image="/images/services/veles.webp"
          text="Авторская концепция экстерьера вашего автомобиля: уникальный дизайн, который делает автомобиль продолжением вас."
        />
      </div>

      <Testimonials />
    </section>
  );
}
