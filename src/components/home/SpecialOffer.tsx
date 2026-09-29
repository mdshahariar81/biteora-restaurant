import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SpecialOffer() {
  return (
    <section
      id="offers"
      className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10"
    >
      <div className="relative min-h-[190px] overflow-hidden rounded-3xl bg-[#fff0e3] px-6 py-8 sm:px-10 lg:px-12">
        {/* =========================================================
            Offer Content
            ========================================================= */}
        <div className="relative z-10 max-w-[430px]">
          {/* Small Label */}
          <p className="animate-[offerTextIn_0.6s_ease-out_both] text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Special Offer
          </p>

          {/* Main Offer Heading */}
          <h2 className="mt-2 animate-[offerTextIn_0.7s_ease-out_0.1s_both] text-[34px] font-black leading-none tracking-[-0.04em] text-[var(--color-text)] sm:text-[42px]">
            Up to 30% OFF
          </h2>

          {/* Offer Description */}
          <p className="mt-3 animate-[offerTextIn_0.7s_ease-out_0.2s_both] text-[14px] text-[var(--color-text-secondary)]">
            On Selected Combos
          </p>

          {/* Order Button */}
          <Link
            href="/menu"
            className="group mt-5 inline-flex animate-[offerTextIn_0.7s_ease-out_0.3s_both] items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-[13px] font-bold !text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg"
          >
            <span>Order Now</span>

            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="text-white transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* =========================================================
            Offer Product Image
            ========================================================= */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] sm:block lg:right-2 lg:w-[46%]">
          <img
            src="/images/products/burger-combo.png"
            alt="Biteora burger combo special offer"
            loading="lazy"
            className="h-full w-full animate-[offerImageIn_0.9s_ease-out_0.15s_both] object-contain object-right-bottom transition-transform duration-700"
          />
        </div>

        {/* =========================================================
            Discount Badge
            ========================================================= */}
        <div className="absolute right-5 top-5 z-20 animate-[offerBadgeIn_0.7s_ease-out_0.4s_both] rounded-full bg-[var(--color-primary)] px-4 py-2 text-[11px] font-black uppercase tracking-wide !text-white shadow-md sm:right-8 sm:top-7">
          30% OFF
        </div>
      </div>
    </section>
  );
}