import { createRef } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PhotoLightbox,
  type LightboxPhoto,
  type PhotoLightboxHandle,
} from "@/components/car/PhotoLightbox";

function createPhotos(count: number): LightboxPhoto[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `photo-${index + 1}`,
    src: `/images/gallery/${(index % 2) + 1}.webp`,
    alt: `Фото ${index + 1}`,
  }));
}

async function openLightbox(photos: LightboxPhoto[], index = 0) {
  const ref = createRef<PhotoLightboxHandle>();
  const view = render(
    <PhotoLightbox ref={ref} photos={photos} alt="Автомобиль" />,
  );

  act(() => ref.current?.open(index));
  await screen.findByRole("button", { name: "Закрыть фотографию" });

  return view;
}

describe("PhotoLightbox", () => {
  it("не показывает thumbnails и стрелки для единственной фотографии", async () => {
    const { baseElement } = await openLightbox(createPhotos(1));

    expect(
      screen.queryByRole("button", { name: "Предыдущее фото" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Следующее фото" }),
    ).not.toBeInTheDocument();
    expect(baseElement.querySelector(".p-galleria-thumbnail-wrapper")).toBeNull();
  });

  it.each([2, 4, 8, 15, 30])(
    "стабильно собирает навигацию для %i фотографий",
    async (count) => {
      const { baseElement } = await openLightbox(createPhotos(count));

      expect(
        baseElement.querySelectorAll(".car-photo-viewer__thumbnail"),
      ).toHaveLength(count);
      expect(
        screen.getByRole("button", { name: "Предыдущее фото" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Следующее фото" }),
      ).toBeInTheDocument();
    },
  );

  it("открывается с переданного индекса", async () => {
    const photos = createPhotos(8);
    const { baseElement } = await openLightbox(photos, 4);

    const thumbnails = Array.from(
      baseElement.querySelectorAll(".car-photo-viewer__thumbnail"),
    );
    expect(
      thumbnails.findIndex(
        (thumbnail) => thumbnail.getAttribute("data-p-active") === "true",
      ),
    ).toBe(4);
    expect(screen.getByRole("img", { name: "Фото 5" })).toBeInTheDocument();
  });

  it("сохраняет activeIndex при смене responsive-окна", async () => {
    const originalWidth = window.innerWidth;
    const photos = createPhotos(15);
    const { baseElement } = await openLightbox(photos, 7);

    try {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 480,
      });
      act(() => window.dispatchEvent(new Event("resize")));

      await waitFor(() => {
        const thumbnails = Array.from(
          baseElement.querySelectorAll(".car-photo-viewer__thumbnail"),
        );
        expect(
          thumbnails.findIndex(
            (thumbnail) => thumbnail.getAttribute("data-p-active") === "true",
          ),
        ).toBe(7);
        expect(
          baseElement.querySelectorAll(
            '[data-p-galleria-thumbnail-item-active="true"]',
          ),
        ).toHaveLength(3);
      });
    } finally {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: originalWidth,
      });
      act(() => window.dispatchEvent(new Event("resize")));
    }
  });

  it("сохраняет циклическую навигацию в длинной responsive-галерее", async () => {
    const photos = createPhotos(30);
    const { baseElement } = await openLightbox(photos);

    expect(
      baseElement.querySelectorAll(".car-photo-viewer__thumbnail"),
    ).toHaveLength(30);

    fireEvent.click(screen.getByRole("button", { name: "Предыдущее фото" }));

    await waitFor(() => {
      const thumbnails = Array.from(
        baseElement.querySelectorAll(".car-photo-viewer__thumbnail"),
      );
      expect(
        thumbnails.findIndex(
          (thumbnail) => thumbnail.getAttribute("data-p-active") === "true",
        ),
      ).toBe(29);
    });
  });
});
