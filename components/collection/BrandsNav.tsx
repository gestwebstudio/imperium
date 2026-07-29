import type { CSSProperties } from "react";
import { BrandCard } from "@/components/cards/cards";

/**
 * Блок «бренды» для страниц-подборок по бренду — логотипы из ряда брендов
 * главной (второй блок). `exclude` убирает текущий бренд, остальные плитки
 * растягиваются на всю ширину контейнера.
 */
const BRANDS = [
  { name: "Mercedes-Benz", src: "/images/logo_brands/mercedes.webp", className: "brand-card--mercedes" },
  { name: "BMW", src: "/images/logo_brands/bmw.webp", className: "brand-card--bmw" },
  { name: "Lexus", src: "/images/logo_brands/lexus.webp", className: "brand-card--lexus" },
  { name: "Ferrari", src: "/images/logo_brands/ferrari.webp", className: "brand-card--ferrari" },
  { name: "Rolls-Royce", src: "/images/logo_brands/rollsroyce.webp", className: "brand-card--rollsroyce" },
  { name: "Audi", src: "/images/logo_brands/audi.webp", className: "brand-card--audi" },
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
          <BrandCard key={b.name} src={b.src} alt={b.name} className={b.className} />
        ))}
      </div>
    </section>
  );
}

export default BrandsNav;
