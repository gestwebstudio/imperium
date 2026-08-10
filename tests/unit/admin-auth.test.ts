import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  adminSession: {
    findUnique: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
}));
const cookieStore = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));
const bcrypt = vi.hoisted(() => ({ compare: vi.fn() }));
const navigation = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@/lib/db", () => ({ prisma: db }));
vi.mock("next/headers", () => ({ cookies: vi.fn(async () => cookieStore) }));
vi.mock("bcryptjs", () => ({ compare: bcrypt.compare }));
vi.mock("next/navigation", () => navigation);

import {
  ADMIN_COOKIE,
  AdminAuthConfigurationError,
  createAdminSession,
  deleteAdminSession,
  getAdminSession,
  getAdminSessionTtlMs,
  hashAdminSessionToken,
  requireAdmin,
  verifyAdminPassword,
} from "@/lib/admin-auth";

const HASH = "$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
const TOKEN = "a".repeat(43);

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.useRealTimers();
  vi.stubEnv("ADMIN_PASSWORD_HASH", HASH);
  db.adminSession.deleteMany.mockResolvedValue({ count: 0 });
  db.adminSession.create.mockResolvedValue({});
  cookieStore.get.mockReturnValue(undefined);
});

describe("admin auth configuration and password", () => {
  it("fails closed for a missing or malformed bcrypt hash", async () => {
    vi.stubEnv("ADMIN_PASSWORD_HASH", "");
    await expect(verifyAdminPassword("password")).rejects.toBeInstanceOf(
      AdminAuthConfigurationError,
    );
    cookieStore.get.mockReturnValue({ value: TOKEN });
    await expect(getAdminSession()).rejects.toBeInstanceOf(
      AdminAuthConfigurationError,
    );
  });

  it("uses bcrypt and rejects empty or oversized passwords before compare", async () => {
    bcrypt.compare.mockResolvedValue(true);
    await expect(verifyAdminPassword("correct")).resolves.toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("correct", HASH);

    await expect(verifyAdminPassword("")).resolves.toBe(false);
    await expect(verifyAdminPassword("x".repeat(1025))).resolves.toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
  });

  it("uses an 8h default TTL and clamps configuration", () => {
    vi.stubEnv("ADMIN_SESSION_TTL_HOURS", "");
    expect(getAdminSessionTtlMs()).toBe(8 * 60 * 60 * 1000);
    vi.stubEnv("ADMIN_SESSION_TTL_HOURS", "0");
    expect(getAdminSessionTtlMs()).toBe(60 * 60 * 1000);
    vi.stubEnv("ADMIN_SESSION_TTL_HOURS", "999");
    expect(getAdminSessionTtlMs()).toBe(168 * 60 * 60 * 1000);
  });
});

describe("opaque database sessions", () => {
  it("does not query the DB for malformed tokens", async () => {
    cookieStore.get.mockReturnValue({ value: "plaintext-password" });
    await expect(getAdminSession()).resolves.toBeNull();
    expect(db.adminSession.findUnique).not.toHaveBeenCalled();
  });

  it("returns a valid session by SHA-256 hash", async () => {
    const session = {
      id: "session-1",
      tokenHash: hashAdminSessionToken(TOKEN),
      expiresAt: new Date(Date.now() + 60_000),
    };
    cookieStore.get.mockReturnValue({ value: TOKEN });
    db.adminSession.findUnique.mockResolvedValue(session);

    await expect(getAdminSession()).resolves.toBe(session);
    expect(db.adminSession.findUnique).toHaveBeenCalledWith({
      where: { tokenHash: hashAdminSessionToken(TOKEN) },
    });
  });

  it("rejects a modified token and a missing database session", async () => {
    cookieStore.get.mockReturnValue({ value: TOKEN });
    db.adminSession.findUnique.mockResolvedValue(null);
    await expect(getAdminSession()).resolves.toBeNull();

    cookieStore.get.mockReturnValue({ value: `b${TOKEN.slice(1)}` });
    await expect(getAdminSession()).resolves.toBeNull();
    expect(db.adminSession.findUnique).toHaveBeenLastCalledWith({
      where: { tokenHash: hashAdminSessionToken(`b${TOKEN.slice(1)}`) },
    });
  });

  it("deletes and rejects an expired session", async () => {
    cookieStore.get.mockReturnValue({ value: TOKEN });
    db.adminSession.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() - 1),
    });

    await expect(getAdminSession()).resolves.toBeNull();
    expect(db.adminSession.deleteMany).toHaveBeenCalledWith({
      where: { tokenHash: hashAdminSessionToken(TOKEN) },
    });
  });

  it("redirects unauthenticated protected access", async () => {
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
  });

  it("stores only a hash and sets a scoped hardened cookie", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T08:00:00.000Z"));
    vi.stubEnv("NODE_ENV", "production");

    await createAdminSession();

    const created = db.adminSession.create.mock.calls[0][0].data;
    const cookie = cookieStore.set.mock.calls[0];
    expect(cookie[0]).toBe(ADMIN_COOKIE);
    expect(cookie[1]).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(cookie[1]).not.toBe("imperium-security-test");
    expect(created.tokenHash).toBe(hashAdminSessionToken(cookie[1]));
    expect(created.tokenHash).not.toBe(cookie[1]);
    expect(cookie[2]).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/admin",
      maxAge: 28_800,
    });
    expect(cookie[2].expires).toEqual(created.expiresAt);
  });

  it("deletes the DB session and expires the cookie idempotently", async () => {
    cookieStore.get.mockReturnValue({ value: TOKEN });
    await deleteAdminSession();
    expect(db.adminSession.deleteMany).toHaveBeenCalledWith({
      where: { tokenHash: hashAdminSessionToken(TOKEN) },
    });
    expect(cookieStore.set).toHaveBeenCalledWith(
      ADMIN_COOKIE,
      "",
      expect.objectContaining({ path: "/admin", maxAge: 0 }),
    );

    vi.clearAllMocks();
    cookieStore.get.mockReturnValue(undefined);
    await expect(deleteAdminSession()).resolves.toBeUndefined();
    expect(db.adminSession.deleteMany).not.toHaveBeenCalled();
    expect(cookieStore.set).toHaveBeenCalledOnce();
  });
});
