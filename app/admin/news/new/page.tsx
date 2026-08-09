import { NewsForm } from "@/components/admin/NewsForm";
import { createNews } from "../../actions";

export default function NewNewsPage() {
  return (
    <>
      <div className="admin-head">
        <h1>Новая новость</h1>
      </div>
      <NewsForm action={createNews} />
    </>
  );
}
