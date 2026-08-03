"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingVehicleActions } from "@/components/ui/FloatingVehicleActions";

/** Публичная «обвязка» сайта (шапка/футер). На /admin не рендерится. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <FloatingVehicleActions />
      <Footer />
    </>
  );
}

export default SiteChrome;
