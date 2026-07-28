"use client";

import { startTransition, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const reviews = [
  {
    id: "mikhail",
    author: "Михаил",
    car: "BMW 7 Series",
    image: "/images/reviews/review1.webp",
    imageAlt: "Михаил рядом с BMW 7 Series",
    text: "«Искал автомобиль без компромиссов по комплектации и состоянию. Команда быстро поняла задачу, предложила несколько точных вариантов и полностью взяла на себя сопровождение сделки. В результате я получил именно тот автомобиль, который хотел.»",
  },
  {
    id: "anna",
    author: "Анна",
    car: "BMW 5 Series",
    image: "/images/reviews/review2.webp",
    imageAlt: "Анна рядом с BMW 5 Series",
    text: "«Хотела найти автомобиль, который сочетает комфорт на каждый день и характер. В Imperium Motors предложили подходящую комплектацию, организовали осмотр и подробно объяснили каждый этап. Сделка прошла спокойно, а результат превзошел ожидания.»",
  },
] as const;

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const review = reviews[activeIndex];

  function showReview(nextDirection: -1 | 1) {
    setDirection(nextDirection);
    startTransition(() => {
      setActiveIndex(
        (current) => (current + nextDirection + reviews.length) % reviews.length,
      );
    });
  }

  return (
    <div
      className={cn(
        "about__testimonial",
        direction === 1
          ? "about__testimonial--next"
          : "about__testimonial--previous",
      )}
    >
      <div className="about__testi-img" key={`image-${review.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={review.image} alt={review.imageAlt} />
      </div>
      <div className="about__testi-body">
        <h3 className="about__testi-title">
          <span className="reg">Выбор, </span>
          <span className="bold">которым делятся</span>
        </h3>
        <div
          className="about__testi-quote"
          key={`quote-${review.id}`}
          aria-live="polite"
        >
          <div className="about__testi-author">
            <b>{review.author}</b>
            <span>{review.car}</span>
          </div>
          <p className="about__testi-text">{review.text}</p>
        </div>
        <div className="about__testi-nav">
          <Button
            bare
            aria-label="Предыдущий отзыв"
            onClick={() => showReview(-1)}
          >
            <ArrowIcon />
          </Button>
          <Button
            bare
            className="next"
            aria-label="Следующий отзыв"
            onClick={() => showReview(1)}
          >
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
