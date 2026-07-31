import type { Metadata } from "next";
import "../home.css";
import "../trade-in/trade-in.css";
import "./help-roads.css";
import { HelpRoadsPage } from "@/components/helproads/HelpRoadsPage";

export const metadata: Metadata = {
  title: "Помощь на дорогах 24/7 — выездной автосервис в Москве | Imperium Motors",
  description:
    "Круглосуточная техническая помощь на дороге и выездной автосервис в любой точке маршрута. Европейские стандарты помощи на российских дорогах. Звонок бесплатный.",
};

export default function Page() {
  return <HelpRoadsPage />;
}
