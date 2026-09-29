import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16"
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">

        {/* =========================
            Brand Story
        ========================== */}
        <div className="animate-[aboutContentIn_0.7s_ease-out_both]">

          <p
            className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] animate-[aboutTextIn_0.6s_ease-out_both]"
            style={{ animationDelay: "0.05s" }}
          >
            Our Story
          </p>

          <h2
            className="mt-2 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl animate-[aboutTextIn_0.7s_ease-out_both]"
            style={{ animationDelay: "0.12s" }}
          >
            A Brand Built on
            <br />
            Great Taste
          </h2>

          <p
            className="mt-5 max-w-xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base animate-[aboutTextIn_0.7s_ease-out_both]"
            style={{ animationDelay: "0.2s" }}
          >
            At Biteora, we serve more than just chicken — we serve
            happiness. Our mission is to bring people together with
            delicious food, made from fresh ingredients and cooked
            with care.
          </p>

          <button
            type="button"
            className="
              mt-6 inline-flex items-center gap-2
              rounded-full
              bg-[var(--color-primary)]
              px-5 py-3
              text-sm font-bold text-white
              transition-all duration-300
              hover:-translate-y-0.5
              hover:bg-[var(--color-primary-hover)]
              hover:shadow-lg
              active:scale-[0.98]
              animate-[aboutTextIn_0.7s_ease-out_both]
            "
            style={{ animationDelay: "0.28s" }}
          >
            Our Story

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* =========================
            Restaurant Image
        ========================== */}
        <div
          className="
            group relative overflow-hidden
            rounded-3xl
            animate-[aboutImageIn_0.9s_ease-out_both]
          "
          style={{ animationDelay: "0.15s" }}
        >
          <img
            src="/images/restaurant/restaurant-interior.png"
            alt="Biteora restaurant interior"
            className="
              h-[320px] w-full
              object-cover
              transition-transform duration-700
              group-hover:scale-[1.03]
              sm:h-[380px]
              lg:h-[400px]
            "
          />

          {/* Brand message */}
          <div
            className="
              absolute bottom-0 right-0
              max-w-[180px]
              rounded-tl-3xl
              bg-[var(--color-primary)]
              px-5 py-6
              text-white
              transition-transform duration-500
              group-hover:-translate-y-1
              sm:max-w-[210px]
            "
          >
            <p className="text-xl font-black uppercase leading-[1.05] sm:text-2xl">
              Good Food
              <br />
              Better
              <br />
              Mood
            </p>

            <span className="mt-3 block text-xl transition-transform duration-300 group-hover:scale-110">
              ♥
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}