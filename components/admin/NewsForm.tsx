import Link from "next/link";
import type { News } from "@prisma/client";

/** Форма новости (создание/редактирование). `action` — серверный экшен. */
export function NewsForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: News;
}) {
  const dateVal = (initial?.date ?? new Date()).toISOString().slice(0, 10);

  return (
    <form className="admin-form" action={action}>
      <div className="admin-field">
        <label htmlFor="title">Заголовок</label>
        <input id="title" name="title" type="text" defaultValue={initial?.title} required />
      </div>

      <div className="admin-field">
        <label htmlFor="slug">Slug (URL)</label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={initial?.slug}
          placeholder="оставьте пустым — сгенерируется из заголовка"
        />
        <span className="admin-field__hint">
          Адрес страницы: /news/&lt;slug&gt;
        </span>
      </div>

      <div className="admin-field">
        <label htmlFor="excerpt">Краткое описание (для карточки)</label>
        <textarea id="excerpt" name="excerpt" defaultValue={initial?.excerpt} required />
      </div>

      <div className="admin-field">
        <label htmlFor="body">Текст новости</label>
        <textarea
          id="body"
          name="body"
          defaultValue={initial?.body}
          style={{ minHeight: 220 }}
          required
        />
        <span className="admin-field__hint">
          Абзацы разделяйте пустой строкой.
        </span>
      </div>

      <div className="admin-field">
        <label htmlFor="image">Ссылка на изображение</label>
        <input
          id="image"
          name="image"
          type="text"
          defaultValue={initial?.image}
          placeholder="/images/news/... или https://..."
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="imageAlt">Описание изображения (alt)</label>
        <input id="imageAlt" name="imageAlt" type="text" defaultValue={initial?.imageAlt} required />
      </div>

      <div className="admin-field">
        <label htmlFor="date">Дата</label>
        <input id="date" name="date" type="date" defaultValue={dateVal} required />
      </div>

      <div className="admin-field admin-check">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={initial?.published ?? true}
        />
        <label htmlFor="published">Опубликовано (видно на сайте)</label>
      </div>

      <div className="admin-form__actions">
        <button type="submit" className="admin-btn">
          Сохранить
        </button>
        <Link href="/admin/news" className="admin-btn admin-btn--ghost">
          Отмена
        </Link>
      </div>
    </form>
  );
}

export default NewsForm;
