import { ArrowDiagonalIcon } from "@/components/icons";

/** Карточки услуг «Ателье» и «Дизайн с Велесом» — как на главной,
   в сетке 2×1 под ширину левой колонки страницы авто (макет 639:2698). */
const cards = [
  {
    title: "Ателье персонализации",
    image: "/images/services/atelie.webp",
    text: "Защита бронепленкой, смена цвета автомобиля, апгрейд мультимедиа, подбор дисков — всё в одном месте.",
  },
  {
    title: "Дизайн с Александром Велесом",
    image: "/images/services/veles.webp",
    text: "Авторская концепция экстерьера вашего автомобиля: уникальный дизайн, который делает автомобиль продолжением вас.",
  },
];

export function Atelier() {
  return (
    <div className="car-atelier">
      {cards.map((c) => (
        <article className="svc-card" key={c.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="svc-card__img" src={c.image} alt={c.title} />
          <div className="svc-card__body">
            <div className="svc-card__head">
              <h3 className="svc-card__title">{c.title}</h3>
              <span className="svc-card__arrow">
                <ArrowDiagonalIcon />
              </span>
            </div>
            <p className="svc-card__text">{c.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Atelier;
