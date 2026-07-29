import Link from "next/link";
import "./layout.css";
import { CopyIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

type FooterLink = string | { label: string; w?: number; href?: string };
const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Автомобили",
    links: [
      { label: "Полный каталог", href: "/catalog" },
      { label: "Седаны", href: "/sedan" },
      { label: "Кроссоверы", href: "/crossover" },
      { label: "Внедорожники", href: "/off-road" },
      { label: "Купе", href: "/coupe" },
      { label: "Минивэны", href: "/minivan" },
      { label: "Кабриолеты", href: "/cabriolet" },
    ],
  },
  {
    title: "Подборки брендов",
    links: ["BMW", "Mercedes", "Porsche", "Lexus", "Ferrari"],
  },
  {
    title: "Услуги",
    links: [
      "Трейд-ин",
      "Лизинг",
      "Авто под заказ",
      "Автоателье",
      { label: "Индивидуальный дизайн авто", w: 151 },
      "Помощь на дороге",
    ],
  },
  {
    title: "Imperium Motors",
    links: ["О салоне", { label: "Контакты", href: "/contacts" }],
  },
];

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3l-4.1-1.3c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" clipRule="evenodd" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l4.9-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 7.1 12.3l.6 3-3-.6A8.2 8.2 0 1 1 12 3.8zm4.4 11.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.1-.3.2-.5.1-.7-.3-1.4-.6-2-1.5-.2-.3.2-.3.5-.9.1-.1 0-.3 0-.4 0-.1-.5-1.2-.7-1.7-.2-.4-.4-.4-.5-.4h-.4c-.1 0-.4.1-.5.3-.2.2-.7.7-.7 1.7s.7 1.9.8 2c.1.1 1.4 2.2 3.4 3 .5.2.8.3 1.1.4.5.1.9.1 1.2.1.4-.1 1.3-.6 1.5-1.1.2-.5.2-1 .1-1.1z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-top">
          <div className="footer-cols">
            {columns.map((col) => (
              <div className="footer-col" key={col.title}>
                <div className="footer-col__title">{col.title}</div>
                <nav className="footer-col__list">
                  {col.links.map((link) => {
                    const label = typeof link === "string" ? link : link.label;
                    const w = typeof link === "string" ? undefined : link.w;
                    const href =
                      typeof link === "string" ? "#" : link.href ?? "#";
                    const style = w ? { width: w } : undefined;
                    return href.startsWith("/") ? (
                      <Link href={href} key={label} style={style}>
                        {label}
                      </Link>
                    ) : (
                      <a href={href} key={label} style={style}>
                        {label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="footer-contacts">
            <div>
              <div className="footer-phone__label">Телефон</div>
              <a href="tel:+74997041444" className="footer-phone__value">
                +7 499 704-14-44
                <span className="copy">
                  <CopyIcon width={24} height={24} />
                </span>
              </a>
            </div>
            <div className="footer-socials">
              <ButtonLink
                href="#"
                bare
                className="footer-social"
                aria-label="Telegram"
              >
                <TelegramIcon />
              </ButtonLink>
              <ButtonLink
                href="#"
                bare
                className="footer-social"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </ButtonLink>
              <ButtonLink
                href="#"
                bare
                className="footer-social"
                aria-label="WhatsApp"
              >
                <WhatsappIcon />
              </ButtonLink>
            </div>
          </div>

          <div className="footer-legal">
            <p>
              Copyright © 2026 Imperium Motors
              <br />
              All Rights Reserved
            </p>
            <Link href="#">Правовые документы</Link>
          </div>
        </div>

        <p className="footer-tagline">Салон премиальных автомобилей со всего мира</p>
        <div className="footer-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo_footer.svg" alt="Imperium Motors" />
        </div>
      </div>
    </footer>
  );
}
