"use client";

import Link from "next/link";
import type { News } from "@prisma/client";
import { useActionState } from "react";
import {
  INITIAL_ADMIN_ACTION_STATE,
  type AdminActionState,
} from "@/lib/admin-action-state";

/** Форма новости (создание/редактирование). `action` — серверный экшен. */
export function NewsForm({
  action,
  initial,
}: {
  action: (
    previousState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  initial?: News;
}) {
  const dateVal = (initial?.date ?? new Date()).toISOString().slice(0, 10);
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
        <label htmlFor="title">Заголовок</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initial?.title}
          maxLength={200}
          aria-invalid={Boolean(fieldError("title"))}
          aria-describedby={fieldError("title") ? "title-error" : undefined}
          required
        />
        {fieldError("title") ? (
          <span className="admin-field__error" id="title-error">
            {fieldError("title")}
          </span>
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="slug">Slug (URL)</label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={initial?.slug}
          maxLength={200}
          placeholder="оставьте пустым — сгенерируется из заголовка"
          aria-invalid={Boolean(fieldError("slug"))}
          aria-describedby={fieldError("slug") ? "slug-error" : undefined}
        />
        {fieldError("slug") ? (
          <span className="admin-field__error" id="slug-error">
            {fieldError("slug")}
          </span>
        ) : null}
        <span className="admin-field__hint">
          Адрес страницы: /news/&lt;slug&gt;
        </span>
      </div>

      <div className="admin-field">
        <label htmlFor="excerpt">Краткое описание (для карточки)</label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={initial?.excerpt}
          maxLength={500}
          aria-invalid={Boolean(fieldError("excerpt"))}
          aria-describedby={fieldError("excerpt") ? "excerpt-error" : undefined}
          required
        />
        {fieldError("excerpt") ? (
          <span className="admin-field__error" id="excerpt-error">
            {fieldError("excerpt")}
          </span>
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="body">Текст новости</label>
        <textarea
          id="body"
          name="body"
          defaultValue={initial?.body}
          style={{ minHeight: 220 }}
          maxLength={50_000}
          aria-invalid={Boolean(fieldError("body"))}
          aria-describedby={fieldError("body") ? "body-error" : undefined}
          required
        />
        {fieldError("body") ? (
          <span className="admin-field__error" id="body-error">
            {fieldError("body")}
          </span>
        ) : null}
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
          maxLength={2048}
          placeholder="/images/news/... или https://..."
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
        <label htmlFor="imageAlt">Описание изображения (alt)</label>
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

      <div className="admin-field">
        <label htmlFor="date">Дата</label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={dateVal}
          aria-invalid={Boolean(fieldError("date"))}
          aria-describedby={fieldError("date") ? "date-error" : undefined}
          required
        />
        {fieldError("date") ? (
          <span className="admin-field__error" id="date-error">
            {fieldError("date")}
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
        <Link href="/admin/news" className="admin-btn admin-btn--ghost">
          Отмена
        </Link>
      </div>
    </form>
  );
}

export default NewsForm;
