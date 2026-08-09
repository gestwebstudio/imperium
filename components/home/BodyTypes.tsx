import { cn } from "@/lib/cn";
import { ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { LeadModal } from "@/components/ui/LeadModal";

type BodyType = {
  title: string;
  subtitle: string;
  image: string;
  largeImage: string;
  desktopImage: string;
  tabletImage: string;
  mobileImage: string;
  href: string;
  className?: string;
};

const grid: BodyType[] = [
  {
    title: "Купе",
    subtitle: "Динамичный дизайн и яркие эмоции от каждой поездки",
    image: "/images/typeofcar/coupe.webp",
    largeImage: "/images/typeofcar/adaptive/coupe.webp",
    desktopImage: "/images/typeofcar/adaptive/coupe.webp",
    tabletImage: "/images/typeofcar/adaptive/coupe.webp",
    mobileImage: "/images/typeofcar/adaptive/coupe.webp",
    href: "/coupe",
    className: "bento__a",
  },
  {
    title: "Кабриолеты",
    subtitle: "Открытая дорога, лёгкость и максимум впечатлений",
    image: "/images/typeofcar/cabriolet.webp",
    largeImage: "/images/typeofcar/adaptive/cabriolet-1536.webp",
    desktopImage: "/images/typeofcar/adaptive/cabriolet-1200.webp",
    tabletImage: "/images/typeofcar/adaptive/cabriolet-tablet.webp",
    mobileImage: "/images/typeofcar/adaptive/cabriolet-1536.webp",
    href: "/cabriolet",
    className: "bento__b",
  },
  {
    title: "Внедорожники",
    subtitle: "Уверенность, комфорт и свобода на любых маршрутах",
    image: "/images/typeofcar/off-road.webp",
    largeImage: "/images/typeofcar/adaptive/off-road-1536.webp",
    desktopImage: "/images/typeofcar/adaptive/off-road-1200.webp",
    tabletImage: "/images/typeofcar/adaptive/off-road-tablet.webp",
    mobileImage: "/images/typeofcar/adaptive/off-road-tablet.webp",
    href: "/off-road",
    className: "bento__c",
  },
  {
    title: "Минивэны",
    subtitle: "Простор для семьи, бизнеса и дальних путешествий",
    image: "/images/typeofcar/minivan.webp",
    largeImage: "/images/typeofcar/adaptive/minivan.webp",
    desktopImage: "/images/typeofcar/adaptive/minivan.webp",
    tabletImage: "/images/typeofcar/adaptive/minivan.webp",
    mobileImage: "/images/typeofcar/adaptive/minivan.webp",
    href: "/minivan",
    className: "bento__d",
  },
  {
    title: "Кроссоверы",
    subtitle: "Универсальность для города и активного образа жизни",
    image: "/images/typeofcar/crossover.webp",
    largeImage: "/images/typeofcar/adaptive/crossover.webp",
    desktopImage: "/images/typeofcar/adaptive/crossover.webp",
    tabletImage: "/images/typeofcar/adaptive/crossover.webp",
    mobileImage: "/images/typeofcar/adaptive/crossover.webp",
    href: "/crossover",
    className: "bento__e",
  },
];

const sedan: BodyType = {
  title: "Седаны",
  subtitle: "Элегантность, комфорт и безупречный стиль на каждый день",
  image: "/images/typeofcar/sedan.webp",
  largeImage: "/images/typeofcar/adaptive/sedan-desktop.webp",
  desktopImage: "/images/typeofcar/adaptive/sedan-desktop.webp",
  tabletImage: "/images/typeofcar/adaptive/sedan-tablet.webp",
  mobileImage: "/images/typeofcar/adaptive/sedan-tablet.webp",
  href: "/sedan",
  className: "body-type-card--wide",
};

function BodyTypeCard({
  title,
  subtitle,
  image,
  largeImage,
  desktopImage,
  tabletImage,
  mobileImage,
  href,
  className,
}: BodyType) {
  return (
    <ButtonLink href={href} bare className={cn("body-type-card", className)}>
      <picture>
        <source media="(max-width: 640px)" srcSet={mobileImage} />
        <source
          media="(min-width: 1367px) and (max-width: 1536px)"
          srcSet={largeImage}
        />
        <source
          media="(min-width: 961px) and (max-width: 1366px)"
          srcSet={desktopImage}
        />
        <source
          media="(min-width: 641px) and (max-width: 960px)"
          srcSet={tabletImage}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="body-type-card__img" src={image} alt={title} />
      </picture>
      <span className="body-type-card__grad" />
      <div className="body-type-card__text">
        <h3 className="body-type-card__title">{title}</h3>
        <p className="body-type-card__sub">{subtitle}</p>
      </div>
      <span className="body-type-card__arrow">
        <ArrowDiagonalIcon />
      </span>
    </ButtonLink>
  );
}

export function BodyTypes() {
  return (
    <section className="home-wrap body-types">
      <div className="body-types__inner">
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
            <LeadModal
              triggerLabel="Консультация"
              triggerVariant="secondary-outlined"
              triggerClassName="body-types__consultation"
              title="Консультация по подбору"
              description="Оставьте контакты — специалист поможет определиться с форматом автомобиля под ваши задачи и подберёт подходящие варианты."
              submitLabel="Отправить заявку"
              successTitle="Заявка принята"
              successText="Специалист Imperium Motors свяжется с вами и поможет с выбором автомобиля."
              comment
              commentLabel="Что для вас важно"
              commentPlaceholder="Задачи, образ жизни, бюджет, пожелания"
            />
          </div>
        </div>

        <div className="body-types__grid">
          <div className="bento">
            {grid.map((c) => (
              <BodyTypeCard key={c.title} {...c} />
            ))}
          </div>
          <BodyTypeCard {...sedan} />
        </div>
      </div>
    </section>
  );
}
