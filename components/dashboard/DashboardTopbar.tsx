"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  UserCircle,
} from "lucide-react";

export default function DashboardTopbar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      /*
       * Go back to the login page after the
       * authentication session has been removed.
       */
      window.location.href = "/auth/login";
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[var(--color-border)] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="pl-12 lg:pl-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          Restaurant Management
        </p>

        <h1 className="mt-0.5 text-lg font-bold text-[var(--color-text)]">
          Dashboard
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
        >
          <Bell size={19} />

          <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowUserMenu((current) => !current)
            }
            aria-expanded={showUserMenu}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-[var(--color-background)]"
          >
            <UserCircle
              size={34}
              strokeWidth={1.5}
              className="text-[var(--color-text-secondary)]"
            />

            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold text-[var(--color-text)]">
                Restaurant Owner
              </p>

              <p className="text-[10px] text-[var(--color-text-muted)]">
                Owner
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`hidden text-[var(--color-text-muted)] transition-transform sm:block ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-[var(--color-border)] bg-white p-2 shadow-xl">
              <div className="border-b border-[var(--color-border)] px-3 py-2">
                <p className="text-xs font-bold text-[var(--color-text)]">
                  Restaurant Owner
                </p>

                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                  OWNER
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={16} />

                {isLoggingOut
                  ? "Signing out..."
                  : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}