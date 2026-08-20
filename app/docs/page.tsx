import type { Metadata } from "next";
import { Crumbs } from "@/components/ui/Crumbs";
import { DocsCards } from "@/components/docs/DocsCards";
import "./docs.css";

export const metadata: Metadata = {
  title: "Правовые документы — Imperium Motors",
  description:
    "Правовые документы Imperium Motors: политика обработки персональных данных и согласия.",
};

export default function DocsPage() {
  return (
    <main className="docs-page">
      <Crumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Правовые документы" },
        ]}
      />
      <header className="docs-head">
        <h1 className="t-page-title">Правовые документы</h1>
      </header>
      <DocsCards />
    </main>
  );
}
