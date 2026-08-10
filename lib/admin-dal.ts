import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { parseAdminId } from "@/lib/admin-validation";
import { prisma } from "@/lib/db";

export async function getAdminNewsList() {
  await requireAdmin();
  return prisma.news.findMany({ orderBy: { date: "desc" } });
}

export async function getAdminNewsById(id: unknown) {
  await requireAdmin();
  const parsedId = parseAdminId(id);
  if (!parsedId.success) return null;
  return prisma.news.findUnique({ where: { id: parsedId.data } });
}

export async function getAdminReviewsList() {
  await requireAdmin();
  return prisma.review.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getAdminReviewById(id: unknown) {
  await requireAdmin();
  const parsedId = parseAdminId(id);
  if (!parsedId.success) return null;
  return prisma.review.findUnique({ where: { id: parsedId.data } });
}
