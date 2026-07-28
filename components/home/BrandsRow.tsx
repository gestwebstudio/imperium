import { BrandCard } from "@/components/cards/cards";

const brands = [
  {
    name: "Mercedes-Benz",
    src: "/images/logo_brands/mercedes.webp",
    className: "brand-card--mercedes",
  },
  {
    name: "BMW",
    src: "/images/logo_brands/bmw.webp",
    className: "brand-card--bmw",
  },
  {
    name: "Lexus",
    src: "/images/logo_brands/lexus.webp",
    className: "brand-card--lexus",
  },
  {
    name: "Ferrari",
    src: "/images/logo_brands/ferrari.webp",
    className: "brand-card--ferrari",
  },
  {
    name: "Rolls-Royce",
    src: "/images/logo_brands/rollsroyce.webp",
    className: "brand-card--rollsroyce",
  },
];

export function BrandsRow() {
  return (
    <section className="home-wrap brands">
      <div className="brands-row">
        {brands.map(({ name, src, className }) => (
          <BrandCard
            key={name}
            src={src}
            alt={name}
            className={className}
          />
        ))}
      </div>
    </section>
  );
}
