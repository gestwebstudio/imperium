import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildContentSecurityPolicy,
  buildSecurityHeaders,
} from "@/lib/security-headers";

describe("security headers", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("builds an enforcing production CSP without unsafe-eval", () => {
    const csp = buildContentSecurityPolicy(true);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("frame-src https://yandex.ru https://vk.com");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("fonts.googleapis.com");
  });

  it("adds only validated admin image hosts to img-src", () => {
    vi.stubEnv(
      "ADMIN_IMAGE_HOSTS",
      "cdn.imperium.test,evil.test/path,cdn.imperium.test:8443",
    );
    const csp = buildContentSecurityPolicy(true);
    expect(csp).toContain(
      "img-src 'self' data: blob: https://cdn.imperium.test",
    );
    expect(csp).not.toContain("evil.test");
    expect(csp).not.toContain(":8443");
  });

  it("allows dev tooling only outside production", () => {
    const csp = buildContentSecurityPolicy(false);
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("connect-src 'self' ws: wss:");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });

  it("switches CSP to report-only and emits HSTS only in production", () => {
    const production = buildSecurityHeaders({ production: true, reportOnly: true });
    expect(production).toContainEqual(
      expect.objectContaining({ key: "Content-Security-Policy-Report-Only" }),
    );
    expect(production).toContainEqual({
      key: "Strict-Transport-Security",
      value: "max-age=31536000",
    });
    expect(production).toContainEqual({ key: "X-Frame-Options", value: "DENY" });

    const development = buildSecurityHeaders({ production: false, reportOnly: false });
    expect(development.some(({ key }) => key === "Strict-Transport-Security")).toBe(false);
    expect(development.some(({ key }) => key === "Content-Security-Policy")).toBe(true);
  });
});
