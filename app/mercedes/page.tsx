import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBrand } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые Mercedes в наличии в Москве — Imperium Motors",
  description:
    "Купить новый Mercedes-Benz в Москве: премиальные модели Mercedes в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function MercedesPage() {
  return (
    <CollectionPage
      title="Новые Mercedes в наличии в Москве"
      crumbLabel="Mercedes"
      cars={getCarsForBrand("Mercedes-Benz")}
      hiddenFacets={["brand"]}
      viewed={getCars().slice(16, 24)}
      excludeBrand="Mercedes-Benz"
    />
  );
}
