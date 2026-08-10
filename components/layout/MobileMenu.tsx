"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ChevronDownIcon, CloseIcon, PhoneIcon } from "@/components/icons";
import {
  ButtonRippleLayer,
  handleButtonRipplePointerDown,
} from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type SubLink = { label: string; href: string };
type SectionKey = "catalog" | "brands" | "services";
type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "section"; key: SectionKey; label: string; links: SubLink[] };

/**
 * Основная навигация мобильного меню. «Каталог», «Бренды» и «Услуги» —
 * раскрывающиеся разделы (accordion). Ссылки берём из футера (кузова/бренды).
 */
const primaryNav: NavItem[] = [
  {
    type: "section",
    key: "catalog",
    label: "Каталог",
    links: [
      { label: "Все автомобили", href: "/catalog" },
      { label: "Седаны", href: "/sedan" },
      { label: "Кроссоверы", href: "/crossover" },
      { label: "Внедорожники", href: "/off-road" },
      { label: "Купе", href: "/coupe" },
      { label: "Минивэны", href: "/minivan" },
      { label: "Кабриолеты", href: "/cabriolet" },
    ],
  },
  {
    type: "section",
    key: "brands",
    label: "Бренды",
    links: [
      { label: "BMW", href: "/bmw" },
      { label: "Mercedes-Benz", href: "/mercedes" },
      { label: "Lexus", href: "/lexus" },
    ],
  },
  {
    type: "section",
    key: "services",
    label: "Услуги",
    links: [
      { label: "Трейд-ин", href: "/trade-in" },
      { label: "Лизинг", href: "/leasing" },
      { label: "Авто под заказ", href: "/car-selection" },
      { label: "Автоателье", href: "/atelier" },
      { label: "Индивидуальный дизайн авто", href: "/veles" },
      { label: "Помощь на дорогах", href: "/help-on-roads" },
    ],
  },
  { type: "link", label: "О салоне", href: "/about" },
  { type: "link", label: "Контакты", href: "/contacts" },
];

// Нижняя вторичная группа — меньшая типографика, без номеров.
const secondaryNav: SubLink[] = [
  { label: "Избранное", href: "/favorites" },
  { label: "Сравнение", href: "/comparison" },
];

/** Раздел, которому принадлежит текущий путь (для current-state и авто-раскрытия). */
function sectionForPath(pathname: string | null): SectionKey | null {
  if (!pathname) return null;
  for (const item of primaryNav) {
    if (item.type !== "section") continue;
    if (item.links.some((l) => pathname === l.href)) return item.key;
  }
  return null;
}

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
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const openRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const currentSection = sectionForPath(pathname);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
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
      gsap.set([panel, ...layers], { xPercent: 100 });
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
          xPercent: 100,
          duration: 0.36 * motion,
          ease: "power3.in",
        },
        0.08 * motion,
      )
      .to(
        [...layers].reverse(),
        {
          xPercent: 100,
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
    // Авто-раскрытие раздела, если пользователь на одной из его страниц.
    setOpenSection(sectionForPath(pathnameRef.current));

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
      gsap.set([panel, ...layers], { xPercent: 100 });
      gsap.set(labels, { yPercent: 130, rotate: 6 });
      gsap.set(panelHead, { y: 24, opacity: 0 });

      if (prefersReducedMotion()) {
        gsap.set([panel, ...layers], { xPercent: 0 });
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(labels, { yPercent: 0, rotate: 0 });
        gsap.set(panelHead, { y: 0, opacity: 1 });
        panel.querySelector<HTMLElement>(".mobile-menu__item")?.focus();
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          panel.querySelector<HTMLElement>(".mobile-menu__item")?.focus();
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

  // Раскрыт одновременно только один раздел; повторный клик — сворачивает.
  const toggleSection = useCallback((key: SectionKey) => {
    setOpenSection((prev) => (prev === key ? null : key));
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
        ).filter((el) => !el.closest("[inert]"));
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

  let primaryIndex = 0;

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
              tabIndex={-1}
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
                  className="mobile-menu__close ui-button--no-ripple"
                  aria-label="Закрыть меню"
                  onClick={close}
                >
                  <span>Закрыть</span>
                  <CloseIcon width={20} height={20} />
                </button>
              </div>

              <nav className="mobile-menu__nav" aria-label="Основная навигация">
                <ul className="mobile-menu__list">
                  {primaryNav.map((item) => {
                    primaryIndex += 1;
                    const dataIndex = String(primaryIndex).padStart(2, "0");

                    if (item.type === "link") {
                      const active = pathname === item.href;
                      return (
                        <li className="mobile-menu__item-wrap" key={item.label}>
                          <Link
                            className={cn(
                              "mobile-menu__item",
                              active && "is-current",
                            )}
                            href={item.href}
                            data-index={dataIndex}
                            aria-current={active ? "page" : undefined}
                            onClick={close}
                          >
                            <span className="mobile-menu__item-label">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      );
                    }

                    const isOpen = openSection === item.key;
                    const isCurrentSection = currentSection === item.key;
                    const panelId = `mobile-submenu-${item.key}`;

                    return (
                      <li className="mobile-menu__item-wrap" key={item.key}>
                        <button
                          type="button"
                          className={cn(
                            "mobile-menu__item mobile-menu__trigger",
                            "ui-button--no-ripple",
                            isCurrentSection && "is-current",
                            isOpen && "is-open",
                          )}
                          data-index={dataIndex}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggleSection(item.key)}
                        >
                          <span className="mobile-menu__item-label">
                            {item.label}
                          </span>
                          <ChevronDownIcon
                            className="mobile-menu__chevron"
                            aria-hidden="true"
                          />
                        </button>

                        <div
                          id={panelId}
                          className={cn(
                            "mobile-submenu",
                            isOpen && "is-open",
                          )}
                          inert={isOpen ? undefined : true}
                        >
                          <div className="mobile-submenu__inner">
                            {item.links.map((link) => {
                              const active = pathname === link.href;
                              return (
                                <Link
                                  key={link.href}
                                  className={cn(
                                    "mobile-submenu__link",
                                    active && "is-active",
                                  )}
                                  href={link.href}
                                  aria-current={active ? "page" : undefined}
                                  onClick={close}
                                >
                                  {link.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div
                  className="mobile-menu__secondary"
                  aria-label="Дополнительно"
                >
                  {secondaryNav.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        className={cn(
                          "mobile-menu__secondary-link",
                          active && "is-active",
                        )}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={close}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
}
