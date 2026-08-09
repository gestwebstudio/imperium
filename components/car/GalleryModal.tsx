"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Modal, Tabs, useOverlayState } from "@heroui/react";
import { Button } from "@/components/ui/Button";
import { PrimeGallery } from "./PrimeGallery";

export type GalleryCategory = "interior" | "exterior" | "multimedia";

export type GalleryPhoto = {
  id: string;
  src: string;
  category: GalleryCategory;
  alt?: string;
};

const GALLERY_TABS = [
  { id: "all", label: "Вся галерея" },
  { id: "interior", label: "Интерьер" },
  { id: "exterior", label: "Экстерьер" },
  { id: "multimedia", label: "Мультимедиа" },
] as const;

export type GalleryModalProps = {
  photos: GalleryPhoto[];
  alt: string;
};

export type GalleryModalHandle = { open: () => void };

export const GalleryModal = forwardRef<GalleryModalHandle, GalleryModalProps>(
  function GalleryModal({ photos, alt }, ref) {
  const state = useOverlayState();

  useImperativeHandle(ref, () => ({ open: () => state.open() }), [state]);

  return (
    <>
      <Button
        bare
        className="car-gallery__all"
        aria-label="Показать все фото"
        onClick={state.open}
      >
        Все фото
      </Button>

      <Modal state={state}>
        <Modal.Backdrop variant="blur" className="car-gallery-modal__backdrop">
          <Modal.Container
            placement="center"
            scroll="inside"
            className="car-gallery-modal__container"
          >
            <Modal.Dialog className="car-gallery-modal__dialog">
              <Modal.CloseTrigger
                className="car-gallery-modal__close"
                aria-label="Закрыть галерею"
              />

              <Modal.Header className="car-gallery-modal__header">
                <Modal.Heading className="car-gallery-modal__title">
                  Фотографии автомобиля
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="car-gallery-modal__body">
                <Tabs
                  defaultSelectedKey="all"
                  className="car-gallery-modal__tabs"
                >
                  <Tabs.ListContainer className="car-gallery-modal__tab-container">
                    <Tabs.List
                      aria-label="Категории фотографий"
                      className="car-gallery-modal__tab-list"
                    >
                      {GALLERY_TABS.map((tab) => (
                        <Tabs.Tab
                          key={tab.id}
                          id={tab.id}
                          className="car-gallery-modal__tab"
                        >
                          <span>{tab.label}</span>
                          <Tabs.Indicator className="car-gallery-modal__tab-indicator" />
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>
                  </Tabs.ListContainer>

                  {GALLERY_TABS.map((tab) => {
                    const filteredPhotos =
                      tab.id === "all"
                        ? photos
                        : photos.filter((photo) => photo.category === tab.id);

                    return (
                      <Tabs.Panel
                        key={tab.id}
                        id={tab.id}
                        className="car-gallery-modal__panel"
                      >
                        <PrimeGallery photos={filteredPhotos} alt={alt} />
                      </Tabs.Panel>
                    );
                  })}
                </Tabs>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
});

export default GalleryModal;
