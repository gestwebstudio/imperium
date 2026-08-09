"use client";

import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { Review } from "@/lib/reviews";
import {
  INFINITE_CAROUSEL_COPIES,
  INFINITE_CAROUSEL_MIDDLE_COPY,
  useInfiniteCarousel,
} from "@/components/ui/useInfiniteCarousel";

export function Testimonials({ reviews }: { reviews: Review[] }) {
  const { rowRef, scroll } = useInfiniteCarousel(reviews.length);

  if (reviews.length === 0) return null;

  return (
    <div className="about__testimonial">
      <div className="about__testimonial-track" ref={rowRef}>
        {INFINITE_CAROUSEL_COPIES.map((copy) =>
          reviews.map((review, index) => {
            const isMiddleCopy = copy === INFINITE_CAROUSEL_MIDDLE_COPY;

            return (
              <article
                className="about__testimonial-slide"
                key={`${copy}-${review.id}`}
                data-carousel-cycle-start={index === 0 ? "" : undefined}
                aria-hidden={isMiddleCopy ? undefined : true}
                inert={isMiddleCopy ? undefined : true}
              >
                <div className="about__testi-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={review.image} alt={review.imageAlt} />
                </div>
                <div className="about__testi-body">
                  <h3 className="about__testi-title">
                    <span className="reg">Выбор, </span>
                    <span className="bold">которым делятся</span>
                  </h3>
                  <div className="about__testi-quote">
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
                      onClick={() => scroll(-1)}
                    >
                      <ArrowIcon />
                    </Button>
                    <Button
                      bare
                      className="next"
                      aria-label="Следующий отзыв"
                      onClick={() => scroll(1)}
                    >
                      <ArrowIcon />
                    </Button>
                  </div>
                </div>
              </article>
            );
          }),
        )}
      </div>
    </div>
  );
}
