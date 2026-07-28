import type { Metadata } from "next";
import { getAllCars } from "@/lib/cars";
import { FavoritesClient } from "@/components/favorites/FavoritesClient";
import "./favorites.css";

export const metadata: Metadata = {
  title: "Избранное — Imperium Motors",
  description: "Сохранённые автомобили Imperium Motors.",
};

export default function FavoritesPage() {
  return <FavoritesClient cars={getAllCars()} />;
}
