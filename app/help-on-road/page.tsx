import type { Metadata } from "next";
import "../home.css";
import "../trade-in/trade-in.css";
import "../comparison/comparison.css";
import "../help-on-roads/help-roads.css";
import { HelpOnRoadPage } from "@/components/helproads/HelpOnRoadPage";

/* Приватная страница: ссылка только на картах в салоне, закрыта от индексации. */
export const metadata: Metadata = {
  title: "Программа помощи на дорогах — Imperium Motors",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function Page() {
  return <HelpOnRoadPage />;
}
