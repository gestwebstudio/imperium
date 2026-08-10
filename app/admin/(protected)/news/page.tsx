import Link from "next/link";
import { deleteNews } from "@/app/admin/actions";
import { getAdminNewsList } from "@/lib/admin-dal";

export default async function AdminNewsList() {
  const items = await getAdminNewsList();

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
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="admin-thumb" src={item.image} alt="" />
                </td>
                <td className="admin-table__title">{item.title}</td>
                <td>{item.date.toISOString().slice(0, 10)}</td>
                <td>
                  <span
                    className={`admin-pill admin-pill--${item.published ? "on" : "off"}`}
                  >
                    {item.published ? "Опубликовано" : "Черновик"}
                  </span>
                </td>
                <td>
                  <div className="admin-table__actions">
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="admin-btn admin-btn--ghost"
                    >
                      Изменить
                    </Link>
                    <form action={deleteNews.bind(null, item.id)}>
                      <button
                        type="submit"
                        className="admin-btn admin-btn--danger"
                      >
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
