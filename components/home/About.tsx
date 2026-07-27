import { ArrowDiagonalIcon, ArrowIcon } from "@/components/icons";

const services = [
  {
    title: "Трейд-ин",
    text: "Сдайте свой автомобиль в хорошие руки. Честная оценка, быстрое оформление, зачёт в счёт нового авто",
  },
  {
    title: "Лизинг",
    text: "Программы для бизнеса с оптимизацией налогов и комфортным графиком платежей – без заморозки капитала и с выкупом автомобиля на ваших условиях",
  },
];

export function About() {
  return (
    <section className="home-wrap about">
      <div className="about__services">
        {services.map((s) => (
          <div className="service-card" key={s.title}>
            <span className="service-card__arrow">
              <ArrowDiagonalIcon />
            </span>
            <h3 className="service-card__title">{s.title}</h3>
            <p className="service-card__text">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="about__statement">
        <p className="about__lead">
          <span className="reg">
            От доработки серийных моделей до поиска редких экземпляров —{" "}
          </span>
          <span className="bold">
            воплощаем индивидуальный подход в каждой детали
          </span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="about__wordmark"
          src="/images/logo_head.svg"
          alt="Imperium Motors"
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
            <button aria-label="Предыдущий отзыв">
              <ArrowIcon />
            </button>
            <button className="next" aria-label="Следующий отзыв">
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
