import "server-only";
import { prisma } from "@/lib/db";

export type NewsItem = {
  id: string;
  date: string;
  dateTime: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type NewsArticle = {
  slug: string;
  date: string;
  dateTime: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  imageAlt: string;
};

function fmt(date: Date) {
  const iso = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const [y, m, d] = iso.split("-");
  return { dateTime: iso, date: `${d}.${m}.${y}` };
}

/** Карточки для списка новостей (только опубликованные, новые сверху). */
export async function getNewsList(): Promise<NewsItem[]> {
  const rows = await prisma.news.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });
  return rows.map((n) => {
    const { date, dateTime } = fmt(n.date);
    return {
      id: n.id,
      date,
      dateTime,
      title: n.title,
      description: n.excerpt,
      image: n.image,
      imageAlt: n.imageAlt,
      href: `/news/${n.slug}`,
    };
  });
}

export async function getNewsArticle(
  slug: string,
): Promise<NewsArticle | null> {
  const n = await prisma.news.findUnique({ where: { slug } });
  if (!n || !n.published) return null;
  const { date, dateTime } = fmt(n.date);
  return {
    slug: n.slug,
    date,
    dateTime,
    title: n.title,
    excerpt: n.excerpt,
    body: n.body.split("\n\n").filter(Boolean),
    image: n.image,
    imageAlt: n.imageAlt,
  };
}

export async function getNewsSlugs(): Promise<string[]> {
  const rows = await prisma.news.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
