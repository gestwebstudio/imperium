"use client";

import { Breadcrumbs } from "@heroui/react";
import { ArrowIcon } from "@/components/icons";
import { Contacts } from "@/components/home/Contacts";

export function ContactsPageContent() {
  return (
    <main className="contacts-page">
      <div className="contacts-page__crumbs-wrap">
        <Breadcrumbs
          className="contacts-page__crumbs"
          separator={<ArrowIcon width={12} height={12} />}
        >
          <Breadcrumbs.Item
            href="/"
            className="contacts-page__crumbs-item"
          >
            Главная
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="contacts-page__crumbs-item contacts-page__crumbs-item--current">
            Контакты
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

      <Contacts headingLevel="h1" />
    </main>
  );
}
