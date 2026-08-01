"use client";

import { Breadcrumbs } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };
export type CrumbsProps = {
  items: Crumb[];
  className?: string;
  /** Compact 10px variant is used by the 390px layouts. */
  compactOnMobile?: boolean;
};

/** Canonical project breadcrumbs built on top of HeroUI. */
export function Crumbs({
  items,
  className,
  compactOnMobile = false,
}: CrumbsProps) {
  return (
    <Breadcrumbs
      aria-label="Хлебные крошки"
      className={cn(
        "ui-crumbs",
        compactOnMobile && "ui-crumbs--compact-mobile",
        className,
      )}
      separator={<ArrowIcon className="ui-crumbs__sep" width={12} height={12} />}
    >
      {items.map((it, i) => {
        const isLast = i === items.length - 1;

        if (isLast || !it.href) {
          return (
            <Breadcrumbs.Item
              key={it.label}
              className="ui-crumbs__item ui-crumbs__item--current"
            >
              {() => <span>{it.label}</span>}
            </Breadcrumbs.Item>
          );
        }

        return (
          <Breadcrumbs.Item
            key={it.label}
            href={it.href}
            className="ui-crumbs__item"
          >
            {it.label}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}

export default Crumbs;
