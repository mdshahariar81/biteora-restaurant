"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Sarah Khan",
    role: "Regular Customer",
    image: "/images/testimonials/sarah-khan.png",
    review:
      "Best fried chicken in town! The taste, quality and service are amazing. Highly recommended!",
  },
  {
    name: "Rafiul Islam",
    role: "Happy Customer",
    image: "/images/testimonials/rafiul-islam.png",
    review:
      "Always fresh, always tasty. My go-to place for comfort food.",
  },
  {
    name: "Nusrat Jahan",
    role: "Regular Customer",
    image: "/images/testimonials/nusrat-jahan.png",
    review:
      "Amazing food and quick delivery. Truly love it!",
  },
  {
    name: "Tanvir Ahmed",
    role: "Happy Customer",
    image: "/images/testimonials/tanvir-ahmed.png",
    review:
      "Crispy, juicy and full of flavor. The chicken was absolutely delicious!",
  },
  {
    name: "Fariah Rahman",
    role: "Regular Customer",
    image: "/images/testimonials/fariah-rahman.png",
    review:
      "Great food, friendly service and fast delivery. Definitely ordering again!",
  },
];

export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Scroll to next testimonial
  // ============================================================
  const scrollNext = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.firstElementChild as HTMLElement | null;

    if (!card) return;

    const gap = 16;
    const scrollAmount = card.offsetWidth + gap;

    const isAtEnd =
      slider.scrollLeft + slider.clientWidth >=
      slider.scrollWidth - 10;

    if (isAtEnd) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ============================================================
  // Scroll to previous testimonial
  // ============================================================
  const scrollPrevious = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.firstElementChild as HTMLElement | null;

    if (!card) return;

    const gap = 16;
    const scrollAmount = card.offsetWidth + gap;

    if (slider.scrollLeft <= 10) {
      slider.scrollTo({
        left: slider.scrollWidth - slider.clientWidth,
        behavior: "smooth",
      });
    } else {
      slider.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ============================================================
  // Auto Slider
  // Runs every 3 seconds
  // ============================================================
  useEffect(() => {
    const interval = setInterval(() => {
      scrollNext();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      id="reviews"
      className="bg-[var(--color-background)] px-5 py-16 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* =====================================================
            Section Header
        ===================================================== */}
        <div className="mb-8 flex items-end justify-between animate-[testimonialHeaderIn_0.7s_ease-out_both]">

          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Customer Love
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>

          {/* Slider arrows */}
          <div className="hidden gap-2 sm:flex">

            <button
              type="button"
              aria-label="Previous reviews"
              onClick={scrollPrevious}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-[var(--color-border)]
                bg-white
                text-[var(--color-text)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-[var(--color-primary)]
                hover:text-[var(--color-primary)]
                hover:shadow-sm
                active:scale-95
              "
            >
              <ChevronLeft
                size={18}
                className="transition-transform duration-300 hover:-translate-x-0.5"
              />
            </button>

            <button
              type="button"
              aria-label="Next reviews"
              onClick={scrollNext}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-[var(--color-border)]
                bg-white
                text-[var(--color-text)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-[var(--color-primary)]
                hover:text-[var(--color-primary)]
                hover:shadow-sm
                active:scale-95
              "
            >
              <ChevronRight
                size={18}
                className="transition-transform duration-300 hover:translate-x-0.5"
              />
            </button>

          </div>
        </div>

        {/* =====================================================
            Testimonials Slider
        ===================================================== */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-4
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            pb-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              className="
                group
                w-full
                shrink-0
                snap-start
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-5
                animate-[testimonialCardIn_0.65s_ease-out_both]
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-md
                sm:w-[calc(50%-8px)]
                lg:w-[calc(33.333%-11px)]
              "
            >

              {/* Customer */}
              <div className="flex items-start gap-4">

                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} profile`}
                  className="
                    h-11 w-11 shrink-0 rounded-full object-cover
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                />

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-bold text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-primary)]">
                    {testimonial.name}
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    {testimonial.role}
                  </p>

                </div>
              </div>

              {/* Review */}
              <p className="mt-5 text-[13px] leading-6 text-[var(--color-text-muted)]">
                “{testimonial.review}”
              </p>

              {/* Stars */}
              <div className="mt-4 flex items-center gap-1">

                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    fill="currentColor"
                    className="
                      text-[#f59e0b]
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  />
                ))}

              </div>

            </article>
          ))}

        </div>
      </div>
    </section>
  );
}