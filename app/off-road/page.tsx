import type { Metadata } from "next";
import "../catalog/catalog.css";
import "../home.css";
import { getCars } from "@/lib/cars";
import { CollectionPage } from "@/components/collection/CollectionPage";

export const metadata: Metadata = {
  title: "Новые внедорожники в наличии в Москве — Imperium Motors",
  description:
    "Купить новый внедорожник в Москве: премиальные внедорожники в наличии и под заказ. Подбор, трейд-ин, лизинг в Imperium Motors.",
};

export default function OffRoadPage() {
  const all = getCars();
  const cars = all.filter((c) => c.bodyType === "Внедорожник");
  const viewed = all.slice(16, 24);

  return (
    <CollectionPage
      title="Новые внедорожники в наличии в Москве"
      crumbLabel="Внедорожники"
      cars={cars}
      hiddenFacets={["body"]}
      viewed={viewed}
      excludeBody="ВНЕДОРОЖНИКИ"
    />
  );
}
