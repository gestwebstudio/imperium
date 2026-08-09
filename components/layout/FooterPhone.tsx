"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon } from "@/components/icons";

const PHONE_NUMBER = "+7 499 704-14-44";
const PHONE_TEL = "tel:+74997041444";

function copyWithFallback(value: string) {
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();

  const copied = document.execCommand("copy");
  input.remove();

  if (!copied) {
    throw new Error("The browser rejected the copy command.");
  }
}

/**
 * Телефон в футере: номер — обычная tel-ссылка, иконка справа — кнопка
 * «Скопировать» с всплывающей подсказкой «Скопировано» (как в шапке).
 */
export function FooterPhone() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function flash(next: "success" | "error") {
    setStatus(next);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setStatus("idle");
      timer.current = null;
    }, 2000);
  }

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PHONE_NUMBER);
      } else {
        copyWithFallback(PHONE_NUMBER);
      }
      flash("success");
    } catch {
      try {
        copyWithFallback(PHONE_NUMBER);
        flash("success");
      } catch {
        flash("error");
      }
    }
  }

  return (
    <div className="footer-phone">
      <a href={PHONE_TEL} className="footer-phone__value">
        {PHONE_NUMBER}
      </a>
      <button
        type="button"
        className="footer-phone__copy"
        onClick={handleCopy}
        aria-label="Скопировать номер телефона"
      >
        <CopyIcon width={24} height={24} />
      </button>
      <span
        className={`footer-phone__hint${
          status !== "idle" ? " is-visible" : ""
        }${status === "error" ? " is-error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status === "error" ? "Не удалось скопировать" : "Номер скопирован"}
      </span>
    </div>
  );
}

export default FooterPhone;
