"use client";

import { FormEvent, useState } from "react";

/**
 * ============================================================
 * Footer Component
 * ============================================================
 *
 * Responsibilities:
 * - Brand information
 * - Quick navigation
 * - Support links
 * - Newsletter subscription
 * - Social links
 * - Developer information
 *
 * IMPORTANT:
 * AppDownload is intentionally NOT included here.
 *
 * SECURITY NOTE:
 * Frontend validation is only for UX.
 * Backend must validate and sanitize all user input again.
 * ============================================================
 */

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);

  function handleNewsletterSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setMessage("Please enter your email.");
      return;
    }

    if (!normalizedEmail.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    /*
     * BACKEND INTEGRATION POINT
     *
     * Later your backend developer can connect:
     *
     * POST /api/newsletter
     *
     * Backend MUST:
     * - Validate email
     * - Normalize input
     * - Rate-limit requests
     * - Prevent abuse/spam
     * - Store data securely
     */

    setMessage("Thanks! You're subscribed.");
    setEmail("");
  }

  return (
    <footer
      className="
        bg-[var(--color-background)]
        text-[var(--color-text)]
        animate-[footerFadeIn_0.7s_ease-out_both]
      "
    >
      {/* ========================================================
          MAIN FOOTER CONTENT
          ======================================================== */}

      <section className="px-5 pb-8 pt-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1200px]">

          <div className="grid gap-10 border-b border-[var(--color-border)] pb-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}
            <div className="animate-[footerColumnIn_0.6s_ease-out_both]">
              <a
                href="/"
                aria-label="Biteora home"
                className="
                  inline-flex items-center gap-3
                  transition-transform duration-300
                  hover:scale-[1.02]
                "
              >
                <span
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-full
                    bg-[var(--color-primary)]
                    text-lg font-extrabold text-white
                    transition-transform duration-300
                    hover:rotate-3 hover:scale-105
                  "
                >
                  B
                </span>

                <span>
                  <span className="block text-xl font-extrabold leading-none">
                    Biteora
                  </span>

                  <span className="mt-1 block text-[7px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
                    GOOD FOOD • BETTER MOOD
                  </span>
                </span>
              </a>

              <p className="mt-5 max-w-[250px] text-sm leading-6 text-[var(--color-text-muted)]">
                Crunchy moments. Happier people.
                <br />
                Fresh food made with care.
              </p>

              {/* SOCIAL LINKS */}
              <div className="mt-6 flex items-center gap-2">

                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-[var(--color-border)]
                    text-[var(--color-text)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-[var(--color-primary)]
                    hover:bg-[var(--color-primary)]
                    hover:text-white
                    hover:shadow-sm
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.67.33-1 1-1Z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-[var(--color-border)]
                    text-[var(--color-text)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-[var(--color-primary)]
                    hover:bg-[var(--color-primary)]
                    hover:text-white
                    hover:shadow-sm
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                    />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="0.8"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  aria-label="YouTube"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-[var(--color-border)]
                    text-[var(--color-text)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-[var(--color-primary)]
                    hover:bg-[var(--color-primary)]
                    hover:text-white
                    hover:shadow-sm
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.4 3.8-6.4 3.8Z" />
                  </svg>
                </a>

                {/* Website */}
                <a
                  href="#"
                  aria-label="Website"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-[var(--color-border)]
                    text-[var(--color-text)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-[var(--color-primary)]
                    hover:bg-[var(--color-primary)]
                    hover:text-white
                    hover:shadow-sm
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21" />
                    <path d="M12 3C9.5 5.5 8.2 8.5 8.2 12s1.3 6.5 3.8 9" />
                  </svg>
                </a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div
              className="animate-[footerColumnIn_0.6s_ease-out_both]"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Quick Links
              </h3>

              <nav
                aria-label="Footer quick links"
                className="mt-5 flex flex-col gap-3"
              >
                {[
                  ["/", "Home"],
                  ["/menu", "Menu"],
                  ["/offers", "Offers"],
                  ["/about", "About"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <a
                    key={label}
                    href={href}
                    className="
                      text-sm text-[var(--color-text-muted)]
                      transition-all duration-300
                      hover:translate-x-1
                      hover:text-[var(--color-primary)]
                    "
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* SUPPORT */}
            <div
              className="animate-[footerColumnIn_0.6s_ease-out_both]"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Support
              </h3>

              <nav
                aria-label="Footer support links"
                className="mt-5 flex flex-col gap-3"
              >
                {[
                  "FAQ",
                  "Shipping",
                  "Returns",
                  "Privacy Policy",
                  "Terms & Conditions",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="
                      text-sm text-[var(--color-text-muted)]
                      transition-all duration-300
                      hover:translate-x-1
                      hover:text-[var(--color-primary)]
                    "
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            {/* NEWSLETTER */}
            <div
              className="animate-[footerColumnIn_0.6s_ease-out_both]"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Subscribe to our newsletter
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                Get updates about new meals, offers and special deals.
              </p>

              <form
                onSubmit={handleNewsletterSubmit}
                className="mt-5"
              >
                <label
                  htmlFor="footer-email"
                  className="sr-only"
                >
                  Your email
                </label>

                <div className="flex overflow-hidden rounded-xl border border-[var(--color-border)] bg-white transition-colors duration-300 focus-within:border-[var(--color-primary)] focus-within:shadow-sm">

                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value.slice(0, 254));

                      if (message) {
                        setMessage("");
                      }
                    }}
                    maxLength={254}
                    required
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
                  />

                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      bg-[var(--color-primary)]
                      text-white
                      transition-all duration-300
                      hover:bg-[var(--color-primary-hover)]
                      hover:shadow-md
                      active:scale-95
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 transition-transform duration-300 hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </button>
                </div>

                {message && (
                  <p
                    role="status"
                    className="mt-2 animate-[footerMessageIn_0.3s_ease-out_both] text-xs text-[var(--color-text-muted)]"
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* ==================================================
              BOTTOM FOOTER
              ================================================== */}

          <div className="flex flex-col gap-3 pt-6 text-[12px] text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">

            <p>
              © 2024 Biteora. All rights reserved.
            </p>

            {/* Developer information trigger */}
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setShowDeveloperInfo((current) => !current)
                }
                aria-expanded={showDeveloperInfo}
                aria-controls="developer-info"
                className="
                  cursor-pointer
                  transition-colors duration-300
                  hover:text-[var(--color-primary)]
                "
              >
                DEVELOPER INFORMATION
              </button>

              {showDeveloperInfo && (
                <div
                  id="developer-info"
                  className="
                    absolute bottom-full right-0 z-50 mb-3
                    w-[290px]
                    overflow-hidden
                    rounded-2xl
                    border border-[var(--color-border)]
                    bg-white
                    p-4
                    text-left
                    shadow-xl
                    animate-[developerPopupIn_0.3s_ease-out_both]
                  "
                >
                  <div className="mb-4 flex items-center justify-between">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                        Development Team
                      </p>

                      <h3 className="mt-1 text-base font-bold text-[var(--color-text)]">
                        Meet the Developers
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowDeveloperInfo(false)
                      }
                      aria-label="Close developer information"
                      className="
                        flex h-7 w-7 items-center justify-center
                        rounded-full
                        text-lg text-[var(--color-text-muted)]
                        transition-all duration-300
                        hover:rotate-90
                        hover:bg-[var(--color-background)]
                        hover:text-[var(--color-primary)]
                      "
                    >
                      ×
                    </button>
                  </div>

                  {/* Frontend Developer */}
                  <div className="rounded-xl bg-[var(--color-background)] p-3 transition-transform duration-300 hover:-translate-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                      Frontend Developer
                    </p>

                    <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                      Md Shahariar Hossen
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                      Next.js • React • TypeScript • Tailwind CSS
                    </p>
                  </div>

                  {/* Backend Developer */}
                  <div className="mt-3 rounded-xl bg-[var(--color-background)] p-3 transition-transform duration-300 hover:-translate-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                      Backend Developer
                    </p>

                    <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                      Sujoy Pal Jitu
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                      Backend • API • Database • Authentication
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </footer>
  );
}