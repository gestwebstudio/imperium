import type { Metadata } from "next";
import { ComparisonClient } from "@/components/comparison/ComparisonClient";
import { getAllCars } from "@/lib/cars";
import "./comparison.css";

export const metadata: Metadata = {
  title: "Сравнение автомобилей — Imperium Motors",
  description: "Сравнение характеристик выбранных автомобилей.",
};

export default function ComparisonPage() {
  return <ComparisonClient cars={getAllCars()} />;
}
