import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые BYD в наличии в Москве — Imperium Motors",
  description:
    "Купить новый BYD в Москве: премиальные модели BYD в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function Page() {
  return (
    <CollectionPage
      title="Новые BYD в наличии в Москве"
      crumbLabel="BYD"
      cars={getCarsForBrand("BYD")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(0, 8)}
      excludeBrand="BYD"
    />
  );
}
