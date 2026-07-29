import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые Lexus в наличии в Москве — Imperium Motors",
  description:
    "Купить новый Lexus в Москве: премиальные модели Lexus в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function LexusPage() {
  return (
    <CollectionPage
      title="Новые Lexus в наличии в Москве"
      crumbLabel="Lexus"
      cars={getCarsForBrand("Lexus")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(16, 24)}
      excludeBrand="Lexus"
    />
  );
}
