import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { prisma } from "@/lib/db";
import { updateReview } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>Редактирование отзыва</h1>
      </div>
      <ReviewForm action={updateReview.bind(null, id)} initial={review} />
    </>
  );
}
