import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые Volvo в наличии в Москве — Imperium Motors",
  description:
    "Купить новый Volvo в Москве: премиальные модели Volvo в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function Page() {
  return (
    <CollectionPage
      title="Новые Volvo в наличии в Москве"
      crumbLabel="Volvo"
      cars={getCarsForBrand("Volvo")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(0, 8)}
      excludeBrand="Volvo"
    />
  );
}
