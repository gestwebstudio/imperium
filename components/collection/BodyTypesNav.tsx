import type { CSSProperties } from "react";
import { BodyCard } from "@/components/cards/cards";

/**
 * Блок «типы кузова» для страниц-подборок — готовые плитки кита (BodyCard).
 * `exclude` убирает текущий тип (на странице внедорожников не показываем
 * «Внедорожники»), оставшиеся плитки растягиваются на всю ширину контейнера.
 */
const BODIES = [
  { label: "СЕДАНЫ", src: "/images/body_card/sedan.webp" },
  { label: "ВНЕДОРОЖНИКИ", src: "/images/body_card/off-road.webp" },
  { label: "КУПЕ", src: "/images/body_card/coupe.webp" },
  { label: "МИНИВЭНЫ", src: "/images/body_card/minivan.webp" },
  { label: "КРОССОВЕРЫ", src: "/images/body_card/crossover.webp" },
  { label: "КАБРИОЛЕТ", src: "/images/body_card/cabriolet.webp" },
];

export type BodyTypesNavProps = {
  /** Лейбл плитки, который нужно скрыть (текущий тип подборки). */
  exclude?: string;
};

export function BodyTypesNav({ exclude }: BodyTypesNavProps) {
  const items = BODIES.filter((b) => b.label !== exclude);

  return (
    <section className="home-wrap body-types-nav">
      <div
        className="body-types-nav__grid"
        style={{ "--cols": items.length } as CSSProperties}
      >
        {items.map((b) => (
          <BodyCard key={b.label} label={b.label} src={b.src} />
        ))}
      </div>
    </section>
  );
}

export default BodyTypesNav;
