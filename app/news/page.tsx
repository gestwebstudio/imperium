import type { Metadata } from "next";
import { NewsGrid } from "@/components/news/NewsGrid";
import { Crumbs } from "@/components/ui/Crumbs";
import { getNewsList } from "@/lib/news";
import "./news.css";

export const metadata: Metadata = {
  title: "Новости — Imperium Motors",
  description:
    "Новости Imperium Motors: премьеры автомобилей, новые поступления и события автосалона.",
};

export default async function NewsPage() {
  const items = await getNewsList();
  return (
    <main className="news-page">
      <Crumbs
        className="news-page__crumbs"
        items={[{ label: "Главная", href: "/" }, { label: "Новости" }]}
      />

      <NewsGrid items={items} />
    </main>
  );
}
