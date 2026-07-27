import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CloseIcon } from "@/components/icons";

/* ============================================================
   Презентационные примитивы кита (без состояния — server components).
   Классы — из styles/components.css.
   ============================================================ */

/* --- Bubble --- */
export type BubbleProps = {
  size?: "s" | "m" | "l";
  color?: "white" | "green-200" | "green-500" | "taupe-400";
  className?: string;
  children: ReactNode;
};
export function Bubble({
  size = "m",
  color = "green-500",
  className,
  children,
}: BubbleProps) {
  return (
    <span className={cn("bubble", `bubble--${size}`, `bubble--${color}`, className)}>
      {children}
    </span>
  );
}

/* --- Badge --- */
export type BadgeProps = {
  color?: "info" | "success" | "warning" | "error";
  variant?: "surface" | "outlined";
  className?: string;
  children: ReactNode;
};
export function Badge({
  color = "info",
  variant = "surface",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        `badge--${color}`,
        variant === "outlined" && "badge--outlined",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --- Tag --- */
export type TagProps = {
  variant?: "card" | "filter";
  className?: string;
  children: ReactNode;
};
export function Tag({ variant = "card", className, children }: TagProps) {
  if (variant === "filter") {
    return (
      <span className={cn("tag tag--filter", className)}>
        {children}
        <span className="tag__close">
          <CloseIcon />
        </span>
      </span>
    );
  }
  return <span className={cn("tag tag--card", className)}>{children}</span>;
}

/* --- Indicator --- */
export type IndicatorProps = {
  status?: "success" | "warning" | "error" | "info";
  className?: string;
  children: ReactNode;
};
export function Indicator({
  status = "success",
  className,
  children,
}: IndicatorProps) {
  return (
    <span className={cn("indicator", `indicator--${status}`, className)}>
      <span className="indicator__dot" />
      {children}
    </span>
  );
}

/* --- Tooltip (визуальный специмен; интерактивный — через HeroUI) --- */
export type TooltipProps = {
  size?: "s" | "l";
  className?: string;
  children: ReactNode;
};
export function Tooltip({ size = "s", className, children }: TooltipProps) {
  return (
    <span className={cn("tooltip", `tooltip--${size}`, className)}>{children}</span>
  );
}

/* --- Slider (трек прогресса; 0–100) --- */
export type SliderProps = {
  value?: number;
  className?: string;
};
export function Slider({ value = 0, className }: SliderProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("ui-progress", className)}>
      <div
        className="ui-progress__fill"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* --- Price Block --- */
export type PriceBlockProps = {
  label?: string;
  value: ReactNode;
  className?: string;
};
export function PriceBlock({
  label = "Стоимость автомобиля",
  value,
  className,
}: PriceBlockProps) {
  return (
    <div className={cn("price-block", className)}>
      <span className="price-block__label">{label}</span>
      <span className="price-block__value">{value}</span>
    </div>
  );
}
