import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import {
  getNewsArticle,
  getNewsSlugs,
  type NewsArticle,
} from "@/lib/news";
import "./news-detail.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    return { title: "Новость не найдена — Imperium Motors" };
  }

  return {
    title: `${article.title} — Imperium Motors`,
    description: article.excerpt,
  };
}

function NewsArticleContent({ article }: { article: NewsArticle }) {
  return (
    <article className="news-detail__article">
      <div className="news-detail__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt={article.imageAlt} />
      </div>

      <div className="news-detail__content">
        <div className="news-detail__copy">
          <time dateTime={article.dateTime}>{article.date}</time>
          <div className="news-detail__text">
            <h1>{article.title}</h1>
            <div className="news-detail__body">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <ButtonLink href="/catalog" size="l" variant="primary-surface">
          Подобрать автомобиль
        </ButtonLink>
      </div>
    </article>
  );
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) notFound();

  return (
    <main className="news-detail">
      <Breadcrumbs
        className="news-detail__crumbs"
        separator={<ArrowIcon width={12} height={12} />}
      >
        <Breadcrumbs.Item href="/" className="news-detail__crumb">
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item
          href="/news"
          className="news-detail__crumb news-detail__crumb--current"
        >
          Новости
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <NewsArticleContent article={article} />
    </main>
  );
}
