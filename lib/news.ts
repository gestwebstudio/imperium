export type NewsItem = {
  id: string;
  date: string;
  dateTime: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type NewsArticle = {
  slug: string;
  date: string;
  dateTime: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  imageAlt: string;
};

const bugattiArticle: NewsArticle = {
  slug: "bugatti-tourbillon",
  date: "01.01.2026",
  dateTime: "2026-01-01",
  title: "Bugatti Tourbillon прибыл в Imperium Motors",
  excerpt:
    "Новый этап гиперкаров: гибридная силовая установка, выразительная аэродинамика и интерьер, созданный как механическое произведение искусства.",
  body: [
    "Imperium Motors подберет и привезет конкретную модель, редкую комплектацию, нужный цвет или определенный набор опций.",
    "Полное сопровождение сделки: подбор подходящего варианта, согласование условий, организацию поставки, оформление документов и подготовку автомобиля к выдаче.",
    "К моменту передачи автомобиль будет полностью растаможен, иметь действующий ЭПТС и будет готов к постановке на учет.",
  ],
  image: "/images/news/bugatti-tourbillon.png",
  imageAlt: "Bugatti Tourbillon с открытыми дверями",
};

export const newsArticles: NewsArticle[] = [bugattiArticle];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getNewsSlugs(): string[] {
  return newsArticles.map((article) => article.slug);
}

// Temporary content source: the API or CMS can replace this array without
// changing the page or the UI Kit card.
export const newsItems: NewsItem[] = Array.from({ length: 16 }, (_, index) => ({
  id: `bugatti-tourbillon-${index + 1}`,
  date: bugattiArticle.date,
  dateTime: bugattiArticle.dateTime,
  title: "Bugatti Tourbillon прибыл\nв Imperium Motors",
  description: bugattiArticle.excerpt,
  image: bugattiArticle.image,
  imageAlt: bugattiArticle.imageAlt,
  href: `/news/${bugattiArticle.slug}`,
}));
