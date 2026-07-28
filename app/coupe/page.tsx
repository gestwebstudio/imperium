import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBody } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые купе в наличии в Москве — Imperium Motors",
  description:
    "Купить новое купе в Москве: премиальные купе в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function CoupePage() {
  return (
    <CollectionPage
      title="Новые купе в наличии в Москве"
      crumbLabel="Купе"
      cars={getCarsForBody("Купе")}
      hiddenFacets={["body"]}
      viewed={getCars().slice(16, 24)}
      excludeBody="КУПЕ"
    />
  );
}
