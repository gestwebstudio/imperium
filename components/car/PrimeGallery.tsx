"use client";

import { useRef } from "react";
import { PhotoLightbox, type PhotoLightboxHandle } from "./PhotoLightbox";
import type { GalleryPhoto } from "./GalleryModal";

type PrimeGalleryProps = {
  photos: GalleryPhoto[];
  alt: string;
};

export function PrimeGallery({ photos, alt }: PrimeGalleryProps) {
  const lightboxRef = useRef<PhotoLightboxHandle>(null);

  return (
    <>
      <div className="car-gallery-modal__grid">
        {photos.map((photo, index) => (
          <button
            type="button"
            className="car-gallery-modal__photo"
            key={photo.id}
            aria-label={`Открыть фото ${index + 1}`}
            onClick={() => lightboxRef.current?.open(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt ?? `${alt}, фото ${index + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <PhotoLightbox ref={lightboxRef} photos={photos} alt={alt} />
    </>
  );
}

export default PrimeGallery;
