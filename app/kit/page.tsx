import "./kit.css";
import type { Metadata } from "next";
import {
  ArrowIcon,
  ArrowDiagonalIcon,
  CloseIcon,
  CopyIcon,
  HeartStrokeIcon,
  HeartFillIcon,
  ListAddIcon,
  ListCheckIcon,
  PhoneIcon,
  Bubble,
  Badge,
  Tag,
  Indicator,
  Tooltip,
  Slider,
  PriceBlock,
  Button,
  Wishlist,
  Comparison,
  BrandCard,
  BodyCard,
  CarCard,
} from "@/components";

export const metadata: Metadata = {
  title: "UI Kit — Imperium Motors",
  description: "Витрина компонентов дизайн-кита Imperium Motors (React).",
};

const icons = [
  ["Arrow", ArrowIcon],
  ["Arrow-Diagonal", ArrowDiagonalIcon],
  ["Close", CloseIcon],
  ["Copy", CopyIcon],
  ["Heart-stroke", HeartStrokeIcon],
  ["Heart-fill", HeartFillIcon],
  ["List-Add", ListAddIcon],
  ["List-Check", ListCheckIcon],
  ["Phone", PhoneIcon],
] as const;

const colorGroups: { title: string; items: [string, string][] }[] = [
  {
    title: "Carbon Black",
    items: [
      ["Carbon Black 100", "#ECEBEA"],
      ["Carbon Black 200", "#C1BFBD"],
      ["Carbon Black 300", "#898785"],
      ["Carbon Black 400", "#4C4B49"],
      ["Carbon Black 500", "#1B1E1D"],
    ],
  },
  {
    title: "Heritage Green",
    items: [
      ["Heritage Green 100", "#E1EAE5"],
      ["Heritage Green 200", "#A8BCB1"],
      ["Heritage Green 300", "#6F917F"],
      ["Heritage Green 400", "#4E7B60"],
      ["Heritage Green 500", "#294434"],
      ["Heritage Green 600", "#213227"],
    ],
  },
  {
    title: "Warm Taupe",
    items: [
      ["Warm Taupe 100", "#F2EEEA"],
      ["Warm Taupe 200", "#D5CCC4"],
      ["Warm Taupe 300", "#B2A79B"],
      ["Warm Taupe 400", "#8F8579"],
      ["Warm Taupe 500", "#6A6259"],
    ],
  },
  {
    title: "Stone Beige",
    items: [
      ["Stone Beige 100", "#F3F0EE"],
      ["Stone Beige 200", "#E4DFDB"],
      ["Stone Beige 300", "#CAC2BB"],
      ["Stone Beige 400", "#A79E97"],
      ["Stone Beige 500", "#908A86"],
      ["White", "#FFFFFF"],
    ],
  },
  {
    title: "Additional",
    items: [
      ["Blue 100", "#DCDFEF"],
      ["Blue 500", "#5262C0"],
      ["Red 100", "#EFDCDD"],
      ["Red 500", "#BB4545"],
      ["Yellow 100", "#F7F3E2"],
      ["Yellow 500", "#DDB103"],
      ["Green 100", "#DCEFDC"],
      ["Green 500", "#55AB4D"],
    ],
  },
];

export default function KitPage() {
  return (
    <div className="kit-page">
      <header className="kit-hero">
        <div className="kit-wrap">
          <div className="eyebrow">Imperium Motors · UI Kit (React)</div>
          <h1>Дизайн-система</h1>
          <p>
            Компоненты кита в виде React-компонентов на классах из{" "}
            <code>styles/components.css</code>. Интерактивные (кнопки, избранное,
            сравнение) — клиентские.
          </p>
        </div>
      </header>

      {/* ---------------- Кнопки ---------------- */}
      <section className="kit-section">
        <div className="kit-wrap">
          <h2>Кнопки</h2>
          <p className="section-lead">
            Размеры S / M / L, стили Surface / Flat / Outlined / CTA, состояние
            inverse. Иконки — из модуля <code>components/icons</code>, ripple — при клике.
          </p>
          <div className="btn-card">
            <div className="btn-sub">Варианты × размеры (L / M / S)</div>
            {(
              [
                ["Primary · Surface", "primary-surface"],
                ["Primary · Flat", "primary-flat"],
                ["Primary · Outlined", "primary-outlined"],
                ["Secondary · Surface", "secondary-surface"],
                ["Secondary · Flat", "secondary-flat"],
                ["Secondary · Outlined", "secondary-outlined"],
              ] as const
            ).map(([label, variant]) => (
              <div className="btn-row" key={variant}>
                <div className="btn-rowhead">
                  {label}
                  <code>.btn--{variant}</code>
                </div>
                <div className="btn-group">
                  <Button size="l" variant={variant}>
                    Кнопка
                  </Button>
                  <Button size="m" variant={variant}>
                    Кнопка
                  </Button>
                  <Button size="s" variant={variant}>
                    Кнопка
                  </Button>
                </div>
              </div>
            ))}

            <div className="btn-sub">Контент</div>
            <div className="btn-row">
              <div className="btn-rowhead">Иконка · бабл</div>
              <div className="btn-group">
                <Button variant="primary-surface" startIcon={<PhoneIcon />}>
                  Позвонить
                </Button>
                <Button variant="primary-surface" endIcon={<ArrowDiagonalIcon />}>
                  Смотреть
                </Button>
                <Button
                  variant="primary-surface"
                  endSlot={
                    <Bubble size="s" color="white">
                      1
                    </Bubble>
                  }
                >
                  Избранное
                </Button>
                <Button
                  variant="primary-flat"
                  startIcon={<ListAddIcon />}
                  endSlot={
                    <Bubble size="s" color="green-500">
                      1
                    </Bubble>
                  }
                >
                  Сравнить
                </Button>
              </div>
            </div>
            <div className="btn-row">
              <div className="btn-rowhead">Только иконка</div>
              <div className="btn-group">
                <Button
                  size="l"
                  variant="secondary-outlined"
                  iconOnly
                  startIcon={<HeartStrokeIcon />}
                  aria-label="В избранное"
                />
                <Button
                  size="m"
                  variant="secondary-outlined"
                  iconOnly
                  startIcon={<CopyIcon />}
                  aria-label="Копировать"
                />
                <Button
                  size="s"
                  variant="secondary-outlined"
                  iconOnly
                  startIcon={<ArrowIcon />}
                  aria-label="Назад"
                />
              </div>
            </div>

            <div className="btn-sub">CTA</div>
            <div className="btn-row">
              <div className="btn-rowhead">
                Primary · CTA<code>.btn--primary-cta</code>
              </div>
              <div className="btn-group">
                <Button variant="primary-cta" ctaIcon={<ArrowDiagonalIcon />}>
                  Забронировать
                </Button>
              </div>
            </div>
          </div>

          <div className="btn-dark">
            <Button variant="primary-surface" inverse>
              Кнопка
            </Button>
            <Button variant="primary-flat" inverse>
              Кнопка
            </Button>
            <Button variant="primary-outlined" inverse>
              Кнопка
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- Компоненты ---------------- */}
      <section className="kit-section">
        <div className="kit-wrap">
          <h2>Компоненты</h2>
          <p className="section-lead">
            Живые примеры. Wishlist и Comparison — кликабельные (переключают состояние).
          </p>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Bubble</h3>
              <code>&lt;Bubble&gt;</code>
            </div>
            <div className="kit-stage">
              <Bubble size="s" color="green-500">
                1
              </Bubble>
              <Bubble size="m" color="green-500">
                12
              </Bubble>
              <Bubble size="l" color="taupe-400">
                99+
              </Bubble>
              <Bubble size="m" color="green-200">
                3
              </Bubble>
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Badge</h3>
              <code>&lt;Badge&gt;</code>
            </div>
            <div className="kit-stage kit-stage--col">
              <div className="stage-label">Surface</div>
              <div className="stage-row">
                <Badge color="info">Badge</Badge>
                <Badge color="success">В наличии</Badge>
                <Badge color="warning">Ожидается</Badge>
                <Badge color="error">Продан</Badge>
              </div>
              <div className="stage-label">Outlined</div>
              <div className="stage-row">
                <Badge color="info" variant="outlined">
                  Badge
                </Badge>
                <Badge color="success" variant="outlined">
                  В наличии
                </Badge>
                <Badge color="warning" variant="outlined">
                  Ожидается
                </Badge>
                <Badge color="error" variant="outlined">
                  Продан
                </Badge>
              </div>
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Tag</h3>
              <code>&lt;Tag&gt;</code>
            </div>
            <div className="kit-stage kit-stage--col">
              <div className="stage-label">Card</div>
              <div className="stage-row">
                <Tag>2026</Tag>
                <Tag>Внедорожник</Tag>
                <Tag>4.4 AT</Tag>
              </div>
              <div className="stage-label">Filter</div>
              <div className="stage-row">
                <Tag variant="filter">2026</Tag>
                <Tag variant="filter">Бензин</Tag>
                <Tag variant="filter">Автомат</Tag>
              </div>
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Indicator</h3>
              <code>&lt;Indicator&gt;</code>
            </div>
            <div className="kit-stage" style={{ gap: 32 }}>
              <Indicator status="success">В наличии</Indicator>
              <Indicator status="warning">В пути</Indicator>
              <Indicator status="error">Продан</Indicator>
              <Indicator status="info">Под заказ</Indicator>
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Tooltip</h3>
              <code>&lt;Tooltip&gt;</code>
            </div>
            <div className="kit-stage kit-stage--beige" style={{ gap: 32 }}>
              <Tooltip size="s">Это подсказка.</Tooltip>
              <Tooltip size="l">Это подсказка.</Tooltip>
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Wishlist / Comparison</h3>
              <code>&lt;Wishlist&gt; &lt;Comparison&gt;</code>
            </div>
            <div className="kit-stage" style={{ gap: 44 }}>
              <Wishlist tip="Добавить в избранное" />
              <Wishlist defaultActive tip="Убрать из избранного" />
              <Comparison tip="Добавить в сравнение" />
              <Comparison defaultActive tip="Убрать из сравнения" />
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Slider</h3>
              <code>&lt;Slider&gt;</code>
            </div>
            <div className="kit-stage kit-stage--col" style={{ gap: 20 }}>
              <div className="stage-label">0% · 76% · 100%</div>
              <Slider value={0} />
              <Slider value={76} />
              <Slider value={100} />
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Price Block</h3>
              <code>&lt;PriceBlock&gt;</code>
            </div>
            <div className="kit-stage">
              <PriceBlock value="20 390 000 ₽" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Иконки ---------------- */}
      <section className="kit-section">
        <div className="kit-wrap">
          <h2>Иконки</h2>
          <p className="section-lead">
            Модуль <code>components/icons</code>. Сетка 12×12, цвет через{" "}
            <code>currentColor</code>.
          </p>
          <div className="icon-grid">
            {icons.map(([name, Icon]) => (
              <div className="icon-tile" key={name}>
                <span className="ic">
                  <Icon />
                </span>
                <span className="icn-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Карточки ---------------- */}
      <section className="kit-section">
        <div className="kit-wrap">
          <h2>Карточки</h2>
          <p className="section-lead">
            Наведите курсор на плитки марок и типов кузова. Car Card собран из
            компонентов кита.
          </p>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Brand Logo Card</h3>
              <code>&lt;BrandCard&gt;</code>
            </div>
            <div className="brand-grid">
              <BrandCard src="/images/logo_brands/lexus.webp" alt="Lexus" />
              <BrandCard src="/images/logo_brands/ferrari.webp" alt="Ferrari" />
              <BrandCard src="/images/logo_brands/bmw.webp" alt="BMW" />
              <BrandCard src="/images/logo_brands/rollsroyce.webp" alt="Rolls-Royce" />
              <BrandCard src="/images/logo_brands/mercedes.webp" alt="Mercedes-Benz" />
              <BrandCard src="/images/logo_brands/audi.webp" alt="Audi" />
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Body Logo Card</h3>
              <code>&lt;BodyCard&gt;</code>
            </div>
            <div className="brand-grid">
              <BodyCard label="СЕДАНЫ" src="/images/body_card/sedan.webp" />
              <BodyCard label="ВНЕДОРОЖНИКИ" src="/images/body_card/off-road.webp" />
              <BodyCard label="КУПЕ" src="/images/body_card/coupe.webp" />
              <BodyCard label="МИНИВЭНЫ" src="/images/body_card/minivan.webp" />
              <BodyCard label="КРОССОВЕРЫ" src="/images/body_card/crossover.webp" />
              <BodyCard label="КАБРИОЛЕТ" src="/images/body_card/cabriolet.webp" />
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Car Card</h3>
              <code>&lt;CarCard&gt;</code>
            </div>
            <div className="car-stage">
              <CarCard
                brandLogo="/images/logo_cards/bmw.webp"
                brandName="BMW"
                title="X3 xDrive20i"
                status={{ type: "success", label: "В наличии" }}
                tags={["2026", "Бензин", "Полный привод"]}
                photo="/images/cars/x3-xdrive20i.webp"
                price="28 990 000 ₽"
                action={{ label: "Подробнее", variant: "primary-surface" }}
              />
              <CarCard
                brandLogo="/images/logo_cards/bmw.webp"
                brandName="BMW"
                title="X3 xDrive20i"
                status={{ type: "warning", label: "Ожидается" }}
                tags={["2026", "Бензин", "Полный привод"]}
                photo="/images/cars/mask.webp"
                photoAlt="Автомобиль под тканью"
                price="28 990 000 ₽"
                action={{ label: "Забронировать", variant: "secondary-outlined" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Цвета ---------------- */}
      <section className="kit-section">
        <div className="kit-wrap">
          <h2>Цвета</h2>
          <p className="section-lead">
            Палитра токенов (<code>styles/tokens.css</code>). Heritage Green — основной
            акцент бренда.
          </p>
          {colorGroups.map((group) => (
            <div className="kit-block" key={group.title}>
              <div className="kit-head">
                <h3>{group.title}</h3>
              </div>
              <div className="swatches">
                {group.items.map(([name, hex]) => (
                  <div className="swatch" key={name}>
                    <div className="chip" style={{ background: hex }} />
                    <div className="meta">
                      <div className="cname">{name}</div>
                      <div className="hex">{hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
