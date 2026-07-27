import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Indicator, PriceBlock, Tag } from "@/components/ui/primitives";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { Wishlist } from "@/components/ui/Wishlist";
import { Comparison } from "@/components/ui/Comparison";

/* --- Brand Logo Card --- */
export type BrandCardProps = {
  src: string;
  alt: string;
  className?: string;
};
export function BrandCard({ src, alt, className }: BrandCardProps) {
  return (
    <div className={cn("brand-card", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </div>
  );
}

/* --- Body Logo Card --- */
export type BodyCardProps = {
  label: string;
  src: string;
  className?: string;
};
export function BodyCard({ label, src, className }: BodyCardProps) {
  return (
    <div className={cn("body-card", className)}>
      <span className="body-card__label">{label}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="body-card__img" src={src} alt={label} />
    </div>
  );
}

/* --- Car Card (композиция компонентов кита) --- */
export type CarCardProps = {
  brandLogo: string;
  brandName?: string;
  title: string;
  status: {
    type: "success" | "warning" | "error" | "info";
    label: string;
  };
  tags: string[];
  photo: string;
  photoAlt?: string;
  price: ReactNode;
  priceLabel?: string;
  action: { label: string; variant: ButtonVariant };
  className?: string;
};
export function CarCard({
  brandLogo,
  brandName = "",
  title,
  status,
  tags,
  photo,
  photoAlt,
  price,
  priceLabel,
  action,
  className,
}: CarCardProps) {
  return (
    <div className={cn("car-card", className)}>
      <div className="car-card__main">
        <div className="car-card__content">
          <div className="car-card__top">
            <div className="car-card__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brandLogo} alt={brandName} />
            </div>
            <div className="car-card__actions">
              <Wishlist tip="В избранное" />
              <Comparison tip="В сравнение" />
            </div>
          </div>

          <div className="car-card__info">
            <div className="car-card__title">{title}</div>
            <Indicator status={status.type}>{status.label}</Indicator>
            <div className="car-card__tags">
              {tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>

        <div className="car-card__photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={photoAlt ?? title} />
        </div>
      </div>

      <div className="car-card__action">
        <PriceBlock label={priceLabel} value={price} />
        <Button variant={action.variant} size="m">
          {action.label}
        </Button>
      </div>
    </div>
  );
}
