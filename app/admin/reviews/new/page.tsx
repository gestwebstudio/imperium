import { ReviewForm } from "@/components/admin/ReviewForm";
import { createReview } from "../../actions";

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
