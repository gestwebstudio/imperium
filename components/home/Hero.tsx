"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { CarCard } from "@/components/cards/cards";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

const SLIDE_DURATION = 4000;
const SWIPE_AXIS_LOCK_DISTANCE = 8;
const SWIPE_DISTANCE = 42;
const SWIPE_FLING_DISTANCE = 30;
const SWIPE_FLING_VELOCITY = 0.35;
const SWIPE_CLICK_GUARD_DURATION = 450;

type SlideDirection = "next" | "previous";
type SwipeAxis = "pending" | "horizontal" | "vertical";

type SwipeGesture = {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  startedAt: number;
  axis: SwipeAxis;
};

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
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const autoplayTimerRef = useRef<number | null>(null);
  const swipeGestureRef = useRef<SwipeGesture | null>(null);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<number | null>(null);

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

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current === null) return;

    window.clearTimeout(autoplayTimerRef.current);
    autoplayTimerRef.current = null;
  }, []);

  useEffect(() => {
    clearAutoplayTimer();

    if (autoplayPaused) return;

    autoplayTimerRef.current = window.setTimeout(() => {
      autoplayTimerRef.current = null;
      changeSlide((activeIndex + 1) % heroSlides.length, "next", false);
    }, SLIDE_DURATION);

    return clearAutoplayTimer;
  }, [
    activeIndex,
    autoplayPaused,
    changeSlide,
    clearAutoplayTimer,
    timerVersion,
  ]);

  useEffect(() => {
    return () => {
      if (suppressClickTimerRef.current !== null) {
        window.clearTimeout(suppressClickTimerRef.current);
      }
    };
  }, []);

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

  function pauseAutoplayForGesture() {
    clearAutoplayTimer();
    setAutoplayPaused(true);
  }

  function restartAutoplayAfterGesture() {
    setAutoplayPaused(false);
    setTimerVersion((current) => current + 1);
  }

  function guardClickAfterSwipe() {
    suppressClickRef.current = true;

    if (suppressClickTimerRef.current !== null) {
      window.clearTimeout(suppressClickTimerRef.current);
    }

    suppressClickTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
      suppressClickTimerRef.current = null;
    }, SWIPE_CLICK_GUARD_DURATION);
  }

  function handleCardTouchStart(event: ReactTouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    swipeGestureRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      lastX: touch.clientX,
      lastY: touch.clientY,
      startedAt: performance.now(),
      axis: "pending",
    };
    pauseAutoplayForGesture();
  }

  function handleCardTouchMove(event: ReactTouchEvent<HTMLDivElement>) {
    const gesture = swipeGestureRef.current;
    if (!gesture || event.touches.length !== 1) return;

    const touch = event.touches[0];
    gesture.lastX = touch.clientX;
    gesture.lastY = touch.clientY;

    if (gesture.axis !== "pending") return;

    const deltaX = Math.abs(gesture.lastX - gesture.startX);
    const deltaY = Math.abs(gesture.lastY - gesture.startY);
    if (Math.max(deltaX, deltaY) < SWIPE_AXIS_LOCK_DISTANCE) return;

    if (deltaX > deltaY * 1.1) gesture.axis = "horizontal";
    else if (deltaY > deltaX * 1.1) gesture.axis = "vertical";
  }

  function handleCardTouchEnd(event: ReactTouchEvent<HTMLDivElement>) {
    const gesture = swipeGestureRef.current;
    swipeGestureRef.current = null;

    if (!gesture) return;

    const touch = event.changedTouches[0];
    const endX = touch?.clientX ?? gesture.lastX;
    const endY = touch?.clientY ?? gesture.lastY;
    const deltaX = endX - gesture.startX;
    const deltaY = endY - gesture.startY;
    const horizontalDistance = Math.abs(deltaX);
    const duration = Math.max(1, performance.now() - gesture.startedAt);
    const velocity = horizontalDistance / duration;
    const isHorizontal =
      gesture.axis !== "vertical" && horizontalDistance > Math.abs(deltaY) * 1.1;
    const passedThreshold =
      horizontalDistance >= SWIPE_DISTANCE ||
      (horizontalDistance >= SWIPE_FLING_DISTANCE &&
        velocity >= SWIPE_FLING_VELOCITY);

    setAutoplayPaused(false);

    if (isHorizontal && passedThreshold) {
      guardClickAfterSwipe();
      if (deltaX < 0) showNextSlide();
      else showPreviousSlide();
      return;
    }

    restartAutoplayAfterGesture();
  }

  function handleCardTouchCancel() {
    if (!swipeGestureRef.current) return;

    swipeGestureRef.current = null;
    restartAutoplayAfterGesture();
  }

  function handleCardClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;

    suppressClickRef.current = false;
    if (suppressClickTimerRef.current !== null) {
      window.clearTimeout(suppressClickTimerRef.current);
      suppressClickTimerRef.current = null;
    }
    event.preventDefault();
    event.stopPropagation();
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
          <div
            className="hero__card-stage"
            onTouchStart={handleCardTouchStart}
            onTouchMove={handleCardTouchMove}
            onTouchEnd={handleCardTouchEnd}
            onTouchCancel={handleCardTouchCancel}
            onClickCapture={handleCardClickCapture}
          >
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
