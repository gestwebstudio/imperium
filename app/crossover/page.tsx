import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBody } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые кроссоверы в наличии в Москве — Imperium Motors",
  description:
    "Купить новый кроссовер в Москве: премиальные кроссоверы в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function CrossoverPage() {
  return (
    <CollectionPage
      title="Новые кроссоверы в наличии в Москве"
      crumbLabel="Кроссоверы"
      cars={getCarsForBody("Кроссовер")}
      hiddenFacets={["body"]}
      viewed={getCars().slice(16, 24)}
      excludeBody="КРОССОВЕРЫ"
    />
  );
}
