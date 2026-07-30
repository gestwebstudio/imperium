import type { CSSProperties } from "react";
import { BrandCard } from "@/components/cards/cards";

/**
 * Блок «бренды» для страниц-подборок по бренду — логотипы из ряда брендов
 * главной (второй блок). `exclude` убирает текущий бренд, остальные плитки
 * растягиваются на всю ширину контейнера.
 */
const BRANDS = [
  { name: "Mercedes-Benz", src: "/images/logo_brands/mercedes.webp" },
  { name: "BMW", src: "/images/logo_brands/bmw.webp" },
  { name: "Lexus", src: "/images/logo_brands/lexus.webp" },
  { name: "Ferrari", src: "/images/logo_brands/ferrari.webp" },
  { name: "Rolls-Royce", src: "/images/logo_brands/rollsroyce.webp" },
  { name: "Audi", src: "/images/logo_brands/audi.webp" },
];

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
