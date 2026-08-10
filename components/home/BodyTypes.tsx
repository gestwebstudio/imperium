import { cn } from "@/lib/cn";
import { ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { LeadModal } from "@/components/ui/LeadModal";

type BodyType = {
  title: string;
  subtitle: string;
  imageKey:
    | "coupe"
    | "cabriolet"
    | "off-road"
    | "minivan"
    | "crossover"
    | "sedan";
  href: string;
  className?: string;
};

const imageBreakpoints = [
  { media: "(min-width: 1537px)", folder: "1920" },
  { media: "(min-width: 1201px)", folder: "1536" },
  { media: "(min-width: 961px)", folder: "1200" },
  { media: "(min-width: 769px)", folder: "960" },
  { media: "(min-width: 641px)", folder: "768" },
  { media: "(min-width: 481px)", folder: "640" },
  { media: "(min-width: 391px)", folder: "480" },
] as const;

const grid: BodyType[] = [
  {
    title: "Купе",
    subtitle: "Динамичный дизайн и яркие эмоции от каждой поездки",
    imageKey: "coupe",
    href: "/coupe",
    className: "bento__a",
  },
  {
    title: "Кабриолеты",
    subtitle: "Открытая дорога, лёгкость и максимум впечатлений",
    imageKey: "cabriolet",
    href: "/cabriolet",
    className: "bento__b",
  },
  {
    title: "Внедорожники",
    subtitle: "Уверенность, комфорт и свобода на любых маршрутах",
    imageKey: "off-road",
    href: "/off-road",
    className: "bento__c",
  },
  {
    title: "Минивэны",
    subtitle: "Простор для семьи, бизнеса и дальних путешествий",
    imageKey: "minivan",
    href: "/minivan",
    className: "bento__d",
  },
  {
    title: "Кроссоверы",
    subtitle: "Универсальность для города и активного образа жизни",
    imageKey: "crossover",
    href: "/crossover",
    className: "bento__e",
  },
];

const sedan: BodyType = {
  title: "Седаны",
  subtitle: "Элегантность, комфорт и безупречный стиль на каждый день",
  imageKey: "sedan",
  href: "/sedan",
  className: "body-type-card--wide",
};

function BodyTypeCard({
  title,
  subtitle,
  imageKey,
  href,
  className,
}: BodyType) {
  return (
    <ButtonLink href={href} bare className={cn("body-type-card", className)}>
      <picture>
        {imageBreakpoints.map(({ media, folder }) => (
          <source
            key={folder}
            media={media}
            srcSet={`/images/body-types/${folder}/${imageKey}.jpg`}
          />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="body-type-card__img"
          src={`/images/body-types/390/${imageKey}.jpg`}
          alt={title}
          loading="lazy"
          decoding="async"
        />
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
