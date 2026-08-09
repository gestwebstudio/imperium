import Link from "next/link";
import type { Review } from "@prisma/client";

/** Форма отзыва (создание/редактирование). `action` — серверный экшен. */
export function ReviewForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Review;
}) {
  return (
    <form className="admin-form" action={action}>
      <div className="admin-field">
        <label htmlFor="author">Имя автора</label>
        <input id="author" name="author" type="text" defaultValue={initial?.author} required />
      </div>

      <div className="admin-field">
        <label htmlFor="car">Автомобиль</label>
        <input
          id="car"
          name="car"
          type="text"
          defaultValue={initial?.car}
          placeholder="напр. BMW 7 Series"
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="text">Текст отзыва</label>
        <textarea
          id="text"
          name="text"
          defaultValue={initial?.text}
          style={{ minHeight: 160 }}
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="image">Ссылка на фото</label>
        <input
          id="image"
          name="image"
          type="text"
          defaultValue={initial?.image}
          placeholder="/images/reviews/... или https://..."
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="imageAlt">Описание фото (alt)</label>
        <input id="imageAlt" name="imageAlt" type="text" defaultValue={initial?.imageAlt} required />
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
        <Link href="/admin/reviews" className="admin-btn admin-btn--ghost">
          Отмена
        </Link>
      </div>
    </form>
  );
}

export default ReviewForm;
