import type { Metadata } from "next";
import { ContactsPageContent } from "@/components/contacts/ContactsPageContent";
import "../home.css";
import "./contacts.css";

export const metadata: Metadata = {
  title: "Контакты — Imperium Motors",
  description:
    "Адрес, телефон и часы работы автосалона Imperium Motors в Москве.",
};

export default function ContactsPage() {
  return <ContactsPageContent />;
}
