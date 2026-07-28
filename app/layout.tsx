import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingVehicleActions } from "@/components/ui/FloatingVehicleActions";
import { VehicleActionsProvider } from "@/components/ui/VehicleActionsContext";

export const metadata: Metadata = {
  title: "Imperium Motors — Автосалон",
  description:
    "Imperium Motors — автосалон премиальных автомобилей. Каталог, услуги, новости.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;900&family=Wix+Madefor+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <VehicleActionsProvider>
          <Header />
          {children}
          <FloatingVehicleActions />
          <Footer />
        </VehicleActionsProvider>
      </body>
    </html>
  );
}
