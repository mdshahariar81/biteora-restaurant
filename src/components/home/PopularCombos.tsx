"use client";

import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

/* =========================================================
   Popular Combo Products
   ========================================================= */

const products = [
  {
    id: "chicken-bucket-8pcs",
    name: "8 Pcs Chicken Bucket",
    description: "8 Pcs Chicken + 2 Fries + 2 Drinks",
    price: 24.99,
    rating: "4.8",
    reviews: "12.5K+",
    image: "/images/products/chicken-bucket.png",
    badge: "BESTSELLER",
  },
  {
    id: "zinger-burger-combo",
    name: "Zinger Burger Combo",
    description: "Zinger Fries + Drink",
    price: 9.99,
    rating: "4.7",
    reviews: "8.7K+",
    image: "/images/products/burger-combo.png",
    badge: "POPULAR",
  },
  {
    id: "hot-crispy-5pcs",
    name: "5 Pcs Hot & Crispy",
    description: "5 Pcs Chicken + Fries + Drink",
    price: 15.99,
    rating: "4.6",
    reviews: "6.3K+",
    image: "/images/products/hot-crispy.png",
    badge: "SAVE 15%",
  },
  {
    id: "chicken-wrap-combo",
    name: "Chicken Wrap Combo",
    description: "Wrap + Fries + Drink",
    price: 8.99,
    rating: "4.5",
    reviews: "4.1K+",
    image: "/images/products/wrap-combo.png",
  },
];

export default function PopularCombos() {
  /* =========================================================
     Cart Store
     
     This function comes from Zustand.
     When a user clicks the "+" button,
     the selected product will be added to the cart.
     ========================================================= */

  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10">
      {/* =========================================================
          Section Heading
          ========================================================= */}

      <div className="mb-7 flex items-end justify-between gap-4 animate-[comboHeadingIn_0.7s_ease-out_both]">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Our Favorites
          </p>

          <h2 className="text-[30px] font-black tracking-[-0.03em] text-[var(--color-text)] sm:text-[36px]">
            Popular Combos
          </h2>
        </div>

        {/* View All */}
        <Link
          href="/menu"
          className="hidden rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-[13px] font-bold text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:!text-white hover:shadow-md sm:inline-flex"
        >
          View All
        </Link>
      </div>

      {/* =========================================================
          Product Cards
          ========================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-xl animate-[comboCardIn_0.7s_ease-out_both]"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* =====================================================
                Product Image
                ===================================================== */}

            <div className="relative aspect-square overflow-hidden bg-[#f8f3ee]">
              <img
                src={product.image}
                alt={product.name}
                loading={index < 2 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Product Badge */}
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide !text-white transition-transform duration-300 group-hover:scale-105">
                  {product.badge}
                </span>
              )}

              {/* Favorite */}
              <button
                type="button"
                aria-label={`Add ${product.name} to favorites`}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[var(--color-text)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[var(--color-primary)] hover:shadow-md"
              >
                <Heart size={16} strokeWidth={2} />
              </button>
            </div>

            {/* =====================================================
                Product Information
                ===================================================== */}

            <div className="p-5">
              <h3 className="text-[17px] font-black text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-primary)]">
                {product.name}
              </h3>

              <p className="mt-2 min-h-[42px] text-[13px] leading-5 text-[var(--color-text-secondary)]">
                {product.description}
              </p>

              {/* =================================================
                  Rating
                  ================================================= */}

              <div className="mt-4 flex items-center gap-1.5">
                <Star
                  size={14}
                  fill="currentColor"
                  className="text-[var(--color-star)] transition-transform duration-300 group-hover:scale-110"
                />

                <span className="text-[12px] font-bold text-[var(--color-text)]">
                  {product.rating}
                </span>

                <span className="text-[12px] text-[var(--color-text-muted)]">
                  ({product.reviews})
                </span>
              </div>

              {/* =================================================
                  Price + Add To Cart
                  ================================================= */}

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-[20px] font-black text-[var(--color-primary)]">
                  ${product.price.toFixed(2)}
                </span>

                <button
                  type="button"
                  aria-label={`Add ${product.name} to cart`}
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] !text-white shadow-sm transition-all duration-300 hover:scale-110 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg"
                >
                  <Plus
                    size={18}
                    strokeWidth={2.5}
                    className="text-white transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* =========================================================
          Mobile View All
          ========================================================= */}

      <div className="mt-6 flex justify-center sm:hidden">
        <Link
          href="/menu"
          className="rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-[13px] font-bold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:!text-white hover:shadow-md"
        >
          View All
        </Link>
      </div>
    </section>
  );
}