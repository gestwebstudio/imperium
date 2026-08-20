"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import "./cookie-banner.css";

const STORAGE_KEY = "im-cookie-consent";

/** Всплывашка уведомления о cookie внизу экрана. Согласие хранится в
 *  localStorage — после «Принять» больше не показывается. */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "accepted") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* приватный режим — просто скрываем на сессию */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Уведомление об использовании cookie"
    >
      <div className="cookie-banner__card">
        <div className="cookie-banner__text">
          <p className="cookie-banner__title">Мы используем cookie</p>
          <p className="cookie-banner__desc">
            Для корректной работы сайта, анализа трафика и персонализации
            контента. Продолжая использовать сайт, вы соглашаетесь с{" "}
            <Link href="/docs/privacy-policy">
              Политикой обработки персональных данных
            </Link>{" "}
            и условиями использования cookie.
          </p>
        </div>
        <div className="cookie-banner__actions">
          <Button variant="primary-surface" size="m" onClick={accept}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
