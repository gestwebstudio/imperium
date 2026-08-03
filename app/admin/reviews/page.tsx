import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteReview } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsList() {
  const items = await prisma.review.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <div className="admin-head">
        <h1>Отзывы</h1>
        <Link href="/admin/reviews/new" className="admin-btn">
          + Добавить отзыв
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">Пока нет отзывов. Добавьте первый.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 84 }}>Фото</th>
              <th style={{ width: 160 }}>Автор</th>
              <th>Отзыв</th>
              <th style={{ width: 130 }}>Статус</th>
              <th style={{ width: 190 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="admin-thumb" src={r.image} alt="" />
                </td>
                <td className="admin-table__title">
                  {r.author}
                  <div style={{ color: "var(--admin-muted)", fontWeight: 400, fontSize: 13 }}>
                    {r.car}
                  </div>
                </td>
                <td style={{ color: "var(--admin-muted)" }}>
                  {r.text.length > 90 ? `${r.text.slice(0, 90)}…` : r.text}
                </td>
                <td>
                  <span className={`admin-pill admin-pill--${r.published ? "on" : "off"}`}>
                    {r.published ? "Опубликовано" : "Скрыт"}
                  </span>
                </td>
                <td>
                  <div className="admin-table__actions">
                    <Link
                      href={`/admin/reviews/${r.id}`}
                      className="admin-btn admin-btn--ghost"
                    >
                      Изменить
                    </Link>
                    <form action={deleteReview.bind(null, r.id)}>
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
