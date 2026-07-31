"use client";

import { Checkbox as HeroCheckbox } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CheckboxSize = "s" | "m";

export type CheckboxProps = Omit<
  ComponentProps<typeof HeroCheckbox.Root>,
  "children" | "className"
> & {
  size?: CheckboxSize;
  label: ReactNode;
  className?: string;
  contentClassName?: string;
};

/** HeroUI Checkbox с размерами и цветовыми токенами Imperium Motors. */
export function Checkbox({
  size = "m",
  label,
  className,
  contentClassName,
  ...props
}: CheckboxProps) {
  return (
    <HeroCheckbox.Root
      {...props}
      className={cn("ui-checkbox", `ui-checkbox--${size}`, className)}
    >
      <HeroCheckbox.Content
        className={cn("ui-checkbox__content", contentClassName)}
      >
        <HeroCheckbox.Control className="ui-checkbox__control">
          <HeroCheckbox.Indicator className="ui-checkbox__indicator" />
        </HeroCheckbox.Control>
        <span className="ui-checkbox__label">{label}</span>
      </HeroCheckbox.Content>
    </HeroCheckbox.Root>
  );
}

export default Checkbox;
