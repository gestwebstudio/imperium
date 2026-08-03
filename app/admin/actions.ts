"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, adminPassword } from "@/lib/auth";
import { slugify } from "@/lib/slug";

/* ----------------------------- Авторизация ----------------------------- */

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!password || password !== adminPassword()) {
    redirect("/admin/login?error=1");
  }
  (await cookies()).set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // неделя
  });
  redirect("/admin/news");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* Обновление публичных страниц после правок контента. */
function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/about");
}

/* ------------------------------- Новости ------------------------------- */

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "news";
  let slug = root;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.news.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${root}-${i++}`;
  }
}

function newsDataFromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? "")
      .replace(/\r\n/g, "\n")
      .trim(),
    image: String(formData.get("image") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    date: new Date(String(formData.get("date") || Date.now())),
    published: formData.get("published") === "on",
  };
}

export async function createNews(formData: FormData) {
  const data = newsDataFromForm(formData);
  const slug = await uniqueSlug(String(formData.get("slug") || data.title));
  await prisma.news.create({ data: { ...data, slug } });
  revalidatePublic();
  redirect("/admin/news");
}

export async function updateNews(id: string, formData: FormData) {
  const data = newsDataFromForm(formData);
  const slug = await uniqueSlug(String(formData.get("slug") || data.title), id);
  await prisma.news.update({ where: { id }, data: { ...data, slug } });
  revalidatePublic();
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await prisma.news.delete({ where: { id } });
  revalidatePublic();
  revalidatePath("/admin/news");
}

/* ------------------------------- Отзывы -------------------------------- */

function reviewDataFromForm(formData: FormData) {
  return {
    author: String(formData.get("author") ?? "").trim(),
    car: String(formData.get("car") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    published: formData.get("published") === "on",
  };
}

export async function createReview(formData: FormData) {
  await prisma.review.create({ data: reviewDataFromForm(formData) });
  revalidatePublic();
  redirect("/admin/reviews");
}

export async function updateReview(id: string, formData: FormData) {
  await prisma.review.update({
    where: { id },
    data: reviewDataFromForm(formData),
  });
  revalidatePublic();
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } });
  revalidatePublic();
  revalidatePath("/admin/reviews");
}
