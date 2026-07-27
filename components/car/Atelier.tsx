import { ArrowDiagonalIcon } from "@/components/icons";

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
        <article className="car-atelier__card" key={c.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="car-atelier__img" src={c.image} alt={c.title} />
          <div className="car-atelier__body">
            <div className="car-atelier__head">
              <h3 className="car-atelier__title">{c.title}</h3>
              <span className="car-atelier__arrow">
                <ArrowDiagonalIcon />
              </span>
            </div>
            <p className="car-atelier__text">{c.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Atelier;
