import type { Metadata } from "next";
import { Breadcrumbs } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";
import { NewsGrid } from "@/components/news/NewsGrid";
import { newsItems } from "@/lib/news";
import "./news.css";

export const metadata: Metadata = {
  title: "Новости — Imperium Motors",
  description:
    "Новости Imperium Motors: премьеры автомобилей, новые поступления и события автосалона.",
};

export default function NewsPage() {
  return (
    <main className="news-page">
      <Breadcrumbs
        className="news-page__crumbs"
        separator={
          <ArrowIcon
            className="news-page__crumbs-separator"
            width={12}
            height={12}
          />
        }
      >
        <Breadcrumbs.Item href="/" className="news-page__crumb">
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item className="news-page__crumb news-page__crumb--current">
          Новости
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <NewsGrid items={newsItems} />
    </main>
  );
}
