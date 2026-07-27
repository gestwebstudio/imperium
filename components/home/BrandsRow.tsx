import { BrandCard } from "@/components/cards/cards";

const brands: [string, string][] = [
  ["BMW", "/images/logo_brands/bmw.webp"],
  ["Mercedes-Benz", "/images/logo_brands/mercedes.webp"],
  ["Rolls-Royce", "/images/logo_brands/rollsroyce.webp"],
  ["Lexus", "/images/logo_brands/lexus.webp"],
  ["Ferrari", "/images/logo_brands/ferrari.webp"],
];

export function BrandsRow() {
  return (
    <section className="home-wrap">
      <div className="brands-row">
        {brands.map(([name, src]) => (
          <BrandCard key={name} src={src} alt={name} />
        ))}
      </div>
    </section>
  );
}
