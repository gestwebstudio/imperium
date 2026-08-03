import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Проверка сессии в серверных компонентах / экшенах. */
export async function isAuthed(): Promise<boolean> {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  const pass = adminPassword();
  return Boolean(pass) && value === pass;
}
