import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

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
