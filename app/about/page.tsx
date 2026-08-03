import type { Metadata } from "next";
import "../home.css";
import "./about.css";
import { AboutSalonPage } from "@/components/about/AboutSalonPage";

export const metadata: Metadata = {
  title: "О салоне — Imperium Motors",
  description:
    "Imperium Motors — салон премиальных автомобилей в Москве. Персональный подбор, проверенные автомобили, сопровождение сделки и услуги персонализации.",
};

export default function AboutPage() {
  return <AboutSalonPage />;
}
