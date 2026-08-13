"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import "./error.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="public-error" aria-labelledby="public-error-title">
      <div className="public-error__surface">
        <p className="public-error__eyebrow">Что-то пошло не так</p>
        <h1 className="public-error__title" id="public-error-title">
          Не удалось загрузить страницу
        </h1>
        <p className="public-error__text">
          Попробуйте обновить данные или вернитесь на главную страницу.
        </p>
        <div className="public-error__actions">
          <Button size="l" variant="primary-surface" onClick={reset}>
            Повторить
          </Button>
          <ButtonLink href="/" size="l" variant="secondary-outlined">
            На главную
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
