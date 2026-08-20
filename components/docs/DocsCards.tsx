import { ArrowDiagonalIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { LEGAL_DOCS } from "@/lib/legal-docs";

/**
 * Карточки-ссылки на правовые документы. Дубликат блока услуг с главной
 * (ServiceCards) под отдельные классы .docs-card* — будем править отдельно.
 * Отличия: 3 в ряд на десктопе, заголовок = название документа, без текста
 * под заголовком; кнопка-иконка не раскрывается (только зелёная подсветка).
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
          <span className="docs-card__action" aria-hidden="true">
            <span className="docs-card__action-icon">
              <ArrowDiagonalIcon />
            </span>
          </span>
        </ButtonLink>
      ))}
    </div>
  );
}

export default DocsCards;
