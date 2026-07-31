import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые Hyundai в наличии в Москве — Imperium Motors",
  description:
    "Купить новый Hyundai в Москве: премиальные модели Hyundai в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function Page() {
  return (
    <CollectionPage
      title="Новые Hyundai в наличии в Москве"
      crumbLabel="Hyundai"
      cars={getCarsForBrand("Hyundai")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(0, 8)}
      excludeBrand="Hyundai"
    />
  );
}
