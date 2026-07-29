"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./layout.css";
import { PhoneIcon, ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { MobileMenu } from "./MobileMenu";

/**
 * «Headroom»: при скролле вниз шапка уезжает вверх (скрывается),
 * при скролле вверх — возвращается и остаётся зафиксированной.
 * У самого верха страницы всегда видима.
 */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const TOLERANCE = 8; // порог, чтобы дрожание/отскок не переключали шапку
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      if (Math.abs(y - lastY) < TOLERANCE) return; // игнор мелких движений
      if (y <= 8) setHidden(false); // у верха — всегда видима
      else if (y > lastY) setHidden(true); // вниз — прячем
      else setHidden(false); // вверх — показываем
      lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const hidden = useHideOnScroll();

  return (
    <header className={`site-header${hidden ? " is-hidden" : ""}`}>
      <GlassSurface
        className="site-header__bar"
        height="var(--site-header-height)"
        backgroundOpacity={0.06}
        saturation={1.02}
        lightAngle={-45}
        lightIntensity={35}
        refraction={100}
        depth={75}
        frost={3}
        splay={70}
      >
        <MobileMenu />

        <nav className="site-header__nav">
          <a href="#">
            Услуги
            <ChevronDown />
          </a>
          <a href="#">О салоне</a>
          <Link href="/contacts">Контакты</Link>
        </nav>

        <Link href="/" className="site-header__logo" aria-label="Imperium Motors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo_head.svg" alt="Imperium Motors" />
        </Link>

        <div className="site-header__actions">
          <ButtonLink
            href="tel:+74997041444"
            bare
            className="header-call"
            aria-label="Позвонить: +7 499 704-14-44"
          >
            <span className="header-call__number" aria-hidden="true">
              +7 499 704-14-44
            </span>
            <PhoneIcon />
          </ButtonLink>
          <ButtonLink
            href="/catalog"
            variant="primary-cta"
            className="site-header__cta"
            ctaIcon={<ArrowDiagonalIcon />}
          >
            Каталог
          </ButtonLink>
        </div>
      </GlassSurface>
    </header>
  );
}
