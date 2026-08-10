import "server-only";

import { z } from "zod";
import type { AdminActionState } from "@/lib/admin-action-state";
import { slugify } from "@/lib/slug";

const requiredString = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label}: обязательное поле`)
    .max(max, `${label}: не более ${max} символов`);

const adminIdSchema = z
  .string()
  .trim()
  .min(1, "Некорректный идентификатор")
  .max(64, "Некорректный идентификатор")
  .regex(/^[A-Za-z0-9_-]+$/, "Некорректный идентификатор");

const slugSchema = z
  .string()
  .min(1, "Slug не может быть пустым")
  .max(160, "Slug: не более 160 символов")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Некорректный формат slug");

function allowedImageHosts() {
  return new Set(
    (process.env.ADMIN_IMAGE_HOSTS ?? "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isSafeAdminImage(value: string) {
  if (
    value.startsWith("/images/") &&
    !value.startsWith("//") &&
    !value.includes("..") &&
    !value.includes("\\") &&
    /^\/images\/[A-Za-z0-9_./-]+$/.test(value)
  ) {
    return true;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  return (
    url.protocol === "https:" &&
    url.port === "" &&
    !url.username &&
    !url.password &&
    allowedImageHosts().has(url.hostname.toLowerCase())
  );
}

const imageSchema = requiredString("Изображение", 2048).refine(
  isSafeAdminImage,
  "Разрешён путь /images/... или HTTPS URL доверенного домена",
);

const checkboxSchema = z.preprocess((value) => {
  if (value === null) return false;
  if (value === "on") return true;
  return value;
}, z.boolean({ error: "Некорректное значение checkbox" }));

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Некорректная дата")
  .transform((value, context) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      context.addIssue({ code: "custom", message: "Некорректная дата" });
      return z.NEVER;
    }
    return date;
  });

const newsFormSchema = z.object({
  title: requiredString("Заголовок", 200),
  slug: z.string().trim().max(200, "Slug: не более 200 символов"),
  excerpt: requiredString("Краткое описание", 500),
  body: requiredString("Текст новости", 50_000).transform((value) =>
    value.replace(/\r\n/g, "\n"),
  ),
  image: imageSchema,
  imageAlt: requiredString("Описание изображения", 300),
  date: dateSchema,
  published: checkboxSchema,
});

const reviewFormSchema = z.object({
  author: requiredString("Автор", 120),
  car: requiredString("Автомобиль", 160),
  text: requiredString("Текст отзыва", 10_000),
  image: imageSchema,
  imageAlt: requiredString("Описание изображения", 300),
  published: checkboxSchema,
});

function stringField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseAdminId(id: unknown) {
  return adminIdSchema.safeParse(id);
}

export function normalizeAdminSlug(value: string) {
  return slugSchema.safeParse(slugify(value) || "news");
}

export function parseNewsForm(formData: FormData) {
  const result = newsFormSchema.safeParse({
    title: stringField(formData, "title"),
    slug: stringField(formData, "slug"),
    excerpt: stringField(formData, "excerpt"),
    body: stringField(formData, "body"),
    image: stringField(formData, "image"),
    imageAlt: stringField(formData, "imageAlt"),
    date: stringField(formData, "date"),
    published: formData.get("published"),
  });

  if (!result.success) return result;
  const slugResult = normalizeAdminSlug(result.data.slug || result.data.title);
  if (!slugResult.success) {
    return {
      success: false as const,
      error: new z.ZodError(
        slugResult.error.issues.map((issue) => ({ ...issue, path: ["slug"] })),
      ),
    };
  }

  return {
    success: true as const,
    data: { ...result.data, slug: slugResult.data },
  };
}

export function parseReviewForm(formData: FormData) {
  return reviewFormSchema.safeParse({
    author: stringField(formData, "author"),
    car: stringField(formData, "car"),
    text: stringField(formData, "text"),
    image: stringField(formData, "image"),
    imageAlt: stringField(formData, "imageAlt"),
    published: formData.get("published"),
  });
}

export function validationErrorState(error: z.ZodError): AdminActionState {
  return {
    status: "error",
    message: "Проверьте заполнение формы.",
    fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
  };
}
