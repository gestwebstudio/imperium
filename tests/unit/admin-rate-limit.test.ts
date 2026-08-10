import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  adminLoginRateLimit: {
    findUnique: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
  },
  $transaction: vi.fn(),
}));
const headerStore = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/lib/db", () => ({ prisma: db }));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => headerStore) }));

import {
  adminLoginRateLimitPolicy,
  canAttemptAdminLogin,
  clearAdminLoginFailures,
  getAdminClientIdentifier,
  recordFailedAdminLogin,
} from "@/lib/admin-rate-limit";

const NOW = new Date("2026-08-10T10:00:00.000Z");

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  db.adminLoginRateLimit.deleteMany.mockResolvedValue({ count: 0 });
  db.adminLoginRateLimit.upsert.mockResolvedValue({});
  db.$transaction.mockResolvedValue([]);
});

describe("persistent admin login rate limit", () => {
  it("uses a shared bucket unless an overwritten proxy header is configured", async () => {
    await expect(getAdminClientIdentifier()).resolves.toBe("client:anonymous");
    expect(headerStore.get).not.toHaveBeenCalled();

    vi.stubEnv("ADMIN_TRUSTED_PROXY_IP_HEADER", "X-Real-IP");
    headerStore.get.mockReturnValue("203.0.113.10, 10.0.0.1");
    const first = await getAdminClientIdentifier();
    const second = await getAdminClientIdentifier();
    expect(first).toMatch(/^client:[a-f0-9]{40}$/);
    expect(second).toBe(first);
    expect(first).not.toContain("203.0.113.10");
  });

  it("blocks active client and global buckets", async () => {
    db.adminLoginRateLimit.findUnique.mockImplementation(
      ({ where }: { where: { id: string } }) =>
        Promise.resolve(
          where.id === "client:test"
            ? {
                attempts: adminLoginRateLimitPolicy.clientMaxFailures,
                windowStartedAt: NOW,
                blockedUntil: new Date(NOW.getTime() + 60_000),
              }
            : null,
        ),
    );
    await expect(canAttemptAdminLogin("client:test", NOW)).resolves.toBe(false);
  });

  it("cleans expired buckets and allows another attempt", async () => {
    db.adminLoginRateLimit.findUnique.mockResolvedValue({
      attempts: 99,
      windowStartedAt: new Date(NOW.getTime() - 16 * 60_000),
      blockedUntil: new Date(NOW.getTime() - 1),
    });
    await expect(canAttemptAdminLogin("client:test", NOW)).resolves.toBe(true);
    expect(db.adminLoginRateLimit.deleteMany).toHaveBeenCalled();
  });

  it("persists client and global failures and starts blocking at the threshold", async () => {
    db.adminLoginRateLimit.findUnique.mockImplementation(
      ({ where }: { where: { id: string } }) =>
        Promise.resolve(
          where.id === "client:test"
            ? {
                attempts: adminLoginRateLimitPolicy.clientMaxFailures - 1,
                windowStartedAt: NOW,
              }
            : { attempts: 1, windowStartedAt: NOW },
        ),
    );
    await recordFailedAdminLogin("client:test", NOW);
    expect(db.adminLoginRateLimit.upsert).toHaveBeenCalledTimes(2);
    expect(db.adminLoginRateLimit.upsert.mock.calls[0][0].update).toEqual(
      expect.objectContaining({
        attempts: { increment: 1 },
        blockedUntil: new Date(
          NOW.getTime() + adminLoginRateLimitPolicy.windowMs,
        ),
      }),
    );
    expect(db.$transaction).toHaveBeenCalledOnce();
  });

  it("clears only the successful client's local bucket", async () => {
    await clearAdminLoginFailures("client:test");
    expect(db.adminLoginRateLimit.deleteMany).toHaveBeenCalledWith({
      where: { id: "client:test" },
    });
  });
});
