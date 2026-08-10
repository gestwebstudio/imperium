"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  createAdminSession,
  deleteAdminSession,
  requireAdmin,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import {
  canAttemptAdminLogin,
  clearAdminLoginFailures,
  getAdminClientIdentifier,
  recordFailedAdminLogin,
} from "@/lib/admin-rate-limit";
import type { AdminActionState } from "@/lib/admin-action-state";
import {
  parseAdminId,
  parseNewsForm,
  parseReviewForm,
  validationErrorState,
} from "@/lib/admin-validation";

/* ----------------------------- Авторизация ----------------------------- */

export async function login(formData: FormData) {
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const clientId = await getAdminClientIdentifier();

  if (!(await canAttemptAdminLogin(clientId))) {
    redirect("/admin/login?error=1");
  }

  if (!(await verifyAdminPassword(password))) {
    await recordFailedAdminLogin(clientId);
    redirect("/admin/login?error=1");
  }

  await clearAdminLoginFailures(clientId);
  await createAdminSession();
  redirect("/admin/news");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}

/* Обновление публичных страниц после правок контента. */
function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/about");
}

/* ------------------------------- Новости ------------------------------- */

async function uniqueSlug(root: string, ignoreId?: string): Promise<string> {
  let slug = root;
  let i = 2;
  while (i < 10_000) {
    const found = await prisma.news.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${root}-${i++}`;
  }
  throw new Error("Не удалось подобрать уникальный slug.");
}

export async function createNews(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = parseNewsForm(formData);
  if (!parsed.success) return validationErrorState(parsed.error);

  try {
    const slug = await uniqueSlug(parsed.data.slug);
    await prisma.news.create({ data: { ...parsed.data, slug } });
  } catch {
    return { status: "error", message: "Не удалось сохранить новость." };
  }

  revalidatePublic();
  redirect("/admin/news");
}

export async function updateNews(
  id: string,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsedId = parseAdminId(id);
  if (!parsedId.success) return validationErrorState(parsedId.error);
  const parsed = parseNewsForm(formData);
  if (!parsed.success) return validationErrorState(parsed.error);

  try {
    const slug = await uniqueSlug(parsed.data.slug, parsedId.data);
    await prisma.news.update({
      where: { id: parsedId.data },
      data: { ...parsed.data, slug },
    });
  } catch {
    return { status: "error", message: "Не удалось сохранить новость." };
  }

  revalidatePublic();
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await requireAdmin();
  const parsedId = parseAdminId(id);
  if (!parsedId.success) throw new Error("Некорректный идентификатор.");

  try {
    await prisma.news.delete({ where: { id: parsedId.data } });
  } catch {
    throw new Error("Не удалось удалить новость.");
  }

  revalidatePublic();
  revalidatePath("/admin/news");
}

/* ------------------------------- Отзывы -------------------------------- */

export async function createReview(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = parseReviewForm(formData);
  if (!parsed.success) return validationErrorState(parsed.error);

  try {
    await prisma.review.create({ data: parsed.data });
  } catch {
    return { status: "error", message: "Не удалось сохранить отзыв." };
  }

  revalidatePublic();
  redirect("/admin/reviews");
}

export async function updateReview(
  id: string,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsedId = parseAdminId(id);
  if (!parsedId.success) return validationErrorState(parsedId.error);
  const parsed = parseReviewForm(formData);
  if (!parsed.success) return validationErrorState(parsed.error);

  try {
    await prisma.review.update({
      where: { id: parsedId.data },
      data: parsed.data,
    });
  } catch {
    return { status: "error", message: "Не удалось сохранить отзыв." };
  }

  revalidatePublic();
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  const parsedId = parseAdminId(id);
  if (!parsedId.success) throw new Error("Некорректный идентификатор.");

  try {
    await prisma.review.delete({ where: { id: parsedId.data } });
  } catch {
    throw new Error("Не удалось удалить отзыв.");
  }

  revalidatePublic();
  revalidatePath("/admin/reviews");
}
