"use client";

import { useRef } from "react";
import {
  PhotoLightbox,
  type LightboxPhoto,
  type PhotoLightboxHandle,
} from "@/components/car/PhotoLightbox";

type AboutGalleryProps = {
  /** Все фото салона — в блоке видно только первые visibleCount, остальные — в открытой галерее. */
  photos: LightboxPhoto[];
  /** Сколько плиток показывать в блоке (по умолчанию 3). */
  visibleCount?: number;
  ariaLabel?: string;
};

/**
 * Первый блок «О салоне»: несколько фото-плиток; клик по любой открывает
 * полноэкранную галерею со ВСЕМИ фото (в т.ч. теми, что в блоке не показаны).
 */
export function AboutGallery({
  photos,
  visibleCount = 3,
  ariaLabel,
}: AboutGalleryProps) {
  const lightboxRef = useRef<PhotoLightboxHandle>(null);
  const visible = photos.slice(0, visibleCount);

  return (
    <>
      <div className="about-salon__gallery" aria-label={ariaLabel}>
        {visible.map((photo, index) => (
          <button
            type="button"
            key={photo.id ?? index}
            className={`about-salon__gallery-item${
              index === 0 ? " about-salon__gallery-main" : ""
            }`}
            aria-label={`Открыть галерею${photo.alt ? `: ${photo.alt}` : ""}`}
            onClick={() => lightboxRef.current?.open(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt ?? ""} />
          </button>
        ))}
      </div>

      <PhotoLightbox
        ref={lightboxRef}
        photos={photos}
        alt="Салон Imperium Motors"
      />
    </>
  );
}

export default AboutGallery;
