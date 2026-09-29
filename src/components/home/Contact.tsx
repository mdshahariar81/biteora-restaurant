"use client";

import { FormEvent, useState } from "react";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  /*
   * =========================================================
   * CONTACT FORM SUBMIT
   * =========================================================
   *
   * Frontend validation is only for user experience.
   *
   * BACKEND INTEGRATION POINT:
   *
   * POST /api/contact
   *
   * Backend MUST:
   * - Validate all fields again
   * - Sanitize user input
   * - Rate-limit requests
   * - Prevent spam/bot abuse
   * - Store data securely if required
   * - Never trust frontend validation
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const userMessage = String(formData.get("message") || "").trim();

    // Basic frontend validation
    if (!name || !email || !subject || !userMessage) {
      setMessage("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    /*
     * BACKEND API WILL BE CONNECTED HERE.
     *
     * Example later:
     *
     * const response = await fetch("/api/contact", {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *   },
     *   body: JSON.stringify({
     *     name,
     *     email,
     *     subject,
     *     message: userMessage,
     *   }),
     * });
     *
     * Do NOT put database credentials or secret API keys
     * inside this frontend component.
     */

    // Temporary frontend-only success state
    setMessage("Thanks! Your message has been received.");
    form.reset();

    setIsSubmitting(false);
  }

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16"
    >
      <div className="grid overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white lg:grid-cols-[0.9fr_1.1fr]">
        {/* =====================================================
            LEFT — CONTACT INFORMATION
            ===================================================== */}
        <div className="bg-[var(--color-background-warm)] px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="animate-[aboutTextIn_0.7s_ease-out_both]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Get In Touch
            </p>

            <h2 className="mt-2 max-w-[430px] text-[32px] font-black leading-tight tracking-[-0.035em] sm:text-[40px]">
              We&apos;d Love to
              <br />
              Hear From You
            </h2>

            <p className="mt-4 max-w-[430px] text-[14px] leading-7 text-[var(--color-text-secondary)]">
              Have a question, feedback, or just want to say hello?
              Send us a message and our team will get back to you.
            </p>
          </div>

          {/* =================================================
              CONTACT DETAILS
              ================================================= */}
          <div className="mt-8 space-y-5">
            {/* Phone */}
            <div className="group flex items-start gap-4 animate-[aboutTextIn_0.7s_ease-out_0.1s_both]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <Phone size={18} strokeWidth={2} />
              </div>

              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Call Us
                </p>

                <a
                  href="tel:+1234567890"
                  className="mt-1 block text-[14px] font-bold text-[var(--color-text)] transition-colors duration-200 hover:text-[var(--color-primary)]"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="group flex items-start gap-4 animate-[aboutTextIn_0.7s_ease-out_0.2s_both]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <Mail size={18} strokeWidth={2} />
              </div>

              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Email Us
                </p>

                <a
                  href="mailto:hello@biteora.com"
                  className="mt-1 block text-[14px] font-bold text-[var(--color-text)] transition-colors duration-200 hover:text-[var(--color-primary)]"
                >
                  hello@biteora.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="group flex items-start gap-4 animate-[aboutTextIn_0.7s_ease-out_0.3s_both]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <MapPin size={18} strokeWidth={2} />
              </div>

              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Visit Us
                </p>

                <p className="mt-1 text-[14px] font-bold text-[var(--color-text)]">
                  123 Food Street, Downtown
                </p>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="group flex items-start gap-4 animate-[aboutTextIn_0.7s_ease-out_0.4s_both]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <Clock3 size={18} strokeWidth={2} />
              </div>

              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                  Opening Hours
                </p>

                <p className="mt-1 text-[14px] font-bold text-[var(--color-text)]">
                  Mon – Sun: 10:00 AM – 11:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT — CONTACT FORM
            ===================================================== */}
        <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="animate-[aboutTextIn_0.7s_ease-out_0.15s_both]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Send a Message
            </p>

            <h3 className="mt-2 text-[26px] font-black tracking-[-0.03em] sm:text-[30px]">
              Contact Us
            </h3>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5 animate-[aboutTextIn_0.7s_ease-out_0.25s_both]"
          >
            {/* Name + Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
                >
                  Your Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[13px] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[13px] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="contact-subject"
                className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
              >
                Subject
              </label>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                maxLength={150}
                placeholder="How can we help?"
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[13px] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                required
                maxLength={1000}
                rows={5}
                placeholder="Write your message..."
                className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[13px] leading-6 outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-[13px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-primary-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Sending..." : "Send Message"}

              {!isSubmitting && (
                <Send
                  size={15}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </button>

            {/* Form Status */}
            {message && (
              <p
                role="status"
                aria-live="polite"
                className="text-[13px] font-semibold text-[var(--color-primary)] animate-[footerMessageIn_0.3s_ease-out_both]"
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}