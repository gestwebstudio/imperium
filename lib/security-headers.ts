const isEnabled = (value: string | undefined) =>
  value?.trim().toLowerCase() === "true";

function configuredImageSources() {
  return (process.env.ADMIN_IMAGE_HOSTS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .flatMap((host) => {
      try {
        const url = new URL(`https://${host}`);
        return url.hostname === host && url.host === host && !url.username
          ? [url.origin]
          : [];
      } catch {
        return [];
      }
    });
}

export function buildContentSecurityPolicy(production: boolean) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' 'unsafe-inline'${production ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob:${configuredImageSources()
      .map((source) => ` ${source}`)
      .join("")}`,
    "font-src 'self' data:",
    `connect-src 'self'${production ? "" : " ws: wss:"}`,
    "frame-src https://yandex.ru https://vk.com",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(production ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
}

export function buildSecurityHeaders(options?: {
  production?: boolean;
  reportOnly?: boolean;
}) {
  const production = options?.production ?? process.env.NODE_ENV === "production";
  const reportOnly =
    options?.reportOnly ?? isEnabled(process.env.CSP_REPORT_ONLY);
  const headers = [
    {
      key: reportOnly
        ? "Content-Security-Policy-Report-Only"
        : "Content-Security-Policy",
      value: buildContentSecurityPolicy(production),
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=(), autoplay=(self \"https://vk.com\"), encrypted-media=(self \"https://vk.com\"), fullscreen=(self \"https://yandex.ru\" \"https://vk.com\"), picture-in-picture=(self \"https://vk.com\")",
    },
  ];

  if (production) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000",
    });
  }

  return headers;
}
