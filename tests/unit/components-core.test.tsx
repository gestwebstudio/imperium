import { useState } from "react";
import { renderToString } from "react-dom/server";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Comparison } from "@/components/ui/Comparison";
import {
  VehicleActionsProvider,
  useVehicleActions,
  useVehicleActionsOptional,
} from "@/components/ui/VehicleActionsContext";
import { Wishlist } from "@/components/ui/Wishlist";
import {
  Badge,
  Bubble,
  Indicator,
  PriceBlock,
  Slider,
  Tag,
  Tooltip,
} from "@/components/ui/primitives";
import { Specs } from "@/components/car/Specs";
import { TypographyGuard } from "@/components/ui/TypographyGuard";
import { FloatingVehicleActions } from "@/components/ui/FloatingVehicleActions";
import { CarCard } from "@/components/cards/cards";
import { CarsSection } from "@/components/home/CarsSection";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { ComparisonClient } from "@/components/comparison/ComparisonClient";
import { FavoritesClient } from "@/components/favorites/FavoritesClient";
import { LoadingIframe } from "@/components/ui/LoadingIframe";
import { CarCardSkeleton } from "@/components/ui/Skeletons";
import { getCars } from "@/lib/cars";

describe("китовые кнопки", () => {
  it("применяет варианты, размеры, слоты и пользовательские обработчики", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onPointerDown = vi.fn();
    render(
      <Button
        variant="primary-cta"
        inverse
        iconOnly
        startIcon={<span>start</span>}
        endIcon={<span>end</span>}
        endSlot={<span>slot</span>}
        ctaIcon={<span>cta</span>}
        onClick={onClick}
        onPointerDown={onPointerDown}
      >
        Открыть
      </Button>,
    );

    const button = screen.getByRole("button", { name: /открыть/i });
    expect(button).toHaveClass(
      "btn--l",
      "btn--primary-cta",
      "btn--inverse",
      "btn--icon",
    );
    expect(button.querySelector(".btn__cta-icon")).toHaveTextContent("cta");

    await user.click(button);
    expect(onPointerDown).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledOnce();
    expect(button.querySelector(".ripple")).toBeInTheDocument();
  });

  it("добавляет ripple по координатам, заменяет предыдущий и удаляет после анимации", () => {
    render(<Button>Ripple</Button>);
    const button = screen.getByRole("button", { name: "Ripple" });
    Object.defineProperty(button, "clientWidth", { value: 100 });
    Object.defineProperty(button, "clientHeight", { value: 40 });
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 110,
      bottom: 60,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(button, { clientX: 30, clientY: 40 });
    let ripple = button.querySelector<HTMLElement>(".ripple");
    expect(ripple).toHaveStyle({ width: "100px", left: "-30px", top: "-30px" });

    fireEvent.click(button, { detail: 0, clientX: 0, clientY: 0 });
    expect(button.querySelectorAll(".ripple")).toHaveLength(1);
    ripple = button.querySelector<HTMLElement>(".ripple");
    expect(ripple).toHaveStyle({ left: "0px", top: "-30px" });

    fireEvent.animationEnd(ripple!);
    expect(button.querySelector(".ripple")).not.toBeInTheDocument();
  });

  it("системно отключает ripple у текстовых controls, не блокируя обработчики", () => {
    const onPointerDown = vi.fn();
    const onClick = vi.fn();
    render(
      <>
        <Button
          bare
          ripple={false}
          onPointerDown={onPointerDown}
          onClick={onClick}
        >
          Текстовый trigger
        </Button>
        <ButtonLink href="/catalog" bare ripple={false}>
          Текстовая ссылка
        </ButtonLink>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Текстовый trigger" });
    const link = screen.getByRole("link", { name: "Текстовая ссылка" });

    expect(trigger).toHaveClass("ui-button--bare", "ui-button--no-ripple");
    expect(link).toHaveClass("ui-button--bare", "ui-button--no-ripple");
    expect(trigger.querySelector(".ui-button__ripple-layer")).not.toBeInTheDocument();
    expect(link.querySelector(".ui-button__ripple-layer")).not.toBeInTheDocument();

    fireEvent.pointerDown(trigger, { clientX: 10, clientY: 10 });
    fireEvent.click(trigger, { detail: 0 });

    expect(onPointerDown).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
    expect(trigger.querySelector(".ripple")).not.toBeInTheDocument();
  });

  it("не создаёт ripple при prefers-reduced-motion", () => {
    vi.mocked(window.matchMedia).mockImplementationOnce((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<Button>Без анимации</Button>);
    const button = screen.getByRole("button", { name: "Без анимации" });

    fireEvent.pointerDown(button, { clientX: 10, clientY: 10 });

    expect(button.querySelector(".ripple")).not.toBeInTheDocument();
  });

  it("поддерживает bare и ссылочные варианты", () => {
    const { rerender } = render(
      <Button bare className="custom">
        Bare
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Bare" })).toHaveClass(
      "ui-button--bare",
      "custom",
    );
    expect(screen.getByRole("button", { name: "Bare" })).not.toHaveClass("btn");

    rerender(<ButtonLink href="/catalog">Каталог</ButtonLink>);
    expect(screen.getByRole("link", { name: "Каталог" })).toHaveAttribute(
      "href",
      "/catalog",
    );

    rerender(<ButtonLink href="tel:+74997041444">Позвонить</ButtonLink>);
    expect(screen.getByRole("link", { name: "Позвонить" })).toHaveAttribute(
      "href",
      "tel:+74997041444",
    );
  });
});

describe("презентационные примитивы", () => {
  it("рендерит токенизированные варианты", () => {
    render(
      <>
        <Bubble size="xl" color="taupe-400">4</Bubble>
        <Badge size="xs" color="warning" variant="outlined" responsive>
          Скоро
        </Badge>
        <Tag size="m" variant="filter">BMW</Tag>
        <Tag>2026</Tag>
        <Indicator status="error">Нет в наличии</Indicator>
        <Tooltip size="l">Подсказка</Tooltip>
        <PriceBlock size="m" label="Цена" value="7 060 000 ₽" />
      </>,
    );

    expect(screen.getByText("4")).toHaveClass("bubble--xl", "bubble--taupe-400");
    expect(screen.getByText("Скоро")).toHaveClass(
      "badge--xs",
      "badge--warning",
      "badge--outlined",
      "badge--responsive",
    );
    expect(screen.getByText("BMW").querySelector(".tag__close")).toBeInTheDocument();
    expect(screen.getByText("2026")).toHaveClass("tag--card", "tag--l");
    expect(screen.getByText("Нет в наличии")).toHaveClass("indicator--error");
    expect(screen.getByText("Подсказка")).toHaveClass("tooltip--l");
    expect(screen.getByText("Цена").nextElementSibling).toHaveTextContent(
      "7 060 000 ₽",
    );
  });

  it("ограничивает прогресс диапазоном 0–100", () => {
    const { rerender, container } = render(<Slider value={-10} />);
    expect(container.querySelector(".ui-progress__fill")).toHaveStyle({ width: "0%" });
    rerender(<Slider value={55} />);
    expect(container.querySelector(".ui-progress__fill")).toHaveStyle({ width: "55%" });
    rerender(<Slider value={150} />);
    expect(container.querySelector(".ui-progress__fill")).toHaveStyle({ width: "100%" });
  });
});

function ActionsProbe() {
  const actions = useVehicleActions();
  return (
    <div>
      <output data-testid="favorites">{actions.favoriteIds.join(",")}</output>
      <output data-testid="comparisons">{actions.comparisonIds.join(",")}</output>
      <output data-testid="counts">
        {actions.favoriteCount}:{actions.comparisonCount}:{String(actions.storageReady)}
      </output>
      <button onClick={() => actions.setFavorite("car-1", true)}>favorite</button>
      <button onClick={() => actions.setFavorite("car-1", false)}>unfavorite</button>
      <button onClick={() => actions.setCompared("car-2", true)}>compare</button>
      <button onClick={() => actions.setCompared("car-2", false)}>uncompare</button>
      <span>{String(actions.isFavorite("car-1"))}</span>
      <span>{String(actions.isCompared("car-2"))}</span>
    </div>
  );
}

describe("избранное и сравнение", () => {
  it("восстанавливает, удаляет дубли и устаревшие ID, затем сохраняет состояние", async () => {
    localStorage.setItem(
      "imperium-vehicle-actions",
      JSON.stringify({
        favorites: ["car-1", "car-1", "removed-car", 42],
        comparisons: ["car-2", "car-2", "removed-car", null],
      }),
    );
    const user = userEvent.setup();
    render(
      <VehicleActionsProvider validVehicleIds={["car-1", "car-2"]}>
        <ActionsProbe />
      </VehicleActionsProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("counts")).toHaveTextContent("1:1:true"));
    expect(screen.getByTestId("favorites")).toHaveTextContent("car-1");
    expect(screen.getByTestId("comparisons")).toHaveTextContent("car-2");

    await user.click(screen.getByRole("button", { name: "favorite" }));
    expect(screen.getByTestId("favorites")).toHaveTextContent("car-1");
    await user.click(screen.getByRole("button", { name: "unfavorite" }));
    await user.click(screen.getByRole("button", { name: "uncompare" }));

    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem("imperium-vehicle-actions")!)).toEqual({
        favorites: [],
        comparisons: [],
      }),
    );
  });

  it("не показывает ложные состояния и счётчики до восстановления storage", () => {
    const markup = renderToString(
      <VehicleActionsProvider validVehicleIds={["car-1"]}>
        <Wishlist vehicleId="car-1" tip="В избранное" />
        <Comparison vehicleId="car-1" tip="В сравнение" />
        <FloatingVehicleActions />
      </VehicleActionsProvider>,
    );

    expect(markup.match(/is-storage-pending/g)).toHaveLength(3);
    expect(markup.match(/aria-busy="true"/g)).toHaveLength(3);
  });

  it("показывает структурный skeleton Favorites до восстановления storage", () => {
    const markup = renderToString(
      <VehicleActionsProvider validVehicleIds={["car-1"]}>
        <FavoritesClient />
      </VehicleActionsProvider>,
    );

    expect(markup).toContain("favorites-loading-grid");
    expect(markup.match(/class="car-card car-card-skeleton /g)).toHaveLength(4);
    expect(markup).toContain("skeleton--shimmer");
    expect(markup).not.toContain("favorites-empty");
  });

  it("безопасно обрабатывает повреждённое хранилище", async () => {
    localStorage.setItem("imperium-vehicle-actions", "{broken");
    render(
      <VehicleActionsProvider>
        <ActionsProbe />
      </VehicleActionsProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("counts")).toHaveTextContent("0:0:true"));
  });

  it("требует Provider для обязательного hook и допускает optional hook", () => {
    function Required() {
      useVehicleActions();
      return null;
    }
    function Optional() {
      return <span>{String(useVehicleActionsOptional())}</span>;
    }

    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Required />)).toThrow(
      "useVehicleActions must be used inside VehicleActionsProvider",
    );
    error.mockRestore();
    render(<Optional />);
    expect(screen.getByText("null")).toBeInTheDocument();
  });

  it("переключает локальные Wishlist и Comparison и вызывает callbacks", async () => {
    const user = userEvent.setup();
    const wishlistChange = vi.fn();
    const comparisonChange = vi.fn();
    render(
      <>
        <Wishlist tip="Добавить" onChange={wishlistChange} />
        <Comparison tip="Сравнить" onChange={comparisonChange} />
      </>,
    );

    const wishlist = screen.getByRole("button", { name: "Добавить" });
    const comparison = screen.getByRole("button", { name: "Сравнить" });
    await user.click(wishlist);
    await user.click(comparison);

    expect(wishlist).toHaveAttribute("aria-pressed", "true");
    expect(wishlist).toHaveAccessibleName("Убрать из избранного");
    expect(comparison).toHaveAttribute("aria-pressed", "true");
    expect(comparison).toHaveAccessibleName("Убрать из сравнения");
    expect(wishlistChange).toHaveBeenCalledWith(true);
    expect(comparisonChange).toHaveBeenCalledWith(true);
  });

  it("синхронизирует глобальные toggles и уважает управляемый режим", async () => {
    const user = userEvent.setup();
    const controlledChange = vi.fn();

    render(
      <VehicleActionsProvider>
        <Wishlist vehicleId="car-1" tip="В избранное" />
        <Comparison vehicleId="car-2" tip="В сравнение" />
        <Wishlist active={false} onChange={controlledChange} tip="Управляемое" />
        <ActionsProbe />
      </VehicleActionsProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("counts")).toHaveTextContent("0:0:true"));

    await user.click(screen.getByRole("button", { name: "В избранное" }));
    await user.click(screen.getByRole("button", { name: "В сравнение" }));
    expect(screen.getByTestId("counts")).toHaveTextContent("1:1:true");

    const controlled = screen.getByRole("button", { name: "Управляемое" });
    await user.click(controlled);
    expect(controlled).toHaveAttribute("aria-pressed", "false");
    expect(controlledChange).toHaveBeenCalledWith(true);
  });
});

describe("карточка автомобиля", () => {
  it("оставляет overlay для мыши вне Tab-порядка и один keyboard-переход", () => {
    const { container } = render(
      <CarCard
        variant="comparison"
        vehicleId="car-1"
        brandLogo="/brand.svg"
        brandName="Imperium"
        title="Тестовый автомобиль"
        status={{ type: "success", label: "В наличии" }}
        tags={["2026", "500 л.с."]}
        photo="/car.webp"
        price="7 060 000 ₽"
        action={{ label: "Подробнее", variant: "primary-surface" }}
        href="/catalog/test-car"
      />,
    );

    const overlay = container.querySelector(".car-card__link");
    expect(container.querySelector(".car-card")).toHaveClass(
      "car-card--comparison",
    );
    expect(overlay).toHaveAttribute("tabindex", "-1");
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Подробнее: Тестовый автомобиль" }),
    ).toHaveAttribute(
      "href",
      "/catalog/test-car",
    );
  });
});

describe("характеристики автомобиля", () => {
  it("раскрывает и сворачивает дополнительные характеристики", async () => {
    const user = userEvent.setup();
    render(
      <Specs
        primary={[
          { key: "year", label: "Год", rawValue: 2026, displayValue: "2026" },
          { key: "body", label: "Кузов", rawValue: "Купе", displayValue: "Купе" },
          { key: "drive", label: "Привод", rawValue: "Полный", displayValue: "Полный" },
        ]}
        extra={[
          { key: "length", label: "Длина", rawValue: 4850, displayValue: "4 850 мм" },
          { key: "width", label: "Ширина", rawValue: 1900, displayValue: "1 900 мм" },
        ]}
      />,
    );

    expect(screen.queryByText("Длина")).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "Развернуть" });
    await user.click(toggle);
    expect(screen.getByText("Длина")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Свернуть" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Свернуть" }));
    expect(screen.queryByText("Длина")).not.toBeInTheDocument();
  });

  it("не создаёт пустые колонки при коротком наборе", () => {
    const { container } = render(
      <Specs
        primary={[
          { key: "year", label: "Год", rawValue: 2026, displayValue: "2026" },
        ]}
        extra={[]}
      />,
    );
    expect(container.querySelectorAll(".car-specs__column")).toHaveLength(1);
  });
});

describe("loading сравнения", () => {
  it("показывает структурный skeleton до восстановления localStorage", () => {
    const markup = renderToString(
      <VehicleActionsProvider validVehicleIds={getCars().map((car) => car.id)}>
        <ComparisonClient cars={getCars()} />
      </VehicleActionsProvider>,
    );

    expect(markup).toContain("comparison-loading--skeleton");
    expect(markup.match(/class="car-card car-card-skeleton /g)).toHaveLength(4);
    expect(markup).toContain("skeleton--shimmer");
    expect(markup).not.toContain("comparison-empty");
  });
});

describe("единая система loading states", () => {
  it("собирает CarCardSkeleton только из HeroUI Skeleton placeholders", () => {
    const markup = renderToString(<CarCardSkeleton />);

    expect(markup).toContain("car-card-skeleton");
    expect(markup.match(/skeleton--shimmer/g)?.length).toBeGreaterThan(5);
    expect(markup).not.toContain("favorites-skeleton-card");
    expect(markup).not.toContain("comparison-loading__line");
  });

  it("готовит CarsSection к API loading без запуска infinite carousel", () => {
    const markup = renderToString(
      <CarsSection title="Автомобили" cars={[]} loading />,
    );

    expect(markup).toContain("cars-row--loading");
    expect(markup.match(/class="car-card car-card-skeleton /g)).toHaveLength(4);
    expect(markup).not.toContain("Предыдущие автомобили");
    expect(markup).not.toContain("Следующие автомобили");
  });

  it("готовит Catalog к API loading и skeleton счётчика", () => {
    const markup = renderToString(<CatalogClient cars={[]} loading />);

    expect(markup).toContain("catalog-grid--loading");
    expect(markup).toContain("catalog-head__count-skeleton");
    expect(markup.match(/class="car-card car-card-skeleton /g)).toHaveLength(6);
    expect(markup).not.toContain("catalog-empty");
  });

  it("держит HeroUI skeleton iframe до реального onLoad", () => {
    const { container } = render(
      <LoadingIframe
        containerClassName="test-map"
        src="about:blank"
        title="Тестовая карта"
      />,
    );
    const frame = screen.getByTitle("Тестовая карта");

    expect(container.querySelector(".loading-iframe__skeleton")).toHaveClass(
      "skeleton",
      "skeleton--shimmer",
    );
    expect(frame).toHaveAttribute("tabindex", "-1");
    expect(frame).toHaveAttribute("aria-hidden", "true");

    fireEvent.load(frame);

    expect(container.querySelector(".loading-iframe__skeleton")).not.toBeInTheDocument();
    expect(frame).not.toHaveAttribute("aria-hidden");
  });
});

describe("глобальная типографика", () => {
  it("обрабатывает обычный и разделённый inline-разметкой текст", async () => {
    render(
      <div>
        <p data-testid="plain">Автомобили в наличии и под заказ</p>
        <p data-testid="inline">Доставка в <strong>Москве</strong></p>
        <code data-testid="code">Код в блоке</code>
        <TypographyGuard />
      </div>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("plain").textContent).toBe(
        "Автомобили в\u00a0наличии и\u00a0под заказ",
      ),
    );
    expect(screen.getByTestId("inline").childNodes[0].nodeValue).toBe(
      "Доставка в\u00a0",
    );
    expect(screen.getByTestId("code")).toHaveTextContent("Код в блоке");
  });

  it("обрабатывает динамически добавленный текст и отключается после unmount", async () => {
    const { unmount } = render(<TypographyGuard />);
    const paragraph = document.createElement("p");
    paragraph.textContent = "Сервис на дорогах";

    act(() => document.body.appendChild(paragraph));
    await waitFor(() => expect(paragraph.textContent).toBe("Сервис на\u00a0дорогах"));
    unmount();

    const afterUnmount = document.createElement("p");
    afterUnmount.textContent = "Помощь на дороге";
    act(() => document.body.appendChild(afterUnmount));
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(afterUnmount.textContent).toBe("Помощь на дороге");
  });
});
