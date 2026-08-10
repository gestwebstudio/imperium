import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import "./not-found.css";

export const metadata: Metadata = {
  title: "Страница не найдена — Imperium Motors",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <main className="not-found-page" aria-labelledby="not-found-title">
      <Image
        className="not-found-page__background"
        src="/images/404/showroom.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />

      <div className="not-found-page__content">
        <p className="not-found-page__message">
          Такой страницы не существует
        </p>

        <h1 className="not-found-page__code" id="not-found-title">
          404
        </h1>

        <ButtonLink
          className="not-found-page__button"
          href="/catalog"
          size="l"
          variant="primary-surface"
          inverse
        >
          В каталог
        </ButtonLink>
      </div>
    </main>
  );
}
