import { Breadcrumbs } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";

export type Crumb = { label: string; href?: string };

/**
 * Хлебные крошки для страниц услуг — те же, что в каталоге (классы .cat-crumbs*).
 * Стили .cat-crumbs* продублированы в trade-in.css (каталожный CSS сюда не тянем).
 */
export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumbs
      className="cat-crumbs"
      separator={<ArrowIcon className="cat-crumbs__sep" width={12} height={12} />}
    >
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <Breadcrumbs.Item
            key={it.label}
            href={isLast ? undefined : it.href}
            className={`cat-crumbs__item${isLast ? " cat-crumbs__item--current" : ""}`}
          >
            {it.label}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}

export default Crumbs;
