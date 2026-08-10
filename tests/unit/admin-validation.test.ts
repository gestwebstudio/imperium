import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  isSafeAdminImage,
  normalizeAdminSlug,
  parseAdminId,
  parseNewsForm,
  parseReviewForm,
  validationErrorState,
} from "@/lib/admin-validation";

function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("ADMIN_IMAGE_HOSTS", "cdn.imperium.test,images.example.com");
});

describe("admin validation", () => {
  it("accepts safe local and allowlisted HTTPS images", () => {
    expect(isSafeAdminImage("/images/news/car.webp")).toBe(true);
    expect(isSafeAdminImage("https://cdn.imperium.test/cars/1.webp")).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "data:image/png;base64,abc",
    "file:///etc/passwd",
    "http://cdn.imperium.test/car.webp",
    "//cdn.imperium.test/car.webp",
    "/images/../secret",
    "/images/%2e%2e/secret",
    "https://evil.example/car.webp",
    "https://cdn.imperium.test:8443/car.webp",
    "https://user:pass@cdn.imperium.test/car.webp",
  ])("rejects unsafe image input %s", (value) => {
    expect(isSafeAdminImage(value)).toBe(false);
  });

  it("validates stable ids and normalizes slugs", () => {
    expect(parseAdminId("news_123-A").success).toBe(true);
    expect(parseAdminId("../news").success).toBe(false);
    expect(normalizeAdminSlug("Новая модель 2026")).toMatchObject({
      success: true,
      data: "novaya-model-2026",
    });
    expect(normalizeAdminSlug("x".repeat(161))).toMatchObject({
      success: true,
      data: "x".repeat(80),
    });
  });

  it("rejects empty and oversized fields", () => {
    const empty = parseReviewForm(
      form({
        author: "   ",
        car: "",
        text: "",
        image: "",
        imageAlt: "",
      }),
    );
    expect(empty.success).toBe(false);
    if (empty.success) throw new Error("Expected validation error");
    expect(empty.error.flatten().fieldErrors).toMatchObject({
      author: expect.any(Array),
      car: expect.any(Array),
      text: expect.any(Array),
      image: expect.any(Array),
      imageAlt: expect.any(Array),
    });

    const oversized = parseReviewForm(
      form({
        author: "a".repeat(121),
        car: "BMW",
        text: "Отзыв",
        image: "/images/reviews/1.webp",
        imageAlt: "Фото",
      }),
    );
    expect(oversized.success).toBe(false);
  });

  it("parses a strict news date and absent checkbox", () => {
    const result = parseNewsForm(
      form({
        title: "Новость",
        slug: "",
        excerpt: "Описание",
        body: "Строка 1\r\nСтрока 2",
        image: "/images/news/car.webp",
        imageAlt: "Автомобиль",
        date: "2026-02-28",
      }),
    );
    expect(result).toMatchObject({
      success: true,
      data: {
        slug: "novost",
        published: false,
        body: "Строка 1\nСтрока 2",
        date: new Date("2026-02-28T00:00:00.000Z"),
      },
    });

    const invalid = parseNewsForm(
      form({
        title: "Новость",
        slug: "news",
        excerpt: "Описание",
        body: "Текст",
        image: "/images/news/car.webp",
        imageAlt: "Автомобиль",
        date: "2026-02-30",
      }),
    );
    expect(invalid.success).toBe(false);
  });

  it("rejects unexpected checkbox values and maps field errors", () => {
    const result = parseReviewForm(
      form({
        author: "Анна",
        car: "BMW X5",
        text: "Отзыв",
        image: "/images/reviews/1.webp",
        imageAlt: "Анна",
        published: "yes",
      }),
    );
    expect(result.success).toBe(false);
    if (result.success) throw new Error("Expected validation error");
    expect(validationErrorState(result.error)).toMatchObject({
      status: "error",
      fieldErrors: { published: expect.any(Array) },
    });
  });
});
