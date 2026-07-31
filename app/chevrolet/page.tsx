import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые Chevrolet в наличии в Москве — Imperium Motors",
  description:
    "Купить новый Chevrolet в Москве: премиальные модели Chevrolet в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function Page() {
  return (
    <CollectionPage
      title="Новые Chevrolet в наличии в Москве"
      crumbLabel="Chevrolet"
      cars={getCarsForBrand("Chevrolet")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(0, 8)}
      excludeBrand="Chevrolet"
    />
  );
}
