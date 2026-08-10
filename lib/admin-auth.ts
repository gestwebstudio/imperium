import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const ADMIN_COOKIE = "admin_session";
const DEFAULT_SESSION_TTL_HOURS = 8;
const MIN_SESSION_TTL_HOURS = 1;
const MAX_SESSION_TTL_HOURS = 168;
const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export class AdminAuthConfigurationError extends Error {
  constructor() {
    super("Admin authentication is not configured.");
    this.name = "AdminAuthConfigurationError";
  }
}

function getPasswordHash() {
  const value = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!value || !BCRYPT_HASH_PATTERN.test(value)) {
    throw new AdminAuthConfigurationError();
  }
  return value;
}

export function assertAdminAuthConfigured() {
  getPasswordHash();
}

export function getAdminSessionTtlMs() {
  const configured = Number.parseInt(
    process.env.ADMIN_SESSION_TTL_HOURS ?? "",
    10,
  );
  const hours = Number.isFinite(configured)
    ? Math.min(
        MAX_SESSION_TTL_HOURS,
        Math.max(MIN_SESSION_TTL_HOURS, configured),
      )
    : DEFAULT_SESSION_TTL_HOURS;

  return hours * 60 * 60 * 1000;
}

export function hashAdminSessionToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function verifyAdminPassword(password: string) {
  if (!password || password.length > 1024) return false;
  return compare(password, getPasswordHash());
}

export async function cleanupExpiredAdminSessions(now = new Date()) {
  await prisma.adminSession.deleteMany({
    where: { expiresAt: { lte: now } },
  });
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || !SESSION_TOKEN_PATTERN.test(token)) return null;
  assertAdminAuthConfigured();

  const tokenHash = hashAdminSessionToken(token);
  const session = await prisma.adminSession.findUnique({ where: { tokenHash } });
  if (!session) return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.deleteMany({ where: { tokenHash } });
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function createAdminSession() {
  assertAdminAuthConfigured();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashAdminSessionToken(token);
  const expiresAt = new Date(Date.now() + getAdminSessionTtlMs());

  await cleanupExpiredAdminSessions();
  await prisma.adminSession.create({ data: { tokenHash, expiresAt } });

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    expires: expiresAt,
    maxAge: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
  });

  return { expiresAt };
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (token && SESSION_TOKEN_PATTERN.test(token)) {
    await prisma.adminSession.deleteMany({
      where: { tokenHash: hashAdminSessionToken(token) },
    });
  }

  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    expires: new Date(0),
    maxAge: 0,
  });
}
