"use client";

import { useState } from "react";
import { Modal, useOverlayState } from "@heroui/react";
import { Galleria } from "primereact/galleria";
import { ArrowIcon } from "@/components/icons";
import type { GalleryPhoto } from "./GalleryModal";

type PrimeGalleryProps = {
  photos: GalleryPhoto[];
  alt: string;
};

const RESPONSIVE_OPTIONS = [
  { breakpoint: "960px", numVisible: 5 },
  { breakpoint: "640px", numVisible: 3 },
];

export function PrimeGallery({ photos, alt }: PrimeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const lightboxState = useOverlayState();

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    lightboxState.open();
  };

  const itemTemplate = (photo: GalleryPhoto) => (
    <figure className="car-photo-viewer__media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} alt={photo.alt ?? alt} draggable={false} />
    </figure>
  );

  const thumbnailTemplate = (photo: GalleryPhoto) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="car-photo-viewer__thumbnail-image"
      src={photo.src}
      alt=""
      draggable={false}
    />
  );

  return (
    <>
      <div className="car-gallery-modal__grid">
        {photos.map((photo, index) => (
          <button
            type="button"
            className="car-gallery-modal__photo"
            key={photo.id}
            aria-label={`Открыть фото ${index + 1}`}
            onClick={() => openLightbox(index)}
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

      <Modal state={lightboxState}>
        <Modal.Backdrop className="car-photo-viewer__mask">
          <Modal.Container
            placement="center"
            className="car-photo-viewer__container"
          >
            <Modal.Dialog className="car-photo-viewer__dialog">
              <Modal.CloseTrigger
                className="car-photo-viewer__close"
                aria-label="Закрыть фотографию"
              />
              <Galleria
                value={photos}
                activeIndex={activeIndex}
                onItemChange={({ index }) => setActiveIndex(index)}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
                numVisible={Math.min(6, photos.length)}
                responsiveOptions={RESPONSIVE_OPTIONS}
                showItemNavigators={photos.length > 1}
                showThumbnailNavigators={false}
                showThumbnails={photos.length > 1}
                circular={photos.length > 1}
                itemPrevIcon={<ArrowIcon />}
                itemNextIcon={<ArrowIcon />}
                className="car-photo-viewer car-photo-viewer--lightbox"
                pt={{
                  content: { className: "car-photo-viewer__content" },
                  itemWrapper: {
                    className: "car-photo-viewer__item-wrapper",
                  },
                  itemContainer: {
                    className: "car-photo-viewer__item-container",
                  },
                  item: { className: "car-photo-viewer__item" },
                  previousItemButton: {
                    className:
                      "car-photo-viewer__arrow car-photo-viewer__arrow--prev",
                    "aria-label": "Предыдущее фото",
                  },
                  nextItemButton: {
                    className:
                      "car-photo-viewer__arrow car-photo-viewer__arrow--next",
                    "aria-label": "Следующее фото",
                  },
                  thumbnailWrapper: {
                    className: "car-photo-viewer__thumbnail-wrapper",
                  },
                  thumbnailContainer: {
                    className: "car-photo-viewer__thumbnail-container",
                  },
                  thumbnailItemsContainer: {
                    className: "car-photo-viewer__thumbnail-viewport",
                  },
                  thumbnailItems: {
                    className: "car-photo-viewer__thumbnail-track",
                  },
                  thumbnailItem: {
                    className: "car-photo-viewer__thumbnail",
                  },
                  thumbnailItemContent: {
                    className: "car-photo-viewer__thumbnail-content",
                  },
                }}
              />
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

export default PrimeGallery;
