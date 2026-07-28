import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars, getCarsForBody } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые внедорожники в наличии в Москве — Imperium Motors",
  description:
    "Купить новый внедорожник в Москве: премиальные внедорожники в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function OffRoadPage() {
  return (
    <CollectionPage
      title="Новые внедорожники в наличии в Москве"
      crumbLabel="Внедорожники"
      cars={getCarsForBody("Внедорожник")}
      hiddenFacets={["body"]}
      viewed={getCars().slice(16, 24)}
      excludeBody="ВНЕДОРОЖНИКИ"
    />
  );
}
