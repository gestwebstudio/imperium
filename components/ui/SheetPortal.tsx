"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type SheetPortalProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Places a Sheet in the document root so page animations and local stacking
 * contexts can never put it underneath the fixed site header.
 */
export function SheetPortal({ children, className }: SheetPortalProps) {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRoot(document.body);
  }, []);

  if (!root) return null;

  return createPortal(
    <div className={`ui-sheet-layer${className ? ` ${className}` : ""}`}>
      {children}
    </div>,
    root,
  );
}
