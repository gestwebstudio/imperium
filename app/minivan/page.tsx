import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBody } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые минивэны в наличии в Москве — Imperium Motors",
  description:
    "Купить новый минивэн в Москве: премиальные минивэны в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function MinivanPage() {
  return (
    <CollectionPage
      title="Новые минивэны в наличии в Москве"
      crumbLabel="Минивэны"
      cars={getCarsForBody("Минивэн")}
      hiddenFacets={["body"]}
      viewed={getCars().slice(16, 24)}
      excludeBody="МИНИВЭНЫ"
    />
  );
}
