"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { Alert, Button as HeroButton } from "@heroui/react";
import "./layout.css";
import { PhoneIcon, ArrowDiagonalIcon, CloseIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { MobileMenu } from "./MobileMenu";

const PHONE_NUMBER = "+7 499 704-14-44";

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
    const HIDE_AFTER = 120; // у верха шапка стоит на месте; headroom — только дальше
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      if (Math.abs(y - lastY) < TOLERANCE) return; // игнор мелких движений
      if (y <= HIDE_AFTER) setHidden(false); // у верха/начале скролла — всегда видима
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
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const copyStatusTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyStatusTimer.current !== null) {
        window.clearTimeout(copyStatusTimer.current);
      }
    };
  }, []);

  function showCopyStatus(status: "success" | "error") {
    setCopyStatus(status);

    if (copyStatusTimer.current !== null) {
      window.clearTimeout(copyStatusTimer.current);
    }

    copyStatusTimer.current = window.setTimeout(() => {
      setCopyStatus("idle");
      copyStatusTimer.current = null;
    }, 2400);
  }

  function hideCopyStatus() {
    if (copyStatusTimer.current !== null) {
      window.clearTimeout(copyStatusTimer.current);
      copyStatusTimer.current = null;
    }
    setCopyStatus("idle");
  }

  async function handlePhoneClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia("(min-width: 1200px)").matches) return;

    event.preventDefault();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PHONE_NUMBER);
      } else {
        copyWithFallback(PHONE_NUMBER);
      }
      showCopyStatus("success");
    } catch {
      try {
        copyWithFallback(PHONE_NUMBER);
        showCopyStatus("success");
      } catch {
        showCopyStatus("error");
      }
    }
  }

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
            onClick={handlePhoneClick}
          >
            <span className="header-call__number" aria-hidden="true">
              {PHONE_NUMBER}
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
      <Alert
        status={copyStatus === "error" ? "danger" : "success"}
        className={`header-copy-alert${
          copyStatus !== "idle" ? " is-visible" : ""
        }${copyStatus === "error" ? " is-error" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>
            {copyStatus === "error"
              ? "Не удалось скопировать номер"
              : copyStatus === "success"
                ? "Номер скопирован"
                : ""}
          </Alert.Title>
        </Alert.Content>
        <HeroButton
          isIconOnly
          size="sm"
          variant="tertiary"
          className="header-copy-alert__close"
          aria-label="Закрыть уведомление"
          onClick={hideCopyStatus}
        >
          <CloseIcon />
        </HeroButton>
      </Alert>
    </header>
  );
}
