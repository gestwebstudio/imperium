import { notFound } from "next/navigation";
import { updateReview } from "@/app/admin/actions";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { getAdminReviewById } from "@/lib/admin-dal";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getAdminReviewById(id);
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
