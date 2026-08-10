import type { Metadata } from "next";
import { Onest, Wix_Madefor_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { TypographyGuard } from "@/components/ui/TypographyGuard";
import { VehicleActionsProvider } from "@/components/ui/VehicleActionsContext";
import { AppToastProvider } from "@/components/ui/AppToastProvider";
import { getAllCars } from "@/lib/cars";

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-onest-local",
  display: "swap",
});

const wixMadeforDisplay = Wix_Madefor_Display({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-wix-local",
  display: "swap",
});

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
  const validVehicleIds = getAllCars().map((car) => car.id);

  return (
    <html lang="ru" className={`${onest.variable} ${wixMadeforDisplay.variable}`}>
      <body>
        <VehicleActionsProvider validVehicleIds={validVehicleIds}>
          <SiteChrome>{children}</SiteChrome>
          <AppToastProvider />
          <TypographyGuard />
        </VehicleActionsProvider>
      </body>
    </html>
  );
}
