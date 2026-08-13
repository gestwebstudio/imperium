import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  news: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  review: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({ prisma: db }));
import { getNewsArticle, getNewsList, getNewsSlugs } from "@/lib/news";
import { getPublicReviews, getReviews } from "@/lib/reviews";

const publishedNews = {
  id: "news-1",
  slug: "test-news",
  date: new Date("2026-08-09T15:00:00.000Z"),
  title: "Новость",
  excerpt: "Краткое описание",
  body: "Первый абзац\n\nВторой абзац\n\n",
  image: "/news.webp",
  imageAlt: "Фото новости",
  published: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("новости и отзывы", () => {
  it("преобразует опубликованные новости в карточки", async () => {
    db.news.findMany.mockResolvedValue([publishedNews]);

    await expect(getNewsList()).resolves.toEqual([
      {
        id: "news-1",
        date: "09.08.2026",
        dateTime: "2026-08-09",
        title: "Новость",
        description: "Краткое описание",
        image: "/news.webp",
        imageAlt: "Фото новости",
        href: "/news/test-news",
      },
    ]);
    expect(db.news.findMany).toHaveBeenCalledWith({
      where: { published: true },
      orderBy: { date: "desc" },
    });
  });

  it("возвращает только опубликованную статью и разбивает абзацы", async () => {
    db.news.findUnique.mockResolvedValueOnce(publishedNews);

    await expect(getNewsArticle("test-news")).resolves.toEqual({
      slug: "test-news",
      date: "09.08.2026",
      dateTime: "2026-08-09",
      title: "Новость",
      excerpt: "Краткое описание",
      body: ["Первый абзац", "Второй абзац"],
      image: "/news.webp",
      imageAlt: "Фото новости",
    });

    db.news.findUnique.mockResolvedValueOnce(null);
    await expect(getNewsArticle("missing")).resolves.toBeNull();

    db.news.findUnique.mockResolvedValueOnce({
      ...publishedNews,
      published: false,
    });
    await expect(getNewsArticle("draft")).resolves.toBeNull();
  });

  it("возвращает slug опубликованных новостей", async () => {
    db.news.findMany.mockResolvedValue([{ slug: "one" }, { slug: "two" }]);

    await expect(getNewsSlugs()).resolves.toEqual(["one", "two"]);
    expect(db.news.findMany).toHaveBeenCalledWith({
      where: { published: true },
      select: { slug: true },
    });
  });

  it("преобразует опубликованные отзывы", async () => {
    db.review.findMany.mockResolvedValue([
      {
        id: "review-1",
        author: "Анна",
        car: "BMW X5",
        text: "Отличный автомобиль",
        image: "/review.webp",
        imageAlt: "Анна у автомобиля",
        published: true,
        createdAt: new Date(),
      },
    ]);

    await expect(getReviews()).resolves.toEqual([
      {
        id: "review-1",
        author: "Анна",
        car: "BMW X5",
        text: "Отличный автомобиль",
        image: "/review.webp",
        imageAlt: "Анна у автомобиля",
      },
    ]);
    expect(db.review.findMany).toHaveBeenCalledWith({
      where: { published: true },
      orderBy: { createdAt: "asc" },
    });
  });

  it("не роняет публичную страницу при временной ошибке отзывов", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    db.review.findMany.mockRejectedValue(new Error("database unavailable"));

    await expect(getPublicReviews()).resolves.toEqual([]);
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load public reviews",
      expect.any(Error),
    );
  });
});
