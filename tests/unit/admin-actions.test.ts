import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  news: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  review: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const cookieStore = vi.hoisted(() => ({
  set: vi.fn(),
  delete: vi.fn(),
}));

const navigation = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

const cache = vi.hoisted(() => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/db", () => ({ prisma: db }));
vi.mock("next/headers", () => ({ cookies: vi.fn(async () => cookieStore) }));
vi.mock("next/navigation", () => navigation);
vi.mock("next/cache", () => cache);

import {
  createNews,
  createReview,
  deleteNews,
  deleteReview,
  login,
  logout,
  updateNews,
  updateReview,
} from "@/app/admin/actions";

function newsForm(overrides: Record<string, string> = {}) {
  const values = {
    title: "  Новая модель  ",
    slug: "",
    excerpt: "  Кратко  ",
    body: " Первый абзац\r\n\r\nВторой абзац ",
    image: " /news.webp ",
    imageAlt: " Фото ",
    date: "2026-08-09",
    published: "on",
    ...overrides,
  };
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  return form;
}

function reviewForm(overrides: Record<string, string> = {}) {
  const values = {
    author: "  Анна  ",
    car: " BMW X5 ",
    text: " Отличный автомобиль ",
    image: " /review.webp ",
    imageAlt: " Фото автора ",
    published: "on",
    ...overrides,
  };
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  return form;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.stubEnv("ADMIN_PASSWORD", "secret");
});

describe("admin actions: авторизация", () => {
  it("отклоняет пустой и неверный пароль", async () => {
    const empty = new FormData();
    await expect(login(empty)).rejects.toThrow("REDIRECT:/admin/login?error=1");

    const wrong = new FormData();
    wrong.set("password", "wrong");
    await expect(login(wrong)).rejects.toThrow("REDIRECT:/admin/login?error=1");
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("создаёт недельную защищённую сессию", async () => {
    const form = new FormData();
    form.set("password", "secret");

    await expect(login(form)).rejects.toThrow("REDIRECT:/admin/news");
    expect(cookieStore.set).toHaveBeenCalledWith("admin_session", "secret", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 604_800,
    });
  });

  it("удаляет сессию при выходе", async () => {
    await expect(logout()).rejects.toThrow("REDIRECT:/admin/login");
    expect(cookieStore.delete).toHaveBeenCalledWith("admin_session");
  });
});

describe("admin actions: новости", () => {
  it("создаёт новость, нормализует поля и подбирает уникальный slug", async () => {
    db.news.findUnique
      .mockResolvedValueOnce({ id: "occupied" })
      .mockResolvedValueOnce(null);

    await expect(createNews(newsForm())).rejects.toThrow(
      "REDIRECT:/admin/news",
    );

    expect(db.news.create).toHaveBeenCalledWith({
      data: {
        title: "Новая модель",
        excerpt: "Кратко",
        body: "Первый абзац\n\nВторой абзац",
        image: "/news.webp",
        imageAlt: "Фото",
        date: new Date("2026-08-09"),
        published: true,
        slug: "novaya-model-2",
      },
    });
    expect(cache.revalidatePath.mock.calls.map(([path]) => path)).toEqual([
      "/",
      "/news",
      "/about",
    ]);
  });

  it("использует запасной slug и сохраняет черновик", async () => {
    db.news.findUnique.mockResolvedValue(null);
    const form = newsForm({ title: "", slug: "!!!", published: "off" });

    await expect(createNews(form)).rejects.toThrow("REDIRECT:/admin/news");
    expect(db.news.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ slug: "news", published: false }),
    });
  });

  it("обновляет новость и разрешает сохранить её текущий slug", async () => {
    db.news.findUnique.mockResolvedValue({ id: "same-id" });

    await expect(updateNews("same-id", newsForm({ slug: "Свежая новость" }))).rejects.toThrow(
      "REDIRECT:/admin/news",
    );
    expect(db.news.update).toHaveBeenCalledWith({
      where: { id: "same-id" },
      data: expect.objectContaining({ slug: "svezhaya-novost" }),
    });
  });

  it("удаляет новость и обновляет публичные и административные страницы", async () => {
    await deleteNews("news-id");

    expect(db.news.delete).toHaveBeenCalledWith({ where: { id: "news-id" } });
    expect(cache.revalidatePath).toHaveBeenCalledWith("/admin/news");
  });
});

describe("admin actions: отзывы", () => {
  it("создаёт и нормализует отзыв", async () => {
    await expect(createReview(reviewForm())).rejects.toThrow(
      "REDIRECT:/admin/reviews",
    );
    expect(db.review.create).toHaveBeenCalledWith({
      data: {
        author: "Анна",
        car: "BMW X5",
        text: "Отличный автомобиль",
        image: "/review.webp",
        imageAlt: "Фото автора",
        published: true,
      },
    });
  });

  it("обновляет черновик отзыва", async () => {
    await expect(
      updateReview("review-id", reviewForm({ published: "off" })),
    ).rejects.toThrow("REDIRECT:/admin/reviews");
    expect(db.review.update).toHaveBeenCalledWith({
      where: { id: "review-id" },
      data: expect.objectContaining({ published: false }),
    });
  });

  it("удаляет отзыв и обновляет страницы", async () => {
    await deleteReview("review-id");

    expect(db.review.delete).toHaveBeenCalledWith({
      where: { id: "review-id" },
    });
    expect(cache.revalidatePath).toHaveBeenCalledWith("/admin/reviews");
  });
});
