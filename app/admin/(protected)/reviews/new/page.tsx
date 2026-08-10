import { createReview } from "@/app/admin/actions";
import { ReviewForm } from "@/components/admin/ReviewForm";

export default function NewReviewPage() {
  return (
    <>
      <div className="admin-head">
        <h1>Новый отзыв</h1>
      </div>
      <ReviewForm action={createReview} />
    </>
  );
}
