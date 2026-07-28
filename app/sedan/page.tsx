import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBody } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые седаны в наличии в Москве — Imperium Motors",
  description:
    "Купить новый седан в Москве: премиальные седаны в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function SedanPage() {
  return (
    <CollectionPage
      title="Новые седаны в наличии в Москве"
      crumbLabel="Седаны"
      cars={getCarsForBody("Седан")}
      hiddenFacets={["body"]}
      viewed={getCars().slice(16, 24)}
      excludeBody="СЕДАНЫ"
    />
  );
}
