import { Fragment } from "react";
import { CarCard } from "@/components/cards/cards";
import { ArrowIcon } from "@/components/icons";

const stats = [
  { value: "5,8 с", label: "Разгон 0–100 км/ч" },
  { value: "375 л.с.", label: "Мощность двигателя" },
  { value: "209 км/ч", label: "Максимальная скорость" },
  { value: "800 Н·м", label: "Крутящий момент" },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__top">
          <h1 className="hero__headline">
            <span className="hero__h1-reg">Премиальные</span>
            <span className="hero__h1-bold">автомобили в москве</span>
          </h1>
          <div className="hero__unique">
            <p className="hero__unique-title">Уникальные модели</p>
            <p className="hero__unique-sub">
              редкие комплектации
              <br />в наличии и под заказ
            </p>
          </div>
        </div>

        <div className="hero__stage">
          <span className="hero__watermark">Porsche 911 turbo S</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__car"
            src="/images/firstcars/1big.webp"
            alt="Porsche 911 turbo S"
          />
          <div className="hero__card">
            <CarCard
              brandLogo="/images/logo_cards/porsche.webp"
              brandName="Porsche"
              title="Porsche 911 turbo S"
              status={{ type: "success", label: "В наличии" }}
              tags={["2026", "Бензин", "Полный привод"]}
              photo="/images/firstcars/1small.webp"
              price="19 990 000 ₽"
              action={{ label: "Подробнее", variant: "primary-surface" }}
            />
          </div>
        </div>

        <div className="hero__stats">
          {stats.map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 && <span className="stat__div" />}
              <div className="stat">
                <span className="stat__value">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="hero__slider">
          <button className="hero-arrow" aria-label="Назад">
            <ArrowIcon />
          </button>
          <div className="hero__track">
            <span className="hero__seg hero__seg--active">
              <span />
            </span>
            <span className="hero__seg" />
            <span className="hero__seg" />
            <span className="hero__seg" />
          </div>
          <button className="hero-arrow hero-arrow--next" aria-label="Вперёд">
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
