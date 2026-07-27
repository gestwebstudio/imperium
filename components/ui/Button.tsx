"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary-surface"
  | "primary-flat"
  | "primary-outlined"
  | "primary-cta"
  | "secondary-surface"
  | "secondary-flat"
  | "secondary-outlined";

export type ButtonProps = {
  size?: "s" | "m" | "l";
  variant?: ButtonVariant;
  inverse?: boolean;
  iconOnly?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Произвольный элемент-потомок после текста (например, Bubble-счётчик). */
  endSlot?: ReactNode;
  /** Круглая иконка справа для варианта primary-cta. */
  ctaIcon?: ReactNode;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/** Кнопка кита с эффектом ripple (порт scripts/ripple.js). */
export function Button({
  size = "m",
  variant = "primary-surface",
  inverse,
  iconOnly,
  startIcon,
  endIcon,
  endSlot,
  ctaIcon,
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const isCta = variant === "primary-cta";

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    circle.className = "ripple";
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    const old = button.getElementsByClassName("ripple")[0];
    if (old) old.remove();
    button.appendChild(circle);
    circle.addEventListener("animationend", () => circle.remove());
    onClick?.(e);
  }

  return (
    <button
      className={cn(
        "btn",
        !isCta && `btn--${size}`,
        `btn--${variant}`,
        inverse && "btn--inverse",
        iconOnly && "btn--icon",
        className,
      )}
      onClick={handleClick}
      {...rest}
    >
      {startIcon && <span className="btn__icon">{startIcon}</span>}
      {children != null && <span>{children}</span>}
      {endSlot}
      {endIcon && <span className="btn__icon">{endIcon}</span>}
      {isCta && ctaIcon && <span className="btn__cta-icon">{ctaIcon}</span>}
    </button>
  );
}
