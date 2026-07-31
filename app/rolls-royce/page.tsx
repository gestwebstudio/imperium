import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые Rolls-Royce в наличии в Москве — Imperium Motors",
  description:
    "Купить новый Rolls-Royce в Москве: премиальные модели Rolls-Royce в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function Page() {
  return (
    <CollectionPage
      title="Новые Rolls-Royce в наличии в Москве"
      crumbLabel="Rolls-Royce"
      cars={getCarsForBrand("Rolls-Royce")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(0, 8)}
      excludeBrand="Rolls-Royce"
    />
  );
}
