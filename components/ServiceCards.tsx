import { ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

const services = [
  {
    title: "Трейд-ин",
    text: "Сдайте свой автомобиль в хорошие руки. Честная оценка, быстрое оформление, зачёт в счёт нового авто",
    action: "Оценить автомобиль",
  },
  {
    title: "Лизинг",
    text: "Программы для бизнеса с оптимизацией налогов и комфортным графиком платежей – без заморозки капитала и с выкупом автомобиля на ваших условиях",
    action: "Рассчитать условия",
  },
];

export function ServiceCards() {
  return (
    <div className="about__services">
      {services.map((service) => (
        <ButtonLink
          bare
          href="#contacts"
          className="service-card"
          aria-label={`${service.title}: ${service.action}`}
          key={service.title}
        >
          <div className="service-card__content">
            <h3 className="service-card__title">{service.title}</h3>
            <p className="service-card__text">{service.text}</p>
          </div>
          <span className="service-card__action" aria-hidden="true">
            <span className="service-card__action-label">{service.action}</span>
            <span className="service-card__action-icon">
              <ArrowDiagonalIcon />
            </span>
          </span>
        </ButtonLink>
      ))}
    </div>
  );
}
