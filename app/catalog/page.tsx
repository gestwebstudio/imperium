import type { Metadata } from "next";
import "./catalog.css";
import "../home.css";
import { getCars } from "@/lib/cars";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { TradeLeasing } from "@/components/catalog/TradeLeasing";
import { Podbor } from "@/components/catalog/Podbor";
import { CarsSection } from "@/components/home/CarsSection";
import { Contacts } from "@/components/home/Contacts";

export const metadata: Metadata = {
  title: "Каталог — Imperium Motors",
  description: "Каталог автомобилей в наличии с фильтрами и сортировкой.",
};

export default function CatalogPage() {
  const cars = getCars();
  return (
    <main className="catalog">
      <CatalogClient cars={cars} />
      <TradeLeasing />
      <Podbor />
      <CarsSection title="Просмотренные автомобили" cars={cars.slice(24, 26)} />
      <Contacts />
    </main>
  );
}
