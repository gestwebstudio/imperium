import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые BMW в наличии в Москве — Imperium Motors",
  description:
    "Купить новый BMW в Москве: премиальные модели BMW в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function BmwPage() {
  return (
    <CollectionPage
      title="Новые BMW в наличии в Москве"
      crumbLabel="BMW"
      cars={getCarsForBrand("BMW")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(16, 24)}
      excludeBrand="BMW"
    />
  );
}
