import { ButtonLink } from "@/components/ui/Button";
import { LEGAL_DOCS } from "@/lib/legal-docs";

/**
 * Карточки-ссылки на правовые документы. Дубликат блока услуг с главной
 * (ServiceCards) под отдельные классы .docs-card* — будем править отдельно.
 * Отличия: 3 в ряд на десктопе, заголовок = название документа, без текста
 * под заголовком и без иконки-стрелки; на hover — только зелёная подсветка.
 */
export function DocsCards() {
  return (
    <div className="docs-cards">
      {LEGAL_DOCS.map((doc) => (
        <ButtonLink
          bare
          href={`/docs/${doc.slug}`}
          className="docs-card"
          aria-label={doc.title}
          key={doc.slug}
        >
          <h2 className="docs-card__title">{doc.title}</h2>
        </ButtonLink>
      ))}
    </div>
  );
}

export default DocsCards;
