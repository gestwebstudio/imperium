import { notFound } from "next/navigation";
import { updateNews } from "@/app/admin/actions";
import { NewsForm } from "@/components/admin/NewsForm";
import { getAdminNewsById } from "@/lib/admin-dal";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getAdminNewsById(id);
  if (!news) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>Редактирование новости</h1>
      </div>
      <NewsForm action={updateNews.bind(null, id)} initial={news} />
    </>
  );
}
