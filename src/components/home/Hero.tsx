import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[var(--color-background-warm)]">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative grid min-h-[560px] grid-cols-1 items-center lg:grid-cols-2">
          {/* =====================================================
              Hero Content
              ===================================================== */}
          <div className="relative z-20 px-6 pb-10 pt-14 sm:px-10 lg:px-14 lg:py-20">
            {/* Limited Time Offer Badge */}
            <div className="mb-5 inline-flex animate-[heroFadeUp_0.6s_ease-out_both] rounded-full border border-[var(--color-primary)] px-3 py-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
                Limited Time Offer
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="max-w-[560px] animate-[heroFadeUp_0.75s_ease-out_0.1s_both] text-[48px] font-black leading-[0.98] tracking-[-0.04em] text-[var(--color-text)] sm:text-[60px] lg:text-[64px]">
              Crunchy{" "}
              <span className="text-[var(--color-primary)]">
                Happiness
              </span>
              <br />
              in Every Bite
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-[430px] animate-[heroFadeUp_0.75s_ease-out_0.2s_both] text-[16px] leading-7 text-[var(--color-text-secondary)]">
              100% Real Chicken. Freshly Prepared.
              <br className="hidden sm:block" />
              Irresistible Taste.
            </p>

            {/* =================================================
                Hero CTA Buttons
                ================================================= */}
            <div className="mt-8 flex animate-[heroFadeUp_0.75s_ease-out_0.3s_both] flex-wrap items-center gap-3">
              {/* Order Now */}
              <Link
                href="/menu"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-[14px] font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg"
              >
                <span>Order Now</span>

                <ArrowRight
                  size={17}
                  strokeWidth={2.5}
                  className="text-white transition-transform duration-300"
                />
              </Link>

              {/* View Menu */}
              <Link
                href="/menu"
                className="rounded-full border border-[var(--color-primary)] bg-white px-6 py-3.5 text-[14px] font-bold text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary)] hover:!text-white hover:shadow-md"
              >
                View Menu
              </Link>
            </div>
          </div>

          {/* =====================================================
              Hero Image
              ===================================================== */}
          <div className="relative min-h-[380px] animate-[heroImageIn_1s_ease-out_0.15s_both] sm:min-h-[460px] lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%]">
            {/* Soft Background Glow */}
            <div className="hero-glow absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#f5d8c4] opacity-40 blur-3xl" />

            {/* Main Hero Image */}
            <Image
              src="/images/hero/hero.png"
              alt="Biteora crispy fried chicken meal"
              fill
              priority
              className="relative z-10 object-cover object-center transition-transform duration-700 hover:scale-[1.015] lg:object-contain"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />

            {/* Hero Slider Controls */}
            <div className="absolute bottom-8 right-6 z-20 hidden items-center gap-2 animate-[heroFadeIn_0.8s_ease-out_0.5s_both] sm:flex lg:bottom-14 lg:right-8">
              <button
                type="button"
                aria-label="Previous hero slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/90 text-[var(--color-text)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)] hover:shadow-md"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                aria-label="Next hero slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/90 text-[var(--color-text)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)] hover:shadow-md"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}