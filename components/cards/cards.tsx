import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Indicator, PriceBlock, Tag } from "@/components/ui/primitives";
import {
  Button,
  ButtonLink,
  type ButtonVariant,
} from "@/components/ui/Button";
import { Wishlist } from "@/components/ui/Wishlist";
import { Comparison } from "@/components/ui/Comparison";
import { LeadModal } from "@/components/ui/LeadModal";
import { ArrowDiagonalIcon } from "@/components/icons";

/* --- Brand Logo Card --- */
export type BrandCardProps = {
  src: string;
  alt: string;
  href?: string;
  className?: string;
};
export function BrandCard({ src, alt, href, className }: BrandCardProps) {
  const image = (
    <div className="brand-card__image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </div>
  );
  return href ? (
    <Link className={cn("brand-card", className)} href={href} aria-label={alt}>
      {image}
    </Link>
  ) : (
    <div className={cn("brand-card", className)}>{image}</div>
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

/* --- Service Card with Image --- */
export type ServiceCardModal = {
  description: string;
  submitLabel?: string;
  successTitle?: string;
  successText?: string;
  comment?: boolean;
  commentLabel?: string;
  commentPlaceholder?: string;
};
export type ServiceImageCardProps = {
  title: string;
  image: string;
  text: string;
  href?: string;
  className?: string;
  /** Если задано — вся карточка открывает окно-заявку (заголовок окна = заголовок карточки). */
  modal?: ServiceCardModal;
};
export function ServiceImageCard({
  title,
  image,
  text,
  href = "#contacts",
  className,
  modal,
}: ServiceImageCardProps) {
  return (
    <article className={cn("image-service-card", className)}>
      {modal ? (
        <LeadModal
          overlayOnly
          overlayClassName="image-service-card__overlay-btn"
          overlayAriaLabel={title}
          triggerLabel={title}
          title={title}
          description={modal.description}
          submitLabel={modal.submitLabel ?? "Отправить заявку"}
          successTitle={modal.successTitle ?? "Заявка принята"}
          successText={
            modal.successText ??
            "Менеджер Imperium Motors свяжется с вами в ближайшее время."
          }
          comment={modal.comment}
          commentLabel={modal.commentLabel}
          commentPlaceholder={modal.commentPlaceholder}
        />
      ) : (
        <Link
          className="image-service-card__link"
          href={href}
          aria-label={`Подробнее: ${title}`}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="image-service-card__img" src={image} alt={title} />
      <div className="image-service-card__body">
        <div className="image-service-card__head">
          <h3 className="image-service-card__title">{title}</h3>
          <span
            className="image-service-card__arrow btn btn--l btn--icon btn--primary-outlined"
            aria-hidden="true"
          >
            <span className="btn__icon">
              <ArrowDiagonalIcon />
            </span>
          </span>
        </div>
        <p className="image-service-card__text">{text}</p>
      </div>
    </article>
  );
}

/* --- News Card --- */
export type NewsCardProps = {
  date: string;
  dateTime?: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  href: string;
  className?: string;
};
export function NewsCard({
  date,
  dateTime,
  title,
  description,
  image,
  imageAlt,
  href,
  className,
}: NewsCardProps) {
  return (
    <article className={cn("news-card", className)}>
      <div className="news-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={imageAlt ?? title} />
      </div>

      <div className="news-card__content">
        <time className="news-card__date" dateTime={dateTime}>
          {date}
        </time>
        <div className="news-card__heading">
          <h3 className="news-card__title">{title}</h3>
          <div className="news-card__action-wrap">
            <ButtonLink
              href={href}
              size="s"
              variant="primary-outlined"
              iconOnly
              startIcon={<ArrowDiagonalIcon />}
              className="news-card__action"
              aria-label={`Читать новость: ${title}`}
            />
          </div>
        </div>
        <p className="news-card__description">{description}</p>
      </div>
    </article>
  );
}

/* --- Car Card (композиция компонентов кита) --- */
export type CarCardProps = {
  size?: "m" | "l";
  vehicleId?: string;
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
  /** Заменяет кнопку действия (например, окно-заявка для авто без страницы). */
  actionSlot?: ReactNode;
  comparisonEnabled?: boolean;
  href?: string;
  className?: string;
};
export function CarCard({
  size = "l",
  vehicleId,
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
  actionSlot,
  comparisonEnabled = true,
  href,
  className,
}: CarCardProps) {
  return (
    <div className={cn("car-card", `car-card--${size}`, className)}>
      {href && (
        <Link
          className="car-card__link"
          href={href}
          aria-label={`Открыть страницу ${title}`}
        />
      )}

      <div className="car-card__main">
        <div className="car-card__content">
          <div className="car-card__top">
            <div className="car-card__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brandLogo} alt={brandName} />
            </div>
            <div className="car-card__actions">
              <Wishlist vehicleId={vehicleId} tip="В избранное" />
              {comparisonEnabled && (
                <Comparison vehicleId={vehicleId} tip="В сравнение" />
              )}
            </div>
          </div>

          <div className="car-card__info">
            <div className="car-card__title">{title}</div>
            <Indicator size={size} status={status.type}>
              {status.label}
            </Indicator>
            <div className="car-card__tags">
              {tags.map((t) => (
                <Tag key={t} size={size}>
                  {t}
                </Tag>
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
        <PriceBlock size={size} label={priceLabel} value={price} />
        {actionSlot ? (
          actionSlot
        ) : href ? (
          <ButtonLink
            href={href}
            size={size === "m" ? "s" : "m"}
            variant={action.variant}
            endIcon={<ArrowDiagonalIcon className="car-card__details-icon" />}
            className="car-card__details-link"
          >
            {action.label}
          </ButtonLink>
        ) : (
          <Button
            variant={action.variant}
            size={size === "m" ? "s" : "m"}
            endIcon={<ArrowDiagonalIcon className="car-card__details-icon" />}
            className="car-card__details-link"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
