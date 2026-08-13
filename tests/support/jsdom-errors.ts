export type JSDOMError = Error & { sheetText?: string; type?: string };

export function isKnownFluidTokenDiagnostic(error: JSDOMError) {
  return (
    error.type === "css-parsing" &&
    error.sheetText?.includes("--fluid-progress") === true &&
    error.sheetText.includes("var(--fluid-to) - var(--fluid-from)")
  );
}
