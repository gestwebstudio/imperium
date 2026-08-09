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
