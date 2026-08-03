"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import {
  GalleryModal,
  type GalleryModalHandle,
  type GalleryPhoto,
} from "./GalleryModal";

/** Бесконечная карусель: центр — крупно и без прозрачности, боковые — меньше и 50%.
   При переходе соседний кадр «приезжает» в центр (растёт + проявляется). */

const SLOTS = [-2, -1, 0, 1, 2] as const; // окно отрисовки

const mod = (n: number, m: number) => ((n % m) + m) % m;

export type GalleryProps = {
  photos: GalleryPhoto[];
  alt: string;
};

export function Gallery({ photos, alt }: GalleryProps) {
  const carouselPhotos = photos.filter(
    (photo) => photo.category === "exterior",
  );
  const slides = carouselPhotos.length > 0 ? carouselPhotos : photos;
  const [center, setCenter] = useState(0); // индекс центрального кадра (растёт бесконечно)
  const [anim, setAnim] = useState(0); // -1 вперёд, +1 назад, 0 покой
  const [noTrans, setNoTrans] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const busy = useRef(false);
  const modalRef = useRef<GalleryModalHandle>(null);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const slot = track?.querySelector<HTMLElement>(".car-gallery__slot");
    if (!track || !slot) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    stepRef.current = slot.offsetWidth + gap;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = (dir: -1 | 1) => {
    if (busy.current || slides.length === 0) return;
    busy.current = true;
    measure();
    setAnim(dir === 1 ? -1 : 1); // «вперёд» = сдвиг трека влево
  };

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== "transform" || anim === 0) return;
    // фиксируем новый центр без анимации, возвращаем трек в исходную позицию
    setNoTrans(true);
    setCenter((c) => c - anim);
    setAnim(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setNoTrans(false);
        busy.current = false;
      });
    });
  };

  const trackX = anim * stepRef.current;

  return (
    <div className="car-gallery">
      <div className="car-gallery__viewport">
        <div
          ref={trackRef}
          className={`car-gallery__track${noTrans ? " no-trans" : ""}`}
          style={{ transform: `translateX(${trackX}px)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {SLOTS.map((offset) => {
            const eff = offset + anim; // смещение относительно визуального центра
            const isCenter = eff === 0;
            const photo = slides[mod(center + offset, slides.length)];
            return (
              <div
                key={offset}
                className={`car-gallery__slot${isCenter ? " is-center" : ""}`}
                onClick={isCenter ? () => modalRef.current?.open() : undefined}
                role={isCenter ? "button" : undefined}
                tabIndex={isCenter ? 0 : undefined}
                aria-label={isCenter ? "Открыть все фото" : undefined}
                onKeyDown={
                  isCenter
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          modalRef.current?.open();
                        }
                      }
                    : undefined
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt ?? alt}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <GalleryModal ref={modalRef} photos={photos} alt={alt} />

        <Button
          bare
          className="car-gallery__arrow car-gallery__arrow--prev"
          aria-label="Предыдущее фото"
          onClick={() => go(-1)}
        >
          <ArrowIcon />
        </Button>
        <Button
          bare
          className="car-gallery__arrow car-gallery__arrow--next"
          aria-label="Следующее фото"
          onClick={() => go(1)}
        >
          <ArrowIcon />
        </Button>
      </div>
    </div>
  );
}

export default Gallery;
