import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const CLIENT_MAX_FAILURES = 5;
const GLOBAL_MAX_FAILURES = 50;
const GLOBAL_BUCKET = "global";
const HEADER_NAME_PATTERN = /^[a-z0-9-]{1,64}$/;

function hashIdentifier(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex").slice(0, 40);
}

/**
 * The configured proxy header is trusted only when the hosting proxy overwrites
 * it. Without explicit configuration, all clients share a conservative bucket.
 */
export async function getAdminClientIdentifier() {
  const configuredHeader = process.env.ADMIN_TRUSTED_PROXY_IP_HEADER
    ?.trim()
    .toLowerCase();
  if (!configuredHeader || !HEADER_NAME_PATTERN.test(configuredHeader)) {
    return "client:anonymous";
  }

  const raw = (await headers()).get(configuredHeader)?.split(",")[0]?.trim();
  if (!raw || raw.length > 200) return "client:anonymous";
  return `client:${hashIdentifier(raw)}`;
}

async function bucketIsBlocked(id: string, limit: number, now: Date) {
  const bucket = await prisma.adminLoginRateLimit.findUnique({ where: { id } });
  if (!bucket) return false;

  if (bucket.blockedUntil && bucket.blockedUntil.getTime() > now.getTime()) {
    return true;
  }

  if (now.getTime() - bucket.windowStartedAt.getTime() >= WINDOW_MS) {
    await prisma.adminLoginRateLimit.deleteMany({ where: { id } });
    return false;
  }

  return bucket.attempts >= limit;
}

export async function canAttemptAdminLogin(clientId: string, now = new Date()) {
  const [clientBlocked, globalBlocked] = await Promise.all([
    bucketIsBlocked(clientId, CLIENT_MAX_FAILURES, now),
    bucketIsBlocked(GLOBAL_BUCKET, GLOBAL_MAX_FAILURES, now),
  ]);
  return !clientBlocked && !globalBlocked;
}

export async function recordFailedAdminLogin(clientId: string, now = new Date()) {
  const [client, global] = await Promise.all([
    prisma.adminLoginRateLimit.findUnique({ where: { id: clientId } }),
    prisma.adminLoginRateLimit.findUnique({ where: { id: GLOBAL_BUCKET } }),
  ]);

  const clientExpired =
    client && now.getTime() - client.windowStartedAt.getTime() >= WINDOW_MS;
  const globalExpired =
    global && now.getTime() - global.windowStartedAt.getTime() >= WINDOW_MS;

  if (clientExpired || globalExpired) {
    await prisma.adminLoginRateLimit.deleteMany({
      where: {
        id: {
          in: [
            ...(clientExpired ? [clientId] : []),
            ...(globalExpired ? [GLOBAL_BUCKET] : []),
          ],
        },
      },
    });
  }

  const currentClientAttempts = clientExpired ? 0 : (client?.attempts ?? 0);
  const currentGlobalAttempts = globalExpired ? 0 : (global?.attempts ?? 0);
  const clientBlockedUntil = new Date(now.getTime() + WINDOW_MS);
  const globalBlockedUntil = new Date(now.getTime() + WINDOW_MS);

  await prisma.$transaction([
    prisma.adminLoginRateLimit.upsert({
      where: { id: clientId },
      create: {
        id: clientId,
        attempts: 1,
        windowStartedAt: now,
        blockedUntil:
          CLIENT_MAX_FAILURES <= 1 ? clientBlockedUntil : null,
      },
      update: {
        attempts: { increment: 1 },
        blockedUntil:
          currentClientAttempts + 1 >= CLIENT_MAX_FAILURES
            ? clientBlockedUntil
            : null,
      },
    }),
    prisma.adminLoginRateLimit.upsert({
      where: { id: GLOBAL_BUCKET },
      create: {
        id: GLOBAL_BUCKET,
        attempts: 1,
        windowStartedAt: now,
        blockedUntil:
          GLOBAL_MAX_FAILURES <= 1 ? globalBlockedUntil : null,
      },
      update: {
        attempts: { increment: 1 },
        blockedUntil:
          currentGlobalAttempts + 1 >= GLOBAL_MAX_FAILURES
            ? globalBlockedUntil
            : null,
      },
    }),
  ]);
}

export async function clearAdminLoginFailures(clientId: string) {
  await prisma.adminLoginRateLimit.deleteMany({ where: { id: clientId } });
}

export const adminLoginRateLimitPolicy = {
  windowMs: WINDOW_MS,
  clientMaxFailures: CLIENT_MAX_FAILURES,
  globalMaxFailures: GLOBAL_MAX_FAILURES,
} as const;
