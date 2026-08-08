"use client";

import { useEffect } from "react";
import {
  hasTrailingShortWord,
  preventHangingPrepositions,
  protectTrailingShortWord,
} from "@/lib/typography";

const SKIPPED_SELECTOR = [
  "code",
  "input",
  "kbd",
  "math",
  "noscript",
  "option",
  "pre",
  "samp",
  "script",
  "select",
  "style",
  "svg",
  "textarea",
  '[data-typography="off"]',
  '[contenteditable=""]',
  '[contenteditable="true"]',
].join(", ");

const TEXT_CONTAINER_TAGS = new Set([
  "A",
  "ARTICLE",
  "BLOCKQUOTE",
  "BUTTON",
  "DD",
  "DIV",
  "DT",
  "FIGCAPTION",
  "FOOTER",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HEADER",
  "LABEL",
  "LI",
  "MAIN",
  "NAV",
  "P",
  "SECTION",
  "TD",
  "TH",
]);

function shouldSkip(node: Text) {
  const parent = node.parentElement;

  return (
    !parent ||
    Boolean(parent.closest(SKIPPED_SELECTOR))
  );
}

function getTextContainer(node: Text) {
  let element: HTMLElement | null = node.parentElement;

  while (element && element !== document.body) {
    if (TEXT_CONTAINER_TAGS.has(element.tagName)) return element;
    element = element.parentElement;
  }

  return document.body;
}

function collectTextNodes(root: Node) {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (!shouldSkip(node) && node.nodeValue?.trim()) nodes.push(node);
  }

  return nodes;
}

function typograph(root: Node) {
  const nodes = collectTextNodes(root);

  nodes.forEach((node, index) => {
    const value = node.nodeValue;
    if (!value) return;

    const protectedValue = preventHangingPrepositions(value);
    if (protectedValue !== value) node.nodeValue = protectedValue;

    const nextNode = nodes[index + 1];
    const currentValue = node.nodeValue;

    if (
      nextNode &&
      currentValue &&
      hasTrailingShortWord(currentValue) &&
      /^[\s([{"'«„]*[\p{L}\p{N}]/u.test(nextNode.nodeValue ?? "") &&
      getTextContainer(node) === getTextContainer(nextNode)
    ) {
      node.nodeValue = protectTrailingShortWord(currentValue);
    }
  });
}

/**
 * Глобальная типографическая защита для статических и динамических текстов.
 * Компонент ничего не рендерит и запускается после гидратации страницы.
 */
export function TypographyGuard() {
  useEffect(() => {
    let scheduled = false;
    let frameId: number | null = null;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;

      frameId = requestAnimationFrame(() => {
        scheduled = false;
        frameId = null;
        observer.disconnect();
        typograph(document.body);
        observer.observe(document.body, {
          characterData: true,
          childList: true,
          subtree: true,
        });
      });
    });

    typograph(document.body);
    observer.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return null;
}
