import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";
import { isAuthed } from "@/lib/auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Админка — Imperium Motors",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Не авторизован → показываем страницу входа без сайдбара.
  if (!(await isAuthed())) {
    return <div className="admin-auth">{children}</div>;
  }

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          Imperium <span>Админка</span>
        </div>
        <nav className="admin-nav">
          <Link href="/admin/news">Новости</Link>
          <Link href="/admin/reviews">Отзывы</Link>
        </nav>
        <form action={logout} className="admin-logout">
          <button type="submit">Выйти</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
