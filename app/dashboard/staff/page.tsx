"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

type StaffRole = "OWNER" | "ADMIN" | "WORKER";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
}

const ROLE_PERMISSIONS = {
  OWNER: [
    "Full dashboard access",
    "Manage orders",
    "Manage products",
    "Manage coupons",
    "Manage customers",
    "View reports",
    "Create and manage staff",
    "Manage settings",
  ],

  ADMIN: [
    "View dashboard",
    "Manage orders",
    "Manage products",
    "Manage coupons",
    "View customers",
    "View reports",
  ],

  WORKER: [
    "View dashboard",
    "View orders",
    "Update order status",
  ],
} as const;

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<"ADMIN" | "WORKER">("WORKER");

  const [showPassword, setShowPassword] =
    useState(false);

  const [expandedRole, setExpandedRole] =
    useState<StaffRole | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  /*
   * Load staff list.
   */
  async function loadStaff() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/staff", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load staff accounts.",
        );
      }

      setStaff(data.staff || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load staff accounts.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  /*
   * Create staff account.
   */
  async function handleCreateStaff(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    const normalizedName = name.trim();
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedName) {
      setError(
        "Please enter the staff member's name.",
      );
      return;
    }

    if (!normalizedEmail) {
      setError(
        "Please enter the staff member's email.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create staff account.",
        );
      }

      setMessage(
        `${role} account created successfully.`,
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("WORKER");

      await loadStaff();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * Revoke staff access.
   */
  async function handleRevokeAccess(
    staffId: string,
    staffName: string,
  ) {
    const confirmed = window.confirm(
      `Revoke access for ${staffName}? This action cannot be undone from this screen.`,
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");
    setDeletingId(staffId);

    try {
      const response = await fetch(
        `/api/staff?id=${encodeURIComponent(staffId)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to revoke access.",
        );
      }

      setMessage(
        "Staff access revoked successfully.",
      );

      await loadStaff();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to revoke access.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function toggleRole(roleName: StaffRole) {
    setExpandedRole((current) =>
      current === roleName ? null : roleName,
    );
  }

  function getRoleBadgeClass(roleName: StaffRole) {
    if (roleName === "OWNER") {
      return "bg-red-50 text-[var(--color-primary)]";
    }

    if (roleName === "ADMIN") {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-blue-50 text-blue-700";
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          Administration
        </p>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Staff & Roles
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
          Create authorized staff accounts, assign roles
          and manage restaurant access.
        </p>
      </div>

      {/* Global messages */}
      <div className="mt-6 space-y-3">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs leading-5 text-green-700"
          >
            <Check size={15} />
            {message}
          </div>
        )}
      </div>

      {/* Create + Role permissions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        {/* Create account */}
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background-warm)] text-[var(--color-primary)]">
              <UserPlus size={20} />
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Create Staff Account
              </h3>

              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Create an Admin or Worker account.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateStaff}
            className="mt-6 space-y-5"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="staff-name"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Full name
              </label>

              <input
                id="staff-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Staff member name"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:bg-gray-50"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="staff-email"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Email address
              </label>

              <input
                id="staff-email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="staff@biteora.com"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:bg-gray-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="staff-password"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Initial password
              </label>

              <div className="relative">
                <KeyRound
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />

                <input
                  id="staff-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] pl-10 pr-11 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-[10px] text-[var(--color-text-muted)]">
                This password is used for the initial
                staff login.
              </p>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="staff-role"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Role
              </label>

              <select
                id="staff-role"
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value as
                      | "ADMIN"
                      | "WORKER",
                  )
                }
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:bg-gray-50"
              >
                <option value="WORKER">
                  Worker
                </option>

                <option value="ADMIN">
                  Admin
                </option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus size={17} />

              {isSubmitting
                ? "Creating..."
                : "Create Staff Account"}
            </button>
          </form>
        </section>

        {/* Functional role permissions */}
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background-warm)] text-[var(--color-primary)]">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Role Permissions
              </h3>

              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Click a role to see its permissions.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {(
              ["OWNER", "ADMIN", "WORKER"] as StaffRole[]
            ).map((roleName) => {
              const isExpanded =
                expandedRole === roleName;

              return (
                <div
                  key={roleName}
                  className="overflow-hidden rounded-xl border border-[var(--color-border)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleRole(roleName)
                    }
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[var(--color-background)]"
                  >
                    <div className="flex items-center gap-3">
                      <UserCog
                        size={17}
                        className="text-[var(--color-primary)]"
                      />

                      <div>
                        <p className="text-sm font-bold text-[var(--color-text)]">
                          {roleName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                          {ROLE_PERMISSIONS[
                            roleName
                          ].length}{" "}
                          permissions
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[var(--color-text-muted)]">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] p-4">
                      <ul className="space-y-2">
                        {ROLE_PERMISSIONS[
                          roleName
                        ].map((permission) => (
                          <li
                            key={permission}
                            className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]"
                          >
                            <Check
                              size={14}
                              className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                            />

                            <span>
                              {permission}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Staff list */}
      <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[var(--color-border)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background-warm)] text-[var(--color-primary)]">
              <Users size={20} />
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Staff Accounts
              </h3>

              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                View and manage authorized restaurant users.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[var(--color-text-muted)]">
            {staff.length}{" "}
            {staff.length === 1
              ? "account"
              : "accounts"}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-[var(--color-text-muted)]">
            Loading staff accounts...
          </div>
        ) : staff.length === 0 ? (
          <div className="p-8 text-center">
            <Users
              size={24}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">
              No staff accounts found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-background)] text-xs font-bold text-[var(--color-text-secondary)]">
                    {member.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-[var(--color-text)]">
                        {member.name}
                      </p>

                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-bold ${getRoleBadgeClass(
                          member.role,
                        )}`}
                      >
                        {member.role}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      member.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {member.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                  {member.role !== "OWNER" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRevokeAccess(
                          member.id,
                          member.name,
                        )
                      }
                      disabled={
                        deletingId === member.id
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={14} />

                      {deletingId === member.id
                        ? "Removing..."
                        : "Revoke Access"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Security note */}
      <div className="mt-6 flex gap-3 rounded-xl bg-[var(--color-background-warm)] p-4">
        <ShieldCheck
          size={17}
          className="mt-0.5 shrink-0 text-[var(--color-primary)]"
        />

        <p className="text-[11px] leading-5 text-[var(--color-text-muted)]">
          Staff passwords are never displayed in the staff
          list. In production, authentication, password
          hashing, session validation and role permissions
          must be enforced by the backend.
        </p>
      </div>
    </div>
  );
}