"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { gsap } from "gsap";
import { CloseIcon, PhoneIcon } from "@/components/icons";
import {
  ButtonRippleLayer,
  handleButtonRipplePointerDown,
} from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const menuItems = [
  { label: "Каталог", href: "/catalog" },
  { label: "Услуги", href: "#" },
  { label: "О салоне", href: "#" },
  { label: "Контакты", href: "/contacts" },
] as const;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getMotionFactor() {
  const width = window.innerWidth;
  if (width <= 390) return 0.68;
  if (width <= 640) return 0.78;
  if (width <= 768) return 0.84;
  if (width <= 1024) return 0.92;
  return 1;
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const finishClose = useCallback(() => {
    setVisible(false);
    triggerRef.current?.focus();
  }, []);

  const close = useCallback(() => {
    if (!openRef.current && !visible) return;

    openRef.current = false;
    setOpen(false);
    timelineRef.current?.kill();

    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const layers = layersRef.current
      ? Array.from(layersRef.current.children)
      : [];

    if (!backdrop || !panel) {
      finishClose();
      return;
    }

    const labels = panel.querySelectorAll(".mobile-menu__item-label");
    const panelHead = panel.querySelector(".mobile-menu__panel-head");
    const motion = getMotionFactor();

    if (prefersReducedMotion()) {
      gsap.set([panel, ...layers], { xPercent: -100 });
      gsap.set(backdrop, { opacity: 0 });
      finishClose();
      return;
    }

    const timeline = gsap.timeline({
      onComplete: finishClose,
    });
    timelineRef.current = timeline;

    timeline
      .to(
        labels,
        {
          yPercent: 125,
          rotate: 4,
          duration: 0.22 * motion,
          ease: "power2.in",
          stagger: { each: 0.035 * motion, from: "end" },
        },
        0,
      )
      .to(panelHead, { y: 16, opacity: 0, duration: 0.18 * motion }, 0)
      .to(
        panel,
        {
          xPercent: -100,
          duration: 0.36 * motion,
          ease: "power3.in",
        },
        0.08 * motion,
      )
      .to(
        [...layers].reverse(),
        {
          xPercent: -100,
          duration: 0.3 * motion,
          ease: "power3.in",
          stagger: 0.04 * motion,
        },
        0.12 * motion,
      )
      .to(
        backdrop,
        { opacity: 0, duration: 0.24 * motion, ease: "power2.in" },
        0.08 * motion,
      );
  }, [finishClose, visible]);

  const openMenu = useCallback(() => {
    if (openRef.current) return;

    openRef.current = true;
    setVisible(true);
    setOpen(true);

    requestAnimationFrame(() => {
      const backdrop = backdropRef.current;
      const panel = panelRef.current;
      const layers = layersRef.current
        ? Array.from(layersRef.current.children)
        : [];

      if (!backdrop || !panel) return;

      timelineRef.current?.kill();
      const labels = panel.querySelectorAll(".mobile-menu__item-label");
      const panelHead = panel.querySelector(".mobile-menu__panel-head");
      const motion = getMotionFactor();

      gsap.set(backdrop, { opacity: 0 });
      gsap.set([panel, ...layers], { xPercent: -100 });
      gsap.set(labels, { yPercent: 130, rotate: 6 });
      gsap.set(panelHead, { y: 24, opacity: 0 });

      if (prefersReducedMotion()) {
        gsap.set([panel, ...layers], { xPercent: 0 });
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(labels, { yPercent: 0, rotate: 0 });
        gsap.set(panelHead, { y: 0, opacity: 1 });
        panel.querySelector<HTMLAnchorElement>(".mobile-menu__item")?.focus();
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          panel.querySelector<HTMLAnchorElement>(".mobile-menu__item")?.focus();
        },
      });
      timelineRef.current = timeline;

      timeline.to(backdrop, { opacity: 1, duration: 0.22 * motion }, 0);
      layers.forEach((layer, index) => {
        timeline.to(
          layer,
          {
            xPercent: 0,
            duration: 0.48 * motion,
            ease: "power4.out",
          },
          index * 0.07 * motion,
        );
      });

      const panelStart = Math.max(0.08, layers.length * 0.07) * motion;
      timeline
        .to(
          panel,
          {
            xPercent: 0,
            duration: 0.62 * motion,
            ease: "power4.out",
          },
          panelStart,
        )
        .to(
          panelHead,
          {
            y: 0,
            opacity: 1,
            duration: 0.45 * motion,
            ease: "power3.out",
          },
          panelStart + 0.12 * motion,
        )
        .to(
          labels,
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.82 * motion,
            ease: "power4.out",
            stagger: 0.09 * motion,
          },
          panelStart + 0.14 * motion,
        );
    });
  }, []);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();

      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, visible]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1201px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [close]);

  useEffect(
    () => () => {
      timelineRef.current?.kill();
    },
    [],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn("ui-button site-header__burger", open && "is-open")}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls="mobile-staggered-menu"
        onPointerDown={handleButtonRipplePointerDown}
        onClick={open ? close : openMenu}
      >
        <ButtonRippleLayer />
        {/* Exact exported Figma asset, scaled by the responsive header styles. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/Menu.svg" alt="" aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-staggered-menu"
            className={cn("mobile-menu", visible && "is-visible")}
            data-open={open || undefined}
            aria-hidden={!open}
          >
            <button
              ref={backdropRef}
              type="button"
              className="mobile-menu__backdrop"
              aria-label="Закрыть меню"
              tabIndex={open ? 0 : -1}
              onClick={close}
            />

            <div
              ref={layersRef}
              className="mobile-menu__prelayers"
              aria-hidden="true"
            >
              <div className="mobile-menu__prelayer mobile-menu__prelayer--taupe" />
              <div className="mobile-menu__prelayer mobile-menu__prelayer--green" />
            </div>

            <aside
              ref={panelRef}
              className="mobile-menu__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Меню"
              inert={open ? undefined : true}
            >
              <div className="mobile-menu__panel-head">
                <a
                  className="mobile-menu__phone"
                  href="tel:+74997041444"
                  onClick={close}
                >
                  <PhoneIcon width={20} height={20} />
                  +7 499 704-14-44
                </a>
                <button
                  type="button"
                  className="mobile-menu__close"
                  aria-label="Закрыть меню"
                  onClick={close}
                >
                  <span>Закрыть</span>
                  <CloseIcon width={20} height={20} />
                </button>
              </div>

              <nav className="mobile-menu__nav" aria-label="Основная навигация">
                <ol className="mobile-menu__list">
                  {menuItems.map((item, index) => (
                    <li className="mobile-menu__item-wrap" key={item.label}>
                      <Link
                        className="mobile-menu__item"
                        href={item.href}
                        data-index={String(index + 1).padStart(2, "0")}
                        onClick={close}
                      >
                        <span className="mobile-menu__item-label">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
}
