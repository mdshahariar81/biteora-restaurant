"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    /*
      Frontend validation only.

      IMPORTANT:
      The backend must validate the credentials again.
      Never trust values coming from the browser.
    */

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
        Authentication API boundary.

        Later the backend developer will implement:

        POST /api/auth/login

        Request:
        {
          email: string,
          password: string
        }

        Expected successful response:
        {
          success: true,
          user: {
            id: string,
            name: string,
            email: string,
            role: "OWNER" | "ADMIN" | "WORKER"
          }
        }

        The backend should create a secure session
        using an HttpOnly, Secure, SameSite cookie.
      */

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.message ||
            "Unable to sign in. Please check your credentials.",
        );
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(
          data?.message || "Unable to sign in.",
        );
      }

      /*
        Backend has authenticated the user.

        The secure session should already be stored
        by the backend as an HttpOnly cookie.

        We do NOT store passwords or authentication
        secrets in localStorage/sessionStorage.
      */

      window.location.href = "/dashboard";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-3xl font-extrabold tracking-tight text-[var(--color-primary)]"
            >
              Biteora
            </Link>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Restaurant Management
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-background-warm)] text-[var(--color-primary)]">
                <ShieldCheck size={22} />
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                Sign in to access your restaurant dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="owner@biteora.com"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-11 pr-4 text-sm text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-11 pr-12 text-sm text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)] disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 rounded-xl bg-[var(--color-background)] p-4">
              <div className="flex gap-3">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                />

                <p className="text-[11px] leading-5 text-[var(--color-text-muted)]">
                  Access to the restaurant dashboard is restricted
                  to authorized staff accounts. Authentication and
                  permissions are enforced by the backend.
                </p>
              </div>
            </div>
          </div>

          {/* Back to website */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
            >
              ← Back to Biteora
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}