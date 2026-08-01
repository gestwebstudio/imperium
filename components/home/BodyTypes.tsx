import { cn } from "@/lib/cn";
import { ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

type BodyType = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  className?: string;
};

const grid: BodyType[] = [
  {
    title: "Купе",
    subtitle: "Динамичный дизайн и яркие эмоции от каждой поездки",
    image: "/images/typeofcar/coupe.webp",
    href: "/coupe",
    className: "bento__a",
  },
  {
    title: "Кабриолеты",
    subtitle: "Открытая дорога, лёгкость и максимум впечатлений",
    image: "/images/typeofcar/cabriolet.webp",
    href: "/cabriolet",
    className: "bento__b",
  },
  {
    title: "Внедорожники",
    subtitle: "Уверенность, комфорт и свобода на любых маршрутах",
    image: "/images/typeofcar/off-road.webp",
    href: "/off-road",
    className: "bento__c",
  },
  {
    title: "Минивэны",
    subtitle: "Простор для семьи, бизнеса и дальних путешествий",
    image: "/images/typeofcar/minivan.webp",
    href: "/minivan",
    className: "bento__d",
  },
  {
    title: "Кроссоверы",
    subtitle: "Универсальность для города и активного образа жизни",
    image: "/images/typeofcar/crossover.webp",
    href: "/crossover",
    className: "bento__e",
  },
];

const sedan: BodyType = {
  title: "Седаны",
  subtitle: "Элегантность, комфорт и безупречный стиль на каждый день",
  image: "/images/typeofcar/sedan.webp",
  href: "/sedan",
  className: "body-type-card--wide",
};

function BodyTypeCard({ title, subtitle, image, href, className }: BodyType) {
  return (
    <a href={href} className={cn("body-type-card", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="body-type-card__img" src={image} alt={title} />
      <span className="body-type-card__grad" />
      <div className="body-type-card__text">
        <h3 className="body-type-card__title">{title}</h3>
        <p className="body-type-card__sub">{subtitle}</p>
      </div>
      <span className="body-type-card__arrow">
        <ArrowDiagonalIcon />
      </span>
    </a>
  );
}

export function BodyTypes() {
  return (
    <section className="home-wrap body-types">
      <div className="body-types__head">
        <h2 className="body-types__title">
          <span className="l1">Найдите</span>
          <span className="l2">свой формат</span>
        </h2>
        <div className="body-types__aside">
          <p className="body-types__sub">
            Поможем подобрать автомобиль, который соответствует вашим задачам,
            образу жизни и ожиданиям от комфорта
          </p>
          <ButtonLink href="#" size="l" variant="secondary-outlined">
            Консультация
          </ButtonLink>
        </div>
      </div>

      <div className="bento">
        {grid.map((c) => (
          <BodyTypeCard key={c.title} {...c} />
        ))}
      </div>
      <BodyTypeCard {...sedan} />
    </section>
  );
}
