export default function HomePage() {
  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 32px" }}>
      <div
        className="t-heading-h3-h3-extrabold"
        style={{ color: "var(--color-heritage-green-500)" }}
      >
        Imperium&nbsp;Motors
      </div>
      <p
        className="t-text-18-18-regular"
        style={{ marginTop: 16, color: "var(--color-warm-taupe-500)", maxWidth: 560 }}
      >
        Каркас проекта готов: Next.js (App Router) + Tailwind v4 + HeroUI, дизайн — наш
        UI-кит. Дальше собираем компоненты и страницы.
      </p>
      <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn btn--m btn--primary-surface">
          <span>Каталог</span>
        </button>
        <button className="btn btn--m btn--secondary-outlined">
          <span>Услуги</span>
        </button>
      </div>
    </main>
  );
}
