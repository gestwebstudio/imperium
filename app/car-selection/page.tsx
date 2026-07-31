import type { Metadata } from "next";
import "../home.css";
import "../trade-in/trade-in.css";
import "./car-selection.css";
import { CarSelectionPage } from "@/components/carselection/CarSelectionPage";

export const metadata: Metadata = {
  title: "Авто под заказ в Москве — подбор и поставка из-за рубежа | Imperium Motors",
  description:
    "Автомобиль под заказ в Imperium Motors: подбор под индивидуальный запрос, легальная поставка из Европы, Кореи, Китая, США. Полностью растаможен, ЭПТС, сопровождение сделки на всех этапах.",
};

export default function Page() {
  return <CarSelectionPage />;
}
