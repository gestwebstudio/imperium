"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { Alert, Button as HeroButton } from "@heroui/react";
import "./header.css";
import "./layout.css";
import {
  PhoneIcon,
  ArrowDiagonalIcon,
  ChevronDownIcon,
  CloseIcon,
} from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { MobileMenu } from "./MobileMenu";
import { ServicesMega } from "./ServicesMega";

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
function useHideOnScroll(enabled: boolean) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }

    let lastY = window.scrollY;
    let ticking = false;

    const TOP_EDGE = 8;
    const HEADROOM_THRESHOLD = 120;
    const TOLERANCE = 8; // порог, чтобы дрожание/отскок не переключали шапку
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      if (Math.abs(y - lastY) < TOLERANCE) return; // игнор мелких движений
      if (y <= TOP_EDGE) setHidden(false); // у верха — всегда видима
      else if (y <= HEADROOM_THRESHOLD) setHidden(false); // первый экранный порог
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
  }, [enabled]);

  return hidden;
}

export function Header({ flowWithPage = false }: { flowWithPage?: boolean }) {
  const hidden = useHideOnScroll(!flowWithPage);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const copyStatusTimer = useRef<number | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    return () => {
      if (copyStatusTimer.current !== null) {
        window.clearTimeout(copyStatusTimer.current);
      }
    };
  }, []);

  // Закрытие выпадайки услуг: клик вне, Escape, заметный скролл.
  useEffect(() => {
    if (!servicesOpen) return;

    let lastScrollY = window.scrollY;
    let accumulatedScroll = 0;
    const CLOSE_SCROLL_THRESHOLD = 16;

    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        !servicesRef.current?.contains(t) &&
        !servicesTriggerRef.current?.contains(t)
      ) {
        setServicesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      e.preventDefault();
      setServicesOpen(false);
      servicesTriggerRef.current?.focus({ preventScroll: true });
    };
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      accumulatedScroll += Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (accumulatedScroll >= CLOSE_SCROLL_THRESHOLD) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [servicesOpen]);

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
    <header
      className={`site-header${hidden ? " is-hidden" : ""}${
        flowWithPage ? " is-flowing" : ""
      }`}
    >
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
          <button
            type="button"
            ref={servicesTriggerRef}
            className={`site-header__nav-trigger ui-button--no-ripple${servicesOpen ? " is-open" : ""}`}
            aria-expanded={servicesOpen}
            aria-controls="services-mega-panel"
            onClick={() => setServicesOpen((v) => !v)}
          >
            Услуги
            <ChevronDownIcon />
          </button>
          <Link href="/about">О салоне</Link>
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
            size="m"
            variant="primary-cta"
            className="site-header__cta"
            ctaIcon={<ArrowDiagonalIcon />}
          >
            Каталог
          </ButtonLink>
        </div>
      </GlassSurface>
      <div ref={servicesRef}>
        <ServicesMega
          open={servicesOpen}
          onClose={() => setServicesOpen(false)}
          id="services-mega-panel"
        />
      </div>
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
