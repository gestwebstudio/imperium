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

/**
 * Полноэкранный просмотр фото (PrimeReact Galleria в модалке HeroUI).
 * Переиспользуемый: открывается императивно через ref — ref.current.open(index).
 * Полоса миниатюр — квадратная, тянется мышью, скроллбар скрыт (см. photo-lightbox.css).
 */
export const PhotoLightbox = forwardRef<PhotoLightboxHandle, PhotoLightboxProps>(
  function PhotoLightbox({ photos, alt }, ref) {
    const [activeIndex, setActiveIndex] = useState(0);
    const state = useOverlayState();

    useImperativeHandle(
      ref,
      () => ({
        open: (index: number) => {
          setActiveIndex(index);
          state.open();
        },
      }),
      [state],
    );

    // Перетаскивание полосы миниатюр мышью (скроллбар скрыт в CSS).
    // Скролл конечный: у краёв просто останавливается — видно, что фото ограничены.
    useEffect(() => {
      if (!state.isOpen) return;
      const cleanups: Array<() => void> = [];
      const raf = requestAnimationFrame(() => {
        const viewports = document.querySelectorAll<HTMLElement>(
          ".car-photo-viewer__thumbnail-viewport",
        );
        viewports.forEach((el) => {
          let down = false;
          let moved = false;
          let startX = 0;
          let startScroll = 0;
          const onDown = (e: PointerEvent) => {
            down = true;
            moved = false;
            startX = e.clientX;
            startScroll = el.scrollLeft;
            el.classList.add("is-grabbing");
          };
          const onMove = (e: PointerEvent) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 4) moved = true;
            el.scrollLeft = startScroll - dx;
          };
          const onUp = () => {
            down = false;
            el.classList.remove("is-grabbing");
          };
          // Гасим клик по миниатюре, если это было перетаскивание
          const onClickCapture = (e: MouseEvent) => {
            if (moved) {
              e.preventDefault();
              e.stopPropagation();
              moved = false;
            }
          };
          el.addEventListener("pointerdown", onDown);
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
          el.addEventListener("click", onClickCapture, true);
          cleanups.push(() => {
            el.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            el.removeEventListener("click", onClickCapture, true);
          });
        });
      });
      return () => {
        cancelAnimationFrame(raf);
        cleanups.forEach((fn) => fn());
      };
    }, [state.isOpen]);

    const itemTemplate = (photo: LightboxPhoto) => (
      <figure className="car-photo-viewer__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.alt ?? alt} draggable={false} />
      </figure>
    );

    const thumbnailTemplate = (photo: LightboxPhoto) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="car-photo-viewer__thumbnail-image"
        src={photo.src}
        alt=""
        draggable={false}
      />
    );

    return (
      <Modal state={state}>
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
                numVisible={photos.length}
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
    );
  },
);

export default PhotoLightbox;
