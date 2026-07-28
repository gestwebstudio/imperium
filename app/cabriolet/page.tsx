import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBody } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые кабриолеты в наличии в Москве — Imperium Motors",
  description:
    "Купить новый кабриолет в Москве: премиальные кабриолеты в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function CabrioletPage() {
  return (
    <CollectionPage
      title="Новые кабриолеты в наличии в Москве"
      crumbLabel="Кабриолеты"
      cars={getCarsForBody("Кабриолет")}
      hiddenFacets={["body"]}
      viewed={getCars().slice(16, 24)}
      excludeBody="КАБРИОЛЕТ"
    />
  );
}
