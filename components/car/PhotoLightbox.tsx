"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Modal, useOverlayState } from "@heroui/react";
import { Galleria } from "primereact/galleria";
import { ArrowIcon } from "@/components/icons";
import "./photo-lightbox.css";

export type LightboxPhoto = { id?: string; src: string; alt?: string };
export type PhotoLightboxHandle = { open: (index: number) => void };

type PhotoLightboxProps = {
  photos: LightboxPhoto[];
  alt: string;
};

const LIGHTBOX_NUM_VISIBLE = 9;
const LIGHTBOX_RESPONSIVE_OPTIONS = [
  { breakpoint: "1200px", numVisible: 7 },
  { breakpoint: "960px", numVisible: 5 },
  { breakpoint: "640px", numVisible: 4 },
  { breakpoint: "480px", numVisible: 3 },
];

const mod = (value: number, length: number) =>
  ((value % length) + length) % length;

/**
 * Полноэкранный просмотр фото (PrimeReact Galleria в модалке HeroUI).
 * Переиспользуемый: открывается императивно через ref — ref.current.open(index).
 * Responsive-окном миниатюр и touch-свайпом управляет PrimeReact Galleria.
 */
export const PhotoLightbox = forwardRef<PhotoLightboxHandle, PhotoLightboxProps>(
  function PhotoLightbox({ photos, alt }, ref) {
    const [activeIndex, setActiveIndex] = useState(0);
    const state = useOverlayState();

    useImperativeHandle(
      ref,
      () => ({
        open: (index: number) => {
          setActiveIndex(
            photos.length > 0
              ? Math.min(Math.max(index, 0), photos.length - 1)
              : 0,
          );
          state.open();
        },
      }),
      [photos.length, state],
    );

    // Активное и соседние изображения прогреваются заранее: при циклическом
    // переключении Galleria не показывает пустой кадр, даже если дальние
    // миниатюры браузер ещё не успел lazy-load'ить.
    useEffect(() => {
      if (!state.isOpen || photos.length === 0) return;

      const indexes = new Set([
        activeIndex,
        mod(activeIndex - 1, photos.length),
        mod(activeIndex + 1, photos.length),
      ]);

      indexes.forEach((index) => {
        const image = new Image();
        image.src = photos[index].src;
      });
    }, [activeIndex, photos, state.isOpen]);

    const itemTemplate = (photo: LightboxPhoto) => (
      <figure className="car-photo-viewer__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.alt ?? alt}
          draggable={false}
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />
      </figure>
    );

    const thumbnailTemplate = (photo: LightboxPhoto) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="car-photo-viewer__thumbnail-image"
        src={photo.src}
        alt=""
        draggable={false}
        decoding="async"
        loading="lazy"
      />
    );

    return (
      <Modal.Backdrop
        isOpen={state.isOpen}
        onOpenChange={state.setOpen}
        className="car-photo-viewer__mask"
      >
          <Modal.Container
            placement="center"
            className="car-photo-viewer__container"
          >
            <Modal.Dialog
              className="car-photo-viewer__dialog"
              aria-label="Просмотр фотографий автомобиля"
            >
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
                numVisible={LIGHTBOX_NUM_VISIBLE}
                responsiveOptions={LIGHTBOX_RESPONSIVE_OPTIONS}
                showItemNavigators={photos.length > 1}
                showThumbnailNavigators={photos.length > 1}
                showThumbnails={photos.length > 1}
                circular={photos.length > 1}
                itemPrevIcon={<ArrowIcon />}
                itemNextIcon={<ArrowIcon />}
                prevThumbnailIcon={<ArrowIcon />}
                nextThumbnailIcon={<ArrowIcon />}
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
                  previousThumbnailButton: {
                    className:
                      "car-photo-viewer__thumbnail-nav car-photo-viewer__thumbnail-nav--prev",
                    "aria-label": "Предыдущие миниатюры",
                  },
                  nextThumbnailButton: {
                    className:
                      "car-photo-viewer__thumbnail-nav car-photo-viewer__thumbnail-nav--next",
                    "aria-label": "Следующие миниатюры",
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
    );
  },
);

export default PhotoLightbox;
