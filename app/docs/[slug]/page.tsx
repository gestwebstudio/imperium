import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/ui/Crumbs";
import { LEGAL_DOCS, getLegalDoc } from "@/lib/legal-docs";
import "../docs.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Документ не найден — Imperium Motors" };
  return { title: `${doc.title} — Imperium Motors` };
}

/** Заголовок раздела: строка вида «1. Название» (верхний уровень, без 1.1.). */
function isHeading(line: string): boolean {
  return /^\d+\.\s\D/.test(line) && line.length < 70;
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <main className="docs-page">
      <Crumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Правовые документы", href: "/docs" },
          { label: doc.crumbLabel },
        ]}
      />
      <header className="docs-head">
        <h1 className="t-page-title">{doc.title}</h1>
      </header>
      <article className="legal-doc">
        {doc.body.map((line, i) =>
          isHeading(line) ? (
            <h2 className="legal-doc__h" key={i}>
              {line}
            </h2>
          ) : (
            <p className="legal-doc__p" key={i}>
              {line}
            </p>
          ),
        )}
      </article>
    </main>
  );
}
