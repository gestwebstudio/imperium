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
    links: [
      { label: "BMW", href: "/bmw" },
      { label: "Mercedes", href: "/mercedes" },
      { label: "Lexus", href: "/lexus" },
    ],
  },
  {
    title: "Услуги",
    links: [
      { label: "Трейд-ин", href: "/trade-in" },
      { label: "Лизинг", href: "/leasing" },
      { label: "Авто под заказ", href: "/car-selection" },
      { label: "Автоателье", href: "/atelier" },
      { label: "Индивидуальный дизайн авто", w: 151 },
      { label: "Помощь на дороге", href: "/help-on-roads" },
    ],
  },
  {
    title: "Imperium Motors",
    links: [
      { label: "О салоне", href: "/about" },
      { label: "Новости", href: "/news" },
      { label: "Контакты", href: "/contacts" },
    ],
  },
];

const SOCIALS = [
  { label: "Telegram", icon: "/icons/tg.svg" },
  { label: "WhatsApp", icon: "/icons/wa.svg" },
  { label: "MAX", icon: "/icons/max.svg" },
];

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
              {SOCIALS.map((s) => (
                <ButtonLink
                  key={s.label}
                  href="#"
                  bare
                  className="footer-social"
                  aria-label={s.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt={s.label} width={42} height={42} />
                </ButtonLink>
              ))}
            </div>
          </div>

          <div className="footer-legal">
            <p>
              Copyright © 2026 Imperium Motors
              <br />
              All Rights Reserved
            </p>
            <Link href="#">Правовые документы</Link>
            <p className="footer-disclaimer">
              Изложенная на данном сайте информация носит ознакомительный
              характер не является публичной офертой, определяемой положениями
              статей 435 и 437 Гражданского Кодекса Российской Федерации
            </p>
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
