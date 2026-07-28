import { ArrowDiagonalIcon, ArrowIcon } from "@/components/icons";
import { ServiceCards } from "@/components/ServiceCards";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

function SvcCard({
  title,
  image,
  text,
  className,
}: {
  title: string;
  image: string;
  text: string;
  className?: string;
}) {
  return (
    <article className={cn("svc-card", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="svc-card__img" src={image} alt={title} />
      <div className="svc-card__body">
        <div className="svc-card__head">
          <h3 className="svc-card__title">{title}</h3>
          <span className="svc-card__arrow">
            <ArrowDiagonalIcon />
          </span>
        </div>
        <p className="svc-card__text">{text}</p>
      </div>
    </article>
  );
}

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
        <SvcCard
          className="svc-card--atelier"
          title="Ателье персонализации"
          image="/images/services/atelie.webp"
          text="Защита бронепленкой, смена цвета автомобиля, апгрейд мультимедиа, подбор дисков — всё в одном месте."
        />
        <SvcCard
          className="svc-card--selection"
          title="Индивидуальный подбор"
          image="/images/services/podbor.webp"
          text="Мы находим редкие комплектации и привозим автомобили под заказ со всего мира."
        />
        <SvcCard
          className="svc-card--veles"
          title="Дизайн с Александром Велесом"
          image="/images/services/veles.webp"
          text="Авторская концепция экстерьера вашего автомобиля: уникальный дизайн, который делает автомобиль продолжением вас."
        />
      </div>

      <div className="about__testimonial">
        <div className="about__testi-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/reviews/review1.webp" alt="Отзыв клиента" />
        </div>
        <div className="about__testi-body">
          <h3 className="about__testi-title">
            <span className="reg">Выбор, </span>
            <span className="bold">которым делятся</span>
          </h3>
          <div className="about__testi-quote">
            <div className="about__testi-author">
              <b>Михаил</b>
              <span>BMW 7 Series</span>
            </div>
            <p className="about__testi-text">
              «Искал автомобиль без компромиссов по комплектации и состоянию.
              Команда быстро поняла задачу, предложила несколько точных вариантов
              и полностью взяла на себя сопровождение сделки. В результате я
              получил именно тот автомобиль, который хотел.»
            </p>
          </div>
          <div className="about__testi-nav">
            <Button bare aria-label="Предыдущий отзыв">
              <ArrowIcon />
            </Button>
            <Button bare className="next" aria-label="Следующий отзыв">
              <ArrowIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
