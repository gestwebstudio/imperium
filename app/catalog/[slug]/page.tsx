import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "./car.css";
import { getCarBySlug, getCars } from "@/lib/cars";
import { CarView } from "@/components/car/CarView";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getCars().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Автомобиль не найден — Imperium Motors" };
  const title = `${car.brand} ${car.name}`;
  return {
    title: `${title} — Imperium Motors`,
    description: `${title}: характеристики, цена ${formatPriceMeta(car.price)}, наличие.`,
  };
}

function formatPriceMeta(value: number): string {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

export default async function CarPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();
  return <CarView car={car} />;
}
