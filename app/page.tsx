import "./home.css";
import { getCars } from "@/lib/cars";
import { Hero } from "@/components/home/Hero";
import { BrandsRow } from "@/components/home/BrandsRow";
import { CarsSection } from "@/components/home/CarsSection";
import { BodyTypes } from "@/components/home/BodyTypes";
import { About } from "@/components/home/About";
import { Contacts } from "@/components/home/Contacts";

export default function HomePage() {
  const cars = getCars();
  return (
    <main className="home">
      <Hero />
      <BrandsRow />
      <CarsSection
        title="Автомобили в наличии"
        badge={cars.length}
        viewAll="Все автомобили"
        cars={cars.slice(0, 8)}
      />
      <BodyTypes />
      <CarsSection
        title="Ближайшие поступления"
        cars={cars.slice(8, 16)}
        variant="upcoming"
      />
      <About />
      <Contacts />
    </main>
  );
}
