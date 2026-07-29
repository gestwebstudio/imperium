import type { Metadata } from "next";
import "../home.css";
import "../trade-in/trade-in.css";
import "./leasing.css";
import { getCars } from "@/lib/cars";
import { LeasingPage } from "@/components/leasing/LeasingPage";

export const metadata: Metadata = {
  title: "Лизинг автомобиля в Москве — программы для физлиц, ИП и бизнеса | Imperium Motors",
  description:
    "Лизинг премиальных автомобилей в Imperium Motors: ставка от 5%, лимит до 30 млн ₽, срок 12–60 месяцев, одобрение 90% заявок. Прозрачные расчёты и полное сопровождение сделки.",
};

export default function Page() {
  return <LeasingPage cars={getCars().slice(0, 8)} />;
}
