import Link from "next/link";
import "./layout.css";
import { PhoneIcon, ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";

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
  return (
    <header className="site-header">
      <GlassSurface
        className="site-header__bar"
        backgroundOpacity={0.28}
        saturation={1.1}
        lightAngle={-45}
        lightIntensity={80}
        refraction={100}
        depth={100}
        dispersion={100}
        frost={12}
        splay={80}
      >
        <nav className="site-header__nav">
          <a href="#">
            Услуги
            <ChevronDown />
          </a>
          <a href="#">О салоне</a>
          <a href="#">Контакты</a>
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
            aria-label="Позвонить"
          >
            <PhoneIcon />
          </ButtonLink>
          <ButtonLink
            href="/catalog"
            variant="primary-cta"
            ctaIcon={<ArrowDiagonalIcon />}
          >
            Каталог
          </ButtonLink>
        </div>
      </GlassSurface>
    </header>
  );
}
