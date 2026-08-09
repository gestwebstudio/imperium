import type { Metadata } from "next";
import { FavoritesClient } from "@/components/favorites/FavoritesClient";
import "./favorites.css";

export const metadata: Metadata = {
  title: "Избранное — Imperium Motors",
  description: "Сохранённые автомобили Imperium Motors.",
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
