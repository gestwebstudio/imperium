import { createNews } from "@/app/admin/actions";
import { NewsForm } from "@/components/admin/NewsForm";

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
