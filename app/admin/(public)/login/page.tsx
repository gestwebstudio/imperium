import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/admin-auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdminSession()) redirect("/admin/news");
  const { error } = await searchParams;

  return (
    <div className="admin-auth">
      <form className="admin-login" action={login}>
        <h1>Вход в админку</h1>
        {error ? (
          <p className="admin-login__error">Неверные данные для входа</p>
        ) : null}
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          aria-label="Пароль"
          autoComplete="current-password"
          maxLength={1024}
          required
          autoFocus
        />
        <button type="submit" className="admin-btn">
          Войти
        </button>
      </form>
    </div>
  );
}
