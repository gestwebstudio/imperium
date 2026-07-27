import type { Metadata } from "next";
import "./catalog.css";
import { getCars } from "@/lib/cars";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Каталог — Imperium Motors",
  description: "Каталог автомобилей в наличии с фильтрами и сортировкой.",
};

export default function CatalogPage() {
  return <CatalogClient cars={getCars()} />;
}
