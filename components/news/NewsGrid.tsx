"use client";

import { useState } from "react";
import { NewsCard } from "@/components/cards/cards";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/primitives";
import type { NewsItem } from "@/lib/news";

const INITIAL_VISIBLE = 12;
const LOAD_MORE_COUNT = 4;

export function NewsGrid({ items }: { items: NewsItem[] }) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_VISIBLE, items.length),
  );
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <>
      <header className="news-page__head">
        <h1>Новости</h1>
        <Badge color="info">{visibleItems.length}</Badge>
      </header>

      <section className="news-page__content" aria-label="Список новостей">
        <div className="news-page__grid">
          {visibleItems.map((item) => (
            <NewsCard
              key={item.id}
              date={item.date}
              dateTime={item.dateTime}
              title={item.title}
              description={item.description}
              image={item.image}
              imageAlt={item.imageAlt}
              href={item.href}
            />
          ))}
        </div>

        {hasMore && (
          <Button
            size="l"
            variant="secondary-outlined"
            className="news-page__more"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + LOAD_MORE_COUNT, items.length),
              )
            }
          >
            Показать ещё
          </Button>
        )}
      </section>
    </>
  );
}
