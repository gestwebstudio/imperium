"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowDiagonalIcon } from "@/components/icons";

type MegaLink = { label: string; href: string };
type MegaGroup = { title: string; bg: string; links: MegaLink[] };

/**
 * Три карточки услуг (по мотивам React Bits «Card Nav»). Цвета — из кита.
 * Разворот с GSAP-стаггером карточек. Открывается по клику на «Услуги» в шапке.
 */
const GROUPS: MegaGroup[] = [
  {
    title: "Финансовые услуги",
    bg: "var(--color-heritage-green-500, #294434)",
    links: [
      { label: "Трейд-ин", href: "/trade-in" },
      { label: "Лизинг", href: "/leasing" },
    ],
  },
  {
    title: "Персонализация",
    bg: "var(--color-heritage-green-600, #213227)",
    links: [
      { label: "Автоателье", href: "/atelier" },
      { label: "Индивидуальный дизайн", href: "/veles" },
    ],
  },
  {
    title: "Сопровождение",
    bg: "var(--color-carbon-black-500, #1B1E1D)",
    links: [
      { label: "Авто под заказ", href: "/car-selection" },
      { label: "Помощь на дороге", href: "/help-on-roads" },
    ],
  },
];

const EASE = "power3.out";

export function ServicesMega({
  open,
  onClose,
  id,
}: {
  open: boolean;
  onClose: () => void;
  id?: string;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const firstRun = useRef(true);

  useEffect(() => {
    const panel = panelRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!panel) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.killTweensOf([panel, ...cards]);

    // Первый рендер в закрытом состоянии — просто спрятать без анимации.
    if (firstRun.current && !open) {
      firstRun.current = false;
      gsap.set(panel, { autoAlpha: 0, y: -8 });
      gsap.set(cards, { y: 20, autoAlpha: 0 });
      return;
    }
    firstRun.current = false;

    if (open) {
      if (reduce) {
        gsap.set(panel, { autoAlpha: 1, y: 0 });
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.to(panel, { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE });
      gsap.fromTo(
        cards,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          ease: EASE,
          stagger: 0.08,
          delay: 0.05,
        },
      );
    } else {
      if (reduce) {
        gsap.set(panel, { autoAlpha: 0, y: -8 });
        gsap.set(cards, { autoAlpha: 0, y: 20 });
        return;
      }
      gsap.to(panel, { autoAlpha: 0, y: -8, duration: 0.2, ease: EASE });
      gsap.to(cards, { autoAlpha: 0, duration: 0.15 });
    }
  }, [open]);

  return (
    <div
      className={`services-mega${open ? " is-open" : ""}`}
      aria-hidden={!open}
    >
      <div className="services-mega__inner">
        <div className="services-mega__panel" ref={panelRef} id={id}>
          {GROUPS.map((group, gi) => (
            <div
              className="services-mega__card"
              key={group.title}
              style={{ backgroundColor: group.bg }}
              ref={(el) => {
                if (el) cardsRef.current[gi] = el;
              }}
            >
              <div className="services-mega__card-title">{group.title}</div>
              <div className="services-mega__card-links">
                {group.links.map((lnk) => (
                  <Link
                    key={lnk.href}
                    href={lnk.href}
                    className="services-mega__link"
                    tabIndex={open ? 0 : -1}
                    onClick={onClose}
                  >
                    <ArrowDiagonalIcon className="services-mega__link-icon" />
                    {lnk.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
