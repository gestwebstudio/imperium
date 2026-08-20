"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingVehicleActions } from "@/components/ui/FloatingVehicleActions";
import { CookieBanner } from "@/components/ui/CookieBanner";

/** Публичная «обвязка» сайта (шапка/футер). На /admin не рендерится. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  const isCarPage = /^\/catalog\/[^/]+$/.test(pathname ?? "");
  const flowHeaderWithPage =
    pathname === "/comparison" || pathname === "/catalog" || isCarPage;

  return (
    <>
      <Header flowWithPage={flowHeaderWithPage} />
      {children}
      <FloatingVehicleActions />
      <Footer />
      <CookieBanner />
    </>
  );
}

export default SiteChrome;
