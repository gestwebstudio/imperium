import type { CSSProperties } from "react";
import { BrandCard } from "@/components/cards/cards";
import { BRANDS_LOGOS as BRANDS } from "@/lib/cars";

/**
 * Блок «бренды» для страниц-подборок по бренду — логотипы из ряда брендов
 * главной (те же 15 брендов из logo_cards). `exclude` убирает текущий бренд,
 * остальные плитки растягиваются на всю ширину контейнера.
 */
export type BrandsNavProps = {
  /** Имя бренда, который нужно скрыть (текущий бренд подборки). */
  exclude?: string;
};

export function BrandsNav({ exclude }: BrandsNavProps) {
  const items = BRANDS.filter((b) => b.name !== exclude);

  return (
    <section className="home-wrap brands-nav">
      <div
        className="brands-nav__grid"
        style={{ "--cols": items.length } as CSSProperties}
      >
        {items.map((b) => (
          <BrandCard key={b.name} src={b.src} alt={b.name} />
        ))}
      </div>
    </section>
  );
}

export default BrandsNav;
