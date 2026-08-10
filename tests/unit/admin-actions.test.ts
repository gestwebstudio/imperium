import { beforeEach, describe, expect, it, vi } from "vitest";
import { INITIAL_ADMIN_ACTION_STATE } from "@/lib/admin-action-state";

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

const auth = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  verifyAdminPassword: vi.fn(),
  createAdminSession: vi.fn(),
  deleteAdminSession: vi.fn(),
}));

const rateLimit = vi.hoisted(() => ({
  getAdminClientIdentifier: vi.fn(),
  canAttemptAdminLogin: vi.fn(),
  recordFailedAdminLogin: vi.fn(),
  clearAdminLoginFailures: vi.fn(),
}));

const navigation = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
const cache = vi.hoisted(() => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/db", () => ({ prisma: db }));
vi.mock("@/lib/admin-auth", () => auth);
vi.mock("@/lib/admin-rate-limit", () => rateLimit);
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

function newsForm(overrides: Record<string, string | null> = {}) {
  const values: Record<string, string | null> = {
    title: "  Новая модель  ",
    slug: "",
    excerpt: "  Кратко  ",
    body: " Первый абзац\r\n\r\nВторой абзац ",
    image: "/images/news.webp",
    imageAlt: " Фото ",
    date: "2026-08-09",
    published: "on",
    ...overrides,
  };
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null) form.set(key, value);
  });
  return form;
}

function reviewForm(overrides: Record<string, string | null> = {}) {
  const values: Record<string, string | null> = {
    author: "  Анна  ",
    car: " BMW X5 ",
    text: " Отличный автомобиль ",
    image: "/images/review.webp",
    imageAlt: " Фото автора ",
    published: "on",
    ...overrides,
  };
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null) form.set(key, value);
  });
  return form;
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.requireAdmin.mockResolvedValue({ id: "session" });
  auth.verifyAdminPassword.mockResolvedValue(false);
  rateLimit.getAdminClientIdentifier.mockResolvedValue("client:test");
  rateLimit.canAttemptAdminLogin.mockResolvedValue(true);
});

describe("admin actions: авторизация", () => {
  it("возвращает одинаковый ответ для неверного пароля и rate limit", async () => {
    const wrong = new FormData();
    wrong.set("password", "wrong");
    await expect(login(wrong)).rejects.toThrow("REDIRECT:/admin/login?error=1");
    expect(rateLimit.recordFailedAdminLogin).toHaveBeenCalledWith("client:test");

    rateLimit.canAttemptAdminLogin.mockResolvedValue(false);
    await expect(login(wrong)).rejects.toThrow("REDIRECT:/admin/login?error=1");
    expect(auth.verifyAdminPassword).toHaveBeenCalledTimes(1);
  });

  it("создаёт opaque-сессию после успешной проверки", async () => {
    auth.verifyAdminPassword.mockResolvedValue(true);
    const form = new FormData();
    form.set("password", "correct password");

    await expect(login(form)).rejects.toThrow("REDIRECT:/admin/news");
    expect(rateLimit.clearAdminLoginFailures).toHaveBeenCalledWith("client:test");
    expect(auth.createAdminSession).toHaveBeenCalledOnce();
  });

  it("удаляет сессию при выходе", async () => {
    await expect(logout()).rejects.toThrow("REDIRECT:/admin/login");
    expect(auth.deleteAdminSession).toHaveBeenCalledOnce();
  });
});

describe("admin actions: обязательная авторизация", () => {
  it("останавливает все шесть CRUD actions до Prisma и revalidation", async () => {
    auth.requireAdmin.mockRejectedValue(new Error("UNAUTHORIZED"));
    const attempts = [
      () => createNews(INITIAL_ADMIN_ACTION_STATE, newsForm()),
      () => updateNews("news-id", INITIAL_ADMIN_ACTION_STATE, newsForm()),
      () => deleteNews("news-id"),
      () => createReview(INITIAL_ADMIN_ACTION_STATE, reviewForm()),
      () =>
        updateReview("review-id", INITIAL_ADMIN_ACTION_STATE, reviewForm()),
      () => deleteReview("review-id"),
    ];

    for (const attempt of attempts) {
      await expect(attempt()).rejects.toThrow("UNAUTHORIZED");
    }

    expect(auth.requireAdmin).toHaveBeenCalledTimes(6);
    expect(db.news.findUnique).not.toHaveBeenCalled();
    expect(db.news.create).not.toHaveBeenCalled();
    expect(db.news.update).not.toHaveBeenCalled();
    expect(db.news.delete).not.toHaveBeenCalled();
    expect(db.review.create).not.toHaveBeenCalled();
    expect(db.review.update).not.toHaveBeenCalled();
    expect(db.review.delete).not.toHaveBeenCalled();
    expect(cache.revalidatePath).not.toHaveBeenCalled();
  });
});

describe("admin actions: новости", () => {

  it("создаёт новость, нормализует поля и подбирает slug", async () => {
    db.news.findUnique
      .mockResolvedValueOnce({ id: "occupied" })
      .mockResolvedValueOnce(null);

    await expect(
      createNews(INITIAL_ADMIN_ACTION_STATE, newsForm()),
    ).rejects.toThrow("REDIRECT:/admin/news");
    expect(db.news.create).toHaveBeenCalledWith({
      data: {
        title: "Новая модель",
        excerpt: "Кратко",
        body: "Первый абзац\n\nВторой абзац",
        image: "/images/news.webp",
        imageAlt: "Фото",
        date: new Date("2026-08-09T00:00:00.000Z"),
        published: true,
        slug: "novaya-model-2",
      },
    });
  });

  it("возвращает field errors и не пишет невалидные данные", async () => {
    const result = await createNews(
      INITIAL_ADMIN_ACTION_STATE,
      newsForm({ image: "javascript:alert(1)", date: "2026-02-30" }),
    );
    expect(result.status).toBe("error");
    expect(result.fieldErrors).toMatchObject({ image: expect.any(Array), date: expect.any(Array) });
    expect(db.news.create).not.toHaveBeenCalled();
  });

  it("нейтрализует ошибку БД при update", async () => {
    db.news.findUnique.mockResolvedValue(null);
    db.news.update.mockRejectedValue(new Error("SQLITE secret details"));
    await expect(
      updateNews("news-id", INITIAL_ADMIN_ACTION_STATE, newsForm()),
    ).resolves.toEqual({ status: "error", message: "Не удалось сохранить новость." });
  });

  it("удаляет только после проверки сессии и id", async () => {
    await deleteNews("news-id");
    expect(auth.requireAdmin).toHaveBeenCalledOnce();
    expect(db.news.delete).toHaveBeenCalledWith({ where: { id: "news-id" } });

    await expect(deleteNews("../bad")).rejects.toThrow("Некорректный идентификатор");
  });
});

describe("admin actions: отзывы", () => {
  it("создаёт нормализованный отзыв", async () => {
    await expect(
      createReview(INITIAL_ADMIN_ACTION_STATE, reviewForm()),
    ).rejects.toThrow("REDIRECT:/admin/reviews");
    expect(db.review.create).toHaveBeenCalledWith({
      data: {
        author: "Анна",
        car: "BMW X5",
        text: "Отличный автомобиль",
        image: "/images/review.webp",
        imageAlt: "Фото автора",
        published: true,
      },
    });
  });

  it("обновляет неопубликованный отзыв", async () => {
    await expect(
      updateReview(
        "review-id",
        INITIAL_ADMIN_ACTION_STATE,
        reviewForm({ published: null }),
      ),
    ).rejects.toThrow("REDIRECT:/admin/reviews");
    expect(db.review.update).toHaveBeenCalledWith({
      where: { id: "review-id" },
      data: expect.objectContaining({ published: false }),
    });
  });

  it("нейтрализует ошибки create и delete", async () => {
    db.review.create.mockRejectedValueOnce(new Error("database details"));
    await expect(
      createReview(INITIAL_ADMIN_ACTION_STATE, reviewForm()),
    ).resolves.toEqual({ status: "error", message: "Не удалось сохранить отзыв." });

    db.review.delete.mockRejectedValueOnce(new Error("database details"));
    await expect(deleteReview("review-id")).rejects.toThrow(
      "Не удалось удалить отзыв.",
    );
  });
});
