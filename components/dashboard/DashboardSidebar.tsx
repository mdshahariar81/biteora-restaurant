"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  UserCog,
  X,
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["OWNER", "ADMIN", "WORKER"],
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
    roles: ["OWNER", "ADMIN", "WORKER"],
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: ShoppingBag,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Coupons",
    href: "/dashboard/coupons",
    icon: Tag,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Staff & Roles",
    href: "/dashboard/staff",
    icon: UserCog,
    roles: ["OWNER"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["OWNER"],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  /*
   * Temporary development role.
   *
   * IMPORTANT:
   * Because the role cookie is HttpOnly, the browser cannot
   * read it directly.
   *
   * The final production version will receive the authenticated
   * user/role from the server session.
   *
   * For now, the demo dashboard defaults to OWNER so that
   * the Owner interface is visible during development.
   */
  const currentRole = "OWNER";

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(currentRole),
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open dashboard menu"
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] shadow-sm lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--color-border)] bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[72px] items-center justify-between border-b border-[var(--color-border)] px-6">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-extrabold tracking-tight text-[var(--color-primary)]">
              Biteora
            </span>

            <span className="rounded-md bg-[var(--color-background)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Admin
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close dashboard menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={2}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--color-border)] p-4">
          <div className="rounded-xl bg-[var(--color-background-warm)] p-4">
            <p className="text-xs font-bold text-[var(--color-text)]">
              Restaurant Dashboard
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
              Manage restaurant operations from one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}