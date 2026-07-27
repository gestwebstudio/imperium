"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary-surface"
  | "primary-flat"
  | "primary-outlined"
  | "primary-cta"
  | "secondary-surface"
  | "secondary-flat"
  | "secondary-outlined";

type CommonButtonProps = {
  size?: "s" | "m" | "l";
  variant?: ButtonVariant;
  inverse?: boolean;
  iconOnly?: boolean;
  /** Только Ripple-ядро кита; внешний вид задаёт специализированный класс. */
  bare?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Произвольный элемент-потомок после текста (например, Bubble-счётчик). */
  endSlot?: ReactNode;
  /** Круглая иконка справа для варианта primary-cta. */
  ctaIcon?: ReactNode;
  children?: ReactNode;
};

export type ButtonProps = CommonButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonLinkProps = CommonButtonProps &
  Omit<ComponentProps<typeof Link>, "children" | "className" | "onClick"> & {
    className?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  };

function addRipple(
  target: HTMLElement,
  clientX: number,
  clientY: number,
) {
  const layer = target.querySelector<HTMLElement>(
    ":scope > .ui-button__ripple-layer",
  );
  if (!layer) return;

  const circle = document.createElement("span");
  const diameter = Math.max(target.clientWidth, target.clientHeight);
  const radius = diameter / 2;
  const rect = target.getBoundingClientRect();
  const keyboardClick = clientX === 0 && clientY === 0;
  const x = keyboardClick ? rect.left + rect.width / 2 : clientX;
  const y = keyboardClick ? rect.top + rect.height / 2 : clientY;

  circle.className = "ripple";
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${x - rect.left - radius}px`;
  circle.style.top = `${y - rect.top - radius}px`;

  layer.querySelector(".ripple")?.remove();
  layer.appendChild(circle);
  circle.addEventListener("animationend", () => circle.remove());
}

export function handleButtonRipplePointerDown<T extends HTMLElement>(
  e: PointerEvent<T>,
) {
  addRipple(e.currentTarget, e.clientX, e.clientY);
}

export function ButtonRippleLayer() {
  return <span className="ui-button__ripple-layer" aria-hidden="true" />;
}

function getButtonClassName({
  size,
  variant,
  inverse,
  iconOnly,
  bare,
  className,
}: {
  size: NonNullable<CommonButtonProps["size"]>;
  variant: ButtonVariant;
  inverse?: boolean;
  iconOnly?: boolean;
  bare?: boolean;
  className?: string;
}) {
  const isCta = variant === "primary-cta";

  return cn(
    "ui-button",
    !bare && "btn",
    !bare && !isCta && `btn--${size}`,
    !bare && `btn--${variant}`,
    !bare && inverse && "btn--inverse",
    !bare && iconOnly && "btn--icon",
    bare && "ui-button--bare",
    className,
  );
}

function ButtonContent({
  bare,
  startIcon,
  children,
  endSlot,
  endIcon,
  ctaIcon,
  isCta,
}: CommonButtonProps & { isCta: boolean }) {
  return (
    <>
      <ButtonRippleLayer />
      {startIcon &&
        (bare ? startIcon : <span className="btn__icon">{startIcon}</span>)}
      {children != null && (bare ? children : <span>{children}</span>)}
      {endSlot}
      {endIcon &&
        (bare ? endIcon : <span className="btn__icon">{endIcon}</span>)}
      {isCta && ctaIcon && <span className="btn__cta-icon">{ctaIcon}</span>}
    </>
  );
}

/** Кнопка кита с эффектом ripple (порт scripts/ripple.js). */
export function Button({
  size = "m",
  variant = "primary-surface",
  inverse,
  iconOnly,
  bare,
  startIcon,
  endIcon,
  endSlot,
  ctaIcon,
  className,
  children,
  onClick,
  onPointerDown,
  type = "button",
  ...rest
}: ButtonProps) {
  const isCta = variant === "primary-cta";

  function handlePointerDown(e: PointerEvent<HTMLButtonElement>) {
    handleButtonRipplePointerDown(e);
    onPointerDown?.(e);
  }

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (e.detail === 0) addRipple(e.currentTarget, e.clientX, e.clientY);
    onClick?.(e);
  }

  return (
    <button
      type={type}
      className={getButtonClassName({
        size,
        variant,
        inverse,
        iconOnly,
        bare,
        className,
      })}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...rest}
    >
      <ButtonContent
        bare={bare}
        startIcon={startIcon}
        endIcon={endIcon}
        endSlot={endSlot}
        ctaIcon={ctaIcon}
        isCta={isCta}
      >
        {children}
      </ButtonContent>
    </button>
  );
}

/** Ссылочная кнопка кита с теми же вариантами и Ripple. */
export function ButtonLink({
  size = "m",
  variant = "primary-surface",
  inverse,
  iconOnly,
  bare,
  startIcon,
  endIcon,
  endSlot,
  ctaIcon,
  className,
  children,
  onClick,
  onPointerDown,
  ...rest
}: ButtonLinkProps) {
  const isCta = variant === "primary-cta";
  const classNames = getButtonClassName({
    size,
    variant,
    inverse,
    iconOnly,
    bare,
    className,
  });

  function handlePointerDown(e: PointerEvent<HTMLAnchorElement>) {
    handleButtonRipplePointerDown(e);
    onPointerDown?.(e);
  }

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.detail === 0) addRipple(e.currentTarget, e.clientX, e.clientY);
    onClick?.(e);
  }

  const content = (
    <ButtonContent
      bare={bare}
      startIcon={startIcon}
      endIcon={endIcon}
      endSlot={endSlot}
      ctaIcon={ctaIcon}
      isCta={isCta}
    >
      {children}
    </ButtonContent>
  );

  const nativeHref =
    typeof rest.href === "string" &&
    /^(#|tel:|mailto:|https?:)/.test(rest.href);

  if (nativeHref) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    return (
      <a
        {...anchorProps}
        className={classNames}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      className={classNames}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...rest}
    >
      {content}
    </Link>
  );
}
