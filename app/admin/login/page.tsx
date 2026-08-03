import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <form className="admin-login" action={login}>
      <h1>Вход в админку</h1>
      {error ? <p className="admin-login__error">Неверный пароль</p> : null}
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        autoComplete="current-password"
        required
        autoFocus
      />
      <button type="submit" className="admin-btn">
        Войти
      </button>
    </form>
  );
}
