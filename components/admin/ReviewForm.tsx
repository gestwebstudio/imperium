"use client";

import Link from "next/link";
import type { Review } from "@prisma/client";
import { useActionState } from "react";
import {
  INITIAL_ADMIN_ACTION_STATE,
  type AdminActionState,
} from "@/lib/admin-action-state";

/** Форма отзыва (создание/редактирование). `action` — серверный экшен. */
export function ReviewForm({
  action,
  initial,
}: {
  action: (
    previousState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  initial?: Review;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ADMIN_ACTION_STATE,
  );
  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form className="admin-form" action={formAction} noValidate>
      {state.message ? (
        <p className="admin-form__error" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="admin-field">
        <label htmlFor="author">Имя автора</label>
        <input
          id="author"
          name="author"
          type="text"
          defaultValue={initial?.author}
          maxLength={120}
          aria-invalid={Boolean(fieldError("author"))}
          aria-describedby={fieldError("author") ? "author-error" : undefined}
          required
        />
        {fieldError("author") ? (
          <span className="admin-field__error" id="author-error">
            {fieldError("author")}
          </span>
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="car">Автомобиль</label>
        <input
          id="car"
          name="car"
          type="text"
          defaultValue={initial?.car}
          maxLength={160}
          placeholder="напр. BMW 7 Series"
          aria-invalid={Boolean(fieldError("car"))}
          aria-describedby={fieldError("car") ? "car-error" : undefined}
          required
        />
        {fieldError("car") ? (
          <span className="admin-field__error" id="car-error">
            {fieldError("car")}
          </span>
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="text">Текст отзыва</label>
        <textarea
          id="text"
          name="text"
          defaultValue={initial?.text}
          style={{ minHeight: 160 }}
          maxLength={10_000}
          aria-invalid={Boolean(fieldError("text"))}
          aria-describedby={fieldError("text") ? "text-error" : undefined}
          required
        />
        {fieldError("text") ? (
          <span className="admin-field__error" id="text-error">
            {fieldError("text")}
          </span>
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="image">Ссылка на фото</label>
        <input
          id="image"
          name="image"
          type="text"
          defaultValue={initial?.image}
          maxLength={2048}
          placeholder="/images/reviews/... или https://..."
          aria-invalid={Boolean(fieldError("image"))}
          aria-describedby={fieldError("image") ? "image-error" : undefined}
          required
        />
        {fieldError("image") ? (
          <span className="admin-field__error" id="image-error">
            {fieldError("image")}
          </span>
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="imageAlt">Описание фото (alt)</label>
        <input
          id="imageAlt"
          name="imageAlt"
          type="text"
          defaultValue={initial?.imageAlt}
          maxLength={300}
          aria-invalid={Boolean(fieldError("imageAlt"))}
          aria-describedby={fieldError("imageAlt") ? "imageAlt-error" : undefined}
          required
        />
        {fieldError("imageAlt") ? (
          <span className="admin-field__error" id="imageAlt-error">
            {fieldError("imageAlt")}
          </span>
        ) : null}
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
        <button type="submit" className="admin-btn" disabled={pending}>
          {pending ? "Сохранение…" : "Сохранить"}
        </button>
        <Link href="/admin/reviews" className="admin-btn admin-btn--ghost">
          Отмена
        </Link>
      </div>
    </form>
  );
}

export default ReviewForm;
