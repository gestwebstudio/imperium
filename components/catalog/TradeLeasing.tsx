import { ArrowDiagonalIcon } from "@/components/icons";

/** Блок «Трейд-ин / Лизинг» — как на главной (стили из home.css). */
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

export function TradeLeasing() {
  return (
    <section className="home-wrap catalog-services">
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
    </section>
  );
}

export default TradeLeasing;
