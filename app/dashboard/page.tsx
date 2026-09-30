export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          Welcome back
        </p>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Overview
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
          Monitor restaurant activity, orders and sales from one place.
        </p>
      </div>

      {/* Temporary dashboard foundation */}
      <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <p className="text-sm font-semibold text-[var(--color-text)]">
          Dashboard foundation is ready.
        </p>

        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          Real restaurant data will be connected through the backend.
        </p>
      </div>
    </div>
  );
}