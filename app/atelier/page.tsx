import type { Metadata } from "next";
import "../home.css";
import "./atelier.css";
import { AtelierPage } from "@/components/atelier/AtelierPage";

export const metadata: Metadata = {
  title: "Автоателье в Москве — тюнинг и персонализация | Imperium Motors",
  description:
    "Автоателье Imperium Motors: точечные настройки и комплексное преображение автомобиля — электроника и мультимедиа, диски и обвесы, защита кузова и смена цвета, авторский дизайн с Александром Велесом.",
};

export default function Page() {
  return <AtelierPage />;
}
