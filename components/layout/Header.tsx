import Link from "next/link";
import "./layout.css";
import { PhoneIcon, ArrowDiagonalIcon } from "@/components/icons";

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
      <div className="site-header__bar">
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
          <a href="tel:+74997041444" className="header-call" aria-label="Позвонить">
            <PhoneIcon />
          </a>
          <Link href="/catalog" className="btn btn--primary-cta">
            <span>Каталог</span>
            <span className="btn__cta-icon">
              <ArrowDiagonalIcon />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
