import { ServiceImageCard } from "@/components/cards/cards";

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
        <ServiceImageCard {...c} key={c.title} />
      ))}
    </div>
  );
}

export default Atelier;
