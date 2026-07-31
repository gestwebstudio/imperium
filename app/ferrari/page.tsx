import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые Ferrari в наличии в Москве — Imperium Motors",
  description:
    "Купить новый Ferrari в Москве: премиальные модели Ferrari в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function Page() {
  return (
    <CollectionPage
      title="Новые Ferrari в наличии в Москве"
      crumbLabel="Ferrari"
      cars={getCarsForBrand("Ferrari")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(0, 8)}
      excludeBrand="Ferrari"
    />
  );
}
