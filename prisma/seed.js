// Наполнение БД стартовым контентом (совпадает с прежними моками).
// Идемпотентно: повторный запуск не плодит дубликаты.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const news = [
  {
    slug: "bugatti-tourbillon",
    title: "Bugatti Tourbillon прибыл в Imperium Motors",
    excerpt:
      "Новый этап гиперкаров: гибридная силовая установка, выразительная аэродинамика и интерьер, созданный как механическое произведение искусства.",
    body: [
      "Imperium Motors подберет и привезет конкретную модель, редкую комплектацию, нужный цвет или определенный набор опций.",
      "Полное сопровождение сделки: подбор подходящего варианта, согласование условий, организацию поставки, оформление документов и подготовку автомобиля к выдаче.",
      "К моменту передачи автомобиль будет полностью растаможен, иметь действующий ЭПТС и будет готов к постановке на учет.",
    ].join("\n\n"),
    image: "/images/news/bugatti-tourbillon.png",
    imageAlt: "Bugatti Tourbillon с открытыми дверями",
    date: new Date("2026-01-01"),
  },
];

const reviews = [
  {
    author: "Михаил",
    car: "BMW 7 Series",
    image: "/images/reviews/review1.webp",
    imageAlt: "Михаил рядом с BMW 7 Series",
    text: "«Искал автомобиль без компромиссов по комплектации и состоянию. Команда быстро поняла задачу, предложила несколько точных вариантов и полностью взяла на себя сопровождение сделки. В результате я получил именно тот автомобиль, который хотел.»",
  },
  {
    author: "Анна",
    car: "BMW 5 Series",
    image: "/images/reviews/review2.webp",
    imageAlt: "Анна рядом с BMW 5 Series",
    text: "«Хотела найти автомобиль, который сочетает комфорт на каждый день и характер. В Imperium Motors предложили подходящую комплектацию, организовали осмотр и подробно объяснили каждый этап. Сделка прошла спокойно, а результат превзошел ожидания.»",
  },
];

async function main() {
  for (const n of news) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {},
      create: n,
    });
  }

  // Отзывы без natural key — сеем только если таблица пуста.
  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: reviews });
  }

  console.log("Seed complete:", {
    news: await prisma.news.count(),
    reviews: await prisma.review.count(),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
