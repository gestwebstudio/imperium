import { Breadcrumbs } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";

export type Crumb = { label: string; href?: string };

/**
 * Хлебные крошки для страниц услуг (Trade-in, Лизинг, Авто под заказ…).
 * Стили — класс `.ti-crumbs` в trade-in.css (по макету 762:5242: h18, margin-bottom 10).
 */
export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumbs
      className="ti-crumbs"
      separator={<ArrowIcon className="ti-crumbs__sep" width={12} height={12} />}
    >
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <Breadcrumbs.Item
            key={it.label}
            href={isLast ? undefined : it.href}
            className={`ti-crumb${isLast ? " ti-crumb--current" : ""}`}
          >
            {it.label}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}

export default Crumbs;
