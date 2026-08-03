import type { Metadata } from "next";
import "../home.css";
import "./veles.css";
import { VelesPage } from "@/components/veles/VelesPage";

export const metadata: Metadata = {
  title:
    "Индивидуальный дизайн авто с Александром Велесом | Imperium Motors",
  description:
    "Авторский дизайн автомобиля от Александра Велеса: индивидуальный дизайн-код, авторская графика, брендирование и ливреи. Превращаем автомобиль в произведение искусства.",
};

export default function Page() {
  return <VelesPage />;
}
