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
  Checkbox,
  Wishlist,
  Comparison,
  BrandCard,
  BodyCard,
  NewsCard,
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

const bubbleColors = [
  ["White", "white"],
  ["Green 200", "green-200"],
  ["Green 500", "green-500"],
  ["Warm Taupe 400", "taupe-400"],
] as const;

type TypographySpec = {
  name: string;
  className: string;
  meta: string;
  sample: string;
};

const headingWeights = [
  ["regular", "Regular", 400],
  ["medium", "Medium", 500],
  ["semibold", "Semibold", 600],
  ["bold", "Bold", 700],
  ["extrabold", "ExtraBold", 800],
] as const;

const headingLevels = [
  ["h1", 88, 100],
  ["h2", 66, 70],
  ["h3", 50, 70],
  ["h4", 48, 56],
  ["h5", 40, 48],
  ["h6", 36, 44],
] as const;

const headingStyles: TypographySpec[] = headingLevels.flatMap(
  ([level, fontSize, lineHeight]) =>
  headingWeights.map(([weight, label, value]) => ({
    name: `Heading/${level.toUpperCase()} ${label}`,
    className: `t-heading-${level}-${level}-${weight}`,
    meta: `Wix Madefor Display · ${fontSize}/${lineHeight} · ${value}`,
    sample: "Imperium Motors",
  })),
);

const textScales = [
  [36, 42, ["regular", "medium", "semibold", "bold"]],
  [32, 44, ["regular", "medium", "semibold", "bold", "black"]],
  [30, 40, ["regular", "medium", "semibold", "bold"]],
  [24, 30, ["regular", "medium", "semibold", "bold"]],
  [20, 28, ["regular", "medium", "semibold", "bold"]],
  [18, 24, ["regular", "medium", "semibold", "bold"]],
  [16, 20, ["regular", "medium", "semibold", "bold"]],
  [14, 18, ["regular", "medium", "semibold", "bold"]],
  [10, 10, ["regular", "medium", "semibold", "bold"]],
] as const;

const textWeightValues = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

const textStyles: TypographySpec[] = textScales.flatMap(
  ([fontSize, lineHeight, weights]) =>
  weights.map((weight) => {
    const weightValue = textWeightValues[weight];
    return {
      name: `Text/${fontSize} ${weight[0].toUpperCase()}${weight.slice(1)}`,
      className: `t-text-${fontSize}-${fontSize}-${weight}`,
      meta: `Onest · ${fontSize}/${lineHeight} · ${weightValue}`,
      sample: "Премиальные автомобили в Москве",
    };
  }),
);

const specialTypographyStyles: TypographySpec[] = [
  ...(["regular", "medium", "semibold", "bold"] as const).map(
    (weight, index) => ({
      name: `Title card/24 ${weight[0].toUpperCase()}${weight.slice(1)}`,
      className: `t-title-card-24-${weight}`,
      meta: `Wix Madefor Display · 24/30 · ${[400, 500, 600, 700][index]}`,
      sample: "Porsche 911 Turbo S",
    }),
  ),
  {
    name: "Numeric/Value",
    className: "t-numeric-value",
    meta: "Wix Madefor Display · 40/46 · 800",
    sample: "375 л.с.",
  },
  {
    name: "Price/Value",
    className: "t-price-value",
    meta: "Wix Madefor Display · 28/36 · 800",
    sample: "19 990 000 ₽",
  },
];

const typographyGroups = [
  ["Heading", headingStyles],
  ["Text", textStyles],
  ["Card & values", specialTypographyStyles],
] as const;

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
                <Button
                  size="l"
                  variant="primary-cta"
                  ctaIcon={<ArrowDiagonalIcon />}
                >
                  Каталог
                </Button>
                <Button
                  size="m"
                  variant="primary-cta"
                  ctaIcon={<ArrowDiagonalIcon />}
                >
                  Каталог
                </Button>
                <Button
                  size="s"
                  variant="primary-cta"
                  ctaIcon={<ArrowDiagonalIcon />}
                >
                  Каталог
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

      {/* ---------------- Типографика ---------------- */}
      <section className="kit-section">
        <div className="kit-wrap">
          <h2>Типографика</h2>
          <p className="section-lead">
            Все 73 локальных текстовых стиля из Figma. Имена CSS-классов можно
            использовать напрямую; размеры адаптируются через шкалу в{" "}
            <code>styles/typography.css</code>.
          </p>
          {typographyGroups.map(([groupName, styles]) => (
            <div className="kit-block" key={groupName}>
              <div className="kit-head">
                <h3>{groupName}</h3>
                <code>{styles.length} styles</code>
              </div>
              <div className="type-list">
                {styles.map((style) => (
                  <article className="type-row" key={style.className}>
                    <div className="type-meta">
                      <strong>{style.name}</strong>
                      <code>.{style.className}</code>
                      <span>{style.meta}</span>
                    </div>
                    <div className={`type-sample ${style.className}`}>
                      {style.sample}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
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
            <div className="kit-stage kit-stage--col bubble-demo">
              <div className="bubble-row bubble-head">
                <span className="bubble-rowlabel" />
                <span className="bubble-col">
                  S<small>16 px · Onest 10</small>
                </span>
                <span className="bubble-col">
                  M<small>20 px · Onest 14</small>
                </span>
                <span className="bubble-col">
                  L<small>24 px · Onest 14</small>
                </span>
                <span className="bubble-col">
                  XL<small>28 px · Onest 16</small>
                </span>
              </div>
              {bubbleColors.map(([label, color]) => (
                <div className="bubble-row" key={color}>
                  <span className="bubble-rowlabel">
                    {label}
                    <code>.bubble--{color}</code>
                  </span>
                  <span className="bubble-cell">
                    <Bubble size="s" color={color}>
                      1
                    </Bubble>
                  </span>
                  <span className="bubble-cell">
                    <Bubble size="m" color={color}>
                      1
                    </Bubble>
                  </span>
                  <span className="bubble-cell">
                    <Bubble size="l" color={color}>
                      1
                    </Bubble>
                  </span>
                  <span className="bubble-cell">
                    <Bubble size="xl" color={color}>
                      10
                    </Bubble>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Badge</h3>
              <code>&lt;Badge&gt;</code>
            </div>
            <div className="kit-stage kit-stage--col">
              <div className="stage-label">Surface · L</div>
              <div className="stage-row">
                <Badge color="info">Badge</Badge>
                <Badge color="success">В наличии</Badge>
                <Badge color="warning">Ожидается</Badge>
                <Badge color="error">Продан</Badge>
              </div>
              <div className="stage-label">Surface · M</div>
              <div className="stage-row">
                <Badge size="m" color="info">Badge</Badge>
                <Badge size="m" color="success">В наличии</Badge>
                <Badge size="m" color="warning">Ожидается</Badge>
                <Badge size="m" color="error">Продан</Badge>
              </div>
              <div className="stage-label">Outlined · L / M</div>
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
                <Badge size="m" color="info" variant="outlined">
                  Badge M
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
              <div className="stage-label">Card · L</div>
              <div className="stage-row">
                <Tag>2026</Tag>
                <Tag>Внедорожник</Tag>
                <Tag>4.4 AT</Tag>
              </div>
              <div className="stage-label">Card · M</div>
              <div className="stage-row">
                <Tag size="m">2026</Tag>
                <Tag size="m">Внедорожник</Tag>
                <Tag size="m">4.4 AT</Tag>
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
            <div className="kit-stage kit-stage--col">
              <div className="stage-label">L</div>
              <div className="stage-row" style={{ gap: 32 }}>
                <Indicator status="success">В наличии</Indicator>
                <Indicator status="warning">В пути</Indicator>
                <Indicator status="error">Продан</Indicator>
                <Indicator status="info">Под заказ</Indicator>
              </div>
              <div className="stage-label">M</div>
              <div className="stage-row" style={{ gap: 32 }}>
                <Indicator size="m" status="success">В наличии</Indicator>
                <Indicator size="m" status="warning">В пути</Indicator>
                <Indicator size="m" status="error">Продан</Indicator>
                <Indicator size="m" status="info">Под заказ</Indicator>
              </div>
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
              <h3>Checkbox</h3>
              <code>&lt;Checkbox size=&quot;s | m&quot;&gt;</code>
            </div>
            <div className="kit-stage kit-stage--col">
              <div className="stage-label">Размеры S / M</div>
              <div className="stage-row">
                <div style={{ width: 220 }}>
                  <Checkbox size="s" label="Размер S" defaultSelected />
                </div>
                <div style={{ width: 220 }}>
                  <Checkbox size="m" label="Размер M" defaultSelected />
                </div>
              </div>
            </div>
          </div>

          <div className="kit-block">
            <div className="kit-head">
              <h3>Wishlist / Comparison</h3>
              <code>&lt;Wishlist&gt; &lt;Comparison&gt;</code>
            </div>
            <div className="kit-stage" style={{ gap: 44 }}>
              <Wishlist tip="Добавить в избранное" />
              <Wishlist defaultActive tip="Добавить в избранное" />
              <Comparison tip="Добавить в сравнение" />
              <Comparison defaultActive tip="Добавить в сравнение" />
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
            <div className="kit-stage kit-stage--col">
              <div className="stage-label">L / M</div>
              <div className="stage-row" style={{ gap: 48 }}>
                <PriceBlock size="l" value="20 390 000 ₽" />
                <PriceBlock size="m" value="20 390 000 ₽" />
              </div>
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
            Наведите курсор на плитки марок и типов кузова. News Card и Car Card
            собраны из компонентов и токенов кита.
          </p>

          <div className="kit-block">
            <div className="kit-head">
              <h3>News Card</h3>
              <code>&lt;NewsCard&gt;</code>
            </div>
            <div className="news-card-stage">
              <NewsCard
                date="01.01.2026"
                dateTime="2026-01-01"
                title={"Bugatti Tourbillon прибыл\nв Imperium Motors"}
                description="Новый этап гиперкаров: гибридная силовая установка, выразительная аэродинамика и интерьер, созданный как механическое произведение искусства."
                image="/images/news/bugatti-tourbillon.png"
                imageAlt="Bugatti Tourbillon с открытыми дверями"
                href="#"
              />
            </div>
          </div>

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
              <div className="car-card-specimen car-card-specimen--l">
                <div className="stage-label">L · In stock</div>
                <CarCard
                  size="l"
                  brandLogo="/images/logo_cards/bmw.webp"
                  brandName="BMW"
                  title="X3 xDrive20i"
                  status={{ type: "success", label: "В наличии" }}
                  tags={["2026", "Бензин", "Полный привод"]}
                  photo="/images/cars/x3-xdrive20i.webp"
                  price="28 990 000 ₽"
                  action={{ label: "Подробнее", variant: "primary-surface" }}
                />
              </div>
              <div className="car-card-specimen car-card-specimen--m">
                <div className="stage-label">M · Waiting</div>
                <CarCard
                  size="m"
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
