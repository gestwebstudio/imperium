"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { CarCard } from "@/components/cards/cards";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

const SLIDE_DURATION = 4000;

type SlideDirection = "next" | "previous";

const heroSlides = [
  {
    id: "porsche-911-turbo-s",
    title: "Porsche 911 turbo S",
    watermark: "Porshe 911",
    image: "/images/firstcars/1big.webp",
    cardImage: "/images/firstcars/1small.webp",
    price: "19 990 000 ₽",
    tags: ["2026", "Бензин", "Полный привод"],
    stats: [
      { value: "5,8 с", label: "Разгон 0–100 км/ч" },
      { value: "375 л.с.", label: "Мощность двигателя" },
      { value: "209 км/ч", label: "Максимальная скорость" },
      { value: "800 Н·м", label: "Крутящий момент" },
    ],
  },
  {
    id: "porsche-911-carrera-4-gts",
    title: "Porsche 911 Carrera 4 GTS",
    watermark: "Porshe 911",
    image: "/images/firstcars/2big.webp",
    cardImage: "/images/firstcars/2small.webp",
    price: "22 490 000 ₽",
    tags: ["2026", "Бензин", "Полный привод"],
    stats: [
      { value: "3,0 с", label: "Разгон 0–100 км/ч" },
      { value: "541 л.с.", label: "Мощность двигателя" },
      { value: "312 км/ч", label: "Максимальная скорость" },
      { value: "610 Н·м", label: "Крутящий момент" },
    ],
  },
] as const;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] =
    useState<SlideDirection>("next");
  const [timerVersion, setTimerVersion] = useState(0);

  const changeSlide = useCallback(
    (
      index: number,
      direction: SlideDirection,
      restartAutoplay = true,
    ) => {
      if (index === activeIndex) {
        if (restartAutoplay) {
          setTimerVersion((current) => current + 1);
        }
        return;
      }

      setSlideDirection(direction);
      setActiveIndex(index);

      if (restartAutoplay) {
        setTimerVersion((current) => current + 1);
      }
    },
    [activeIndex],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      changeSlide((activeIndex + 1) % heroSlides.length, "next", false);
    }, SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeIndex, changeSlide, timerVersion]);

  function selectSlide(index: number) {
    changeSlide(
      index,
      index >= activeIndex ? "next" : "previous",
    );
  }

  function showPreviousSlide() {
    changeSlide(
      (activeIndex - 1 + heroSlides.length) % heroSlides.length,
      "previous",
    );
  }

  function showNextSlide() {
    changeSlide((activeIndex + 1) % heroSlides.length, "next");
  }

  function getSlideClass(baseClass: string, index: number) {
    if (index === activeIndex) {
      return `${baseClass} hero-slide-layer hero-slide-layer--active hero-slide-layer--${slideDirection}`;
    }

    return `${baseClass} hero-slide-layer hero-slide-layer--hidden`;
  }

  return (
    <section className="hero">
      <div className="hero__inner">
        {heroSlides.map((slide, index) => (
          <Fragment key={slide.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={getSlideClass("hero__car", index)}
              src={slide.image}
              alt={index === activeIndex ? slide.title : ""}
              aria-hidden={index === activeIndex ? undefined : true}
            />
            <span
              className={getSlideClass("hero__watermark", index)}
              aria-hidden="true"
            >
              {slide.watermark}
            </span>
          </Fragment>
        ))}

        <div className="hero__top">
          <h1 className="hero__headline">
            <span className="hero__h1-reg">Премиальные</span>
            <span className="hero__h1-bold">
              автомобили
              <br />в москве
            </span>
          </h1>
          <div className="hero__unique">
            <p className="hero__unique-title">Уникальные модели</p>
            <p className="hero__unique-sub">
              редкие комплектации
              <br />в наличии и под заказ
            </p>
          </div>
        </div>

        <div className="hero__lower">
          <div className="hero__card-stage">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={getSlideClass("hero__card", index)}
                aria-hidden={index === activeIndex ? undefined : true}
                inert={index === activeIndex ? undefined : true}
              >
                <CarCard
                  vehicleId={slide.id}
                  href={`/catalog/${slide.id}`}
                  brandLogo="/images/logo_cards/porsche.webp"
                  brandName="Porsche"
                  title={slide.title}
                  status={{ type: "success", label: "В наличии" }}
                  tags={[...slide.tags]}
                  photo={slide.cardImage}
                  price={slide.price}
                  action={{ label: "Подробнее", variant: "primary-surface" }}
                />
              </div>
            ))}
          </div>

          <div className="hero__stats-stage">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={getSlideClass("hero__stats", index)}
                aria-hidden={index === activeIndex ? undefined : true}
              >
                {slide.stats.map((stat, statIndex) => (
                  <Fragment key={stat.label}>
                    {statIndex > 0 && <span className="stat__div" />}
                    <div className="stat">
                      <span className="stat__value">{stat.value}</span>
                      <span className="stat__label">{stat.label}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="hero__slider">
          <Button
            bare
            className="hero-arrow"
            aria-label="Предыдущий автомобиль"
            onClick={showPreviousSlide}
          >
            <ArrowIcon />
          </Button>
          <div className="hero__track">
            {heroSlides.map((slide, index) => (
              <Button
                bare
                key={`${slide.id}-${timerVersion}`}
                className={`hero__seg${
                  index === activeIndex ? " hero__seg--active" : ""
                }`}
                aria-label={`Показать ${slide.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => selectSlide(index)}
              >
                <span className="hero__seg-fill" />
              </Button>
            ))}
          </div>
          <Button
            bare
            className="hero-arrow hero-arrow--next"
            aria-label="Следующий автомобиль"
            onClick={showNextSlide}
          >
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
