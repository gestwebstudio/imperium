import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/NewsForm";
import { prisma } from "@/lib/db";
import { updateNews } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id } });
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
