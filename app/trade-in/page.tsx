import type { Metadata } from "next";
import "../home.css";
import "./trade-in.css";
import { getCars } from "@/lib/cars";
import { TradeInPage } from "@/components/tradein/TradeInPage";

export const metadata: Metadata = {
  title: "Trade-in в Москве — обмен автомобиля с зачётом | Imperium Motors",
  description:
    "Trade-in в Imperium Motors: экспресс-оценка по фото и VIN, прозрачная финальная цена, зачёт стоимости в счёт нового автомобиля. Сопровождение сделки на всех этапах.",
};

export default function Page() {
  return <TradeInPage cars={getCars().slice(0, 8)} />;
}
