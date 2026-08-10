"use client";

import { Skeleton } from "@heroui/react";
import { cn } from "@/lib/cn";

export type CarCardSkeletonProps = {
  size?: "m" | "l";
  variant?: "default" | "comparison";
  className?: string;
};

/**
 * Геометрический placeholder карточки автомобиля. Все анимированные блоки
 * остаются стандартными HeroUI Skeleton; компонент задаёт только композицию.
 */
export function CarCardSkeleton({
  size = "l",
  variant = "default",
  className,
}: CarCardSkeletonProps) {
  return (
    <article
      className={cn(
        "car-card",
        "car-card-skeleton",
        `car-card--${size}`,
        `car-card-skeleton--${size}`,
        variant === "comparison" && "car-card--comparison",
        variant === "comparison" && "car-card-skeleton--comparison",
        className,
      )}
      aria-hidden="true"
    >
      <div className="car-card__main car-card-skeleton__main">
        <div className="car-card__content">
          <div className="car-card__top">
            <Skeleton className="imperium-skeleton car-card-skeleton__brand" />
            <Skeleton className="imperium-skeleton car-card-skeleton__actions" />
          </div>

          <div className="car-card__info">
            <Skeleton className="imperium-skeleton car-card-skeleton__title" />
            <Skeleton className="imperium-skeleton car-card-skeleton__status" />
            <div className="car-card-skeleton__tags">
              <Skeleton className="imperium-skeleton car-card-skeleton__tag" />
              <Skeleton className="imperium-skeleton car-card-skeleton__tag car-card-skeleton__tag--wide" />
            </div>
          </div>
        </div>

        <Skeleton className="imperium-skeleton car-card__photo car-card-skeleton__photo" />
      </div>

      <div className="car-card__action car-card-skeleton__action">
        <div className="car-card-skeleton__price">
          <Skeleton className="imperium-skeleton car-card-skeleton__price-label" />
          <Skeleton className="imperium-skeleton car-card-skeleton__price-value" />
        </div>
        <Skeleton className="imperium-skeleton car-card-skeleton__button" />
      </div>
    </article>
  );
}

