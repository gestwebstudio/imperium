import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteNews } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminNewsList() {
  const items = await prisma.news.findMany({ orderBy: { date: "desc" } });

  return (
    <>
      <div className="admin-head">
        <h1>Новости</h1>
        <Link href="/admin/news/new" className="admin-btn">
          + Добавить новость
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">Пока нет новостей. Добавьте первую.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 84 }}>Фото</th>
              <th>Заголовок</th>
              <th style={{ width: 120 }}>Дата</th>
              <th style={{ width: 130 }}>Статус</th>
              <th style={{ width: 190 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="admin-thumb" src={n.image} alt="" />
                </td>
                <td className="admin-table__title">{n.title}</td>
                <td>{n.date.toISOString().slice(0, 10)}</td>
                <td>
                  <span className={`admin-pill admin-pill--${n.published ? "on" : "off"}`}>
                    {n.published ? "Опубликовано" : "Черновик"}
                  </span>
                </td>
                <td>
                  <div className="admin-table__actions">
                    <Link
                      href={`/admin/news/${n.id}`}
                      className="admin-btn admin-btn--ghost"
                    >
                      Изменить
                    </Link>
                    <form action={deleteNews.bind(null, n.id)}>
                      <button type="submit" className="admin-btn admin-btn--danger">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
