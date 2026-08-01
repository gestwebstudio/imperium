"use client";

import { Contacts } from "@/components/home/Contacts";
import { Crumbs } from "@/components/ui/Crumbs";

export function ContactsPageContent() {
  return (
    <main className="contacts-page">
      <div className="contacts-page__crumbs-wrap">
        <Crumbs
          className="contacts-page__crumbs"
          items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]}
        />
      </div>

      <Contacts headingLevel="h1" />
    </main>
  );
}
