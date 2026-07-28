"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, PhoneIcon, ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Мобильная навигация (≤960px): кнопка-бургер в шапке + выезжающий drawer.
 * Drawer рендерится порталом в <body>, чтобы уйти из-под backdrop-filter
 * шапки (иначе position:fixed считался бы от плашки, а не от экрана).
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Закрыть меню, если ширина ушла выше мобильного брейка (960px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1201px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="site-header__burger"
        aria-label="Открыть меню"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {mounted &&
        createPortal(
          <div className={cn("mobile-menu", open && "is-open")} aria-hidden={!open}>
            <div className="mobile-menu__backdrop" onClick={close} />
            <aside
              className="mobile-menu__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Меню"
            >
              <button
                type="button"
                className="mobile-menu__close"
                aria-label="Закрыть меню"
                onClick={close}
              >
                <CloseIcon width={16} height={16} />
              </button>

              <nav className="mobile-menu__nav">
                <a href="#" onClick={close}>
                  Услуги
                </a>
                <a href="#" onClick={close}>
                  О салоне
                </a>
                <a href="#" onClick={close}>
                  Контакты
                </a>
              </nav>

              <div className="mobile-menu__actions">
                <ButtonLink
                  href="/catalog"
                  variant="primary-cta"
                  ctaIcon={<ArrowDiagonalIcon />}
                  onClick={close}
                >
                  Каталог
                </ButtonLink>
                <a
                  className="mobile-menu__phone"
                  href="tel:+74997041444"
                  onClick={close}
                >
                  <PhoneIcon width={20} height={20} />
                  +7 499 704-14-44
                </a>
              </div>
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
}
