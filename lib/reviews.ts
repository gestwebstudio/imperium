import "server-only";
import { prisma } from "@/lib/db";

export type Review = {
  id: string;
  author: string;
  car: string;
  text: string;
  image: string;
  imageAlt: string;
};

/** Опубликованные отзывы (старые сверху — как заведены). */
export async function getReviews(): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    car: r.car,
    text: r.text,
    image: r.image,
    imageAlt: r.imageAlt,
  }));
}

/** Public pages stay usable when the reviews store is temporarily unavailable. */
export async function getPublicReviews(): Promise<Review[]> {
  try {
    return await getReviews();
  } catch (error) {
    console.error("Failed to load public reviews", error);
    return [];
  }
}
