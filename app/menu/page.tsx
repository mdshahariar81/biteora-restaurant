"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Plus,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react";

import { useCartStore } from "@/store/cartStore";

/* =========================================================
   MENU PRODUCTS
   =========================================================
   All images are located in:

   public/images/products/

   So we access them with:

   /images/products/filename.png
   ========================================================= */

const products = [
  /* =========================================================
     COMBOS
     ========================================================= */

  {
    id: "burger-combo",
    name: "Zinger Burger Combo",
    description: "Zinger Burger + Fries + Drink",
    price: 9.99,
    rating: "4.7",
    reviews: "8.7K+",
    image: "/images/products/burger-combo.png",
    category: "Combos",
    badge: "POPULAR",
  },

  {
    id: "wrap-combo",
    name: "Chicken Wrap Combo",
    description: "Chicken Wrap + Fries + Drink",
    price: 8.99,
    rating: "4.5",
    reviews: "4.1K+",
    image: "/images/products/wrap-combo.png",
    category: "Combos",
  },

  /* =========================================================
     BUCKETS
     ========================================================= */

  {
    id: "chicken-bucket",
    name: "8 Pcs Chicken Bucket",
    description: "8 Pcs Chicken + Fries + Drinks",
    price: 24.99,
    rating: "4.8",
    reviews: "12.5K+",
    image: "/images/products/chicken-bucket.png",
    category: "Buckets",
    badge: "BESTSELLER",
  },

  /* =========================================================
     BURGERS
     ========================================================= */

  {
    id: "classic-chicken-burger",
    name: "Classic Chicken Burger",
    description: "Crispy Chicken + Lettuce + Special Sauce",
    price: 7.99,
    rating: "4.6",
    reviews: "5.8K+",
    image: "/images/products/classic-chicken-burger.png",
    category: "Burgers",
  },

  {
    id: "spicy-chicken-burger",
    name: "Spicy Chicken Burger",
    description: "Spicy Chicken + Fresh Lettuce + Hot Sauce",
    price: 8.49,
    rating: "4.7",
    reviews: "6.2K+",
    image: "/images/products/spicy-chicken-burger.png",
    category: "Burgers",
    badge: "SPICY",
  },

  {
    id: "grilled-chicken-burger",
    name: "Grilled Chicken Burger",
    description: "Grilled Chicken + Fresh Vegetables + Sauce",
    price: 8.99,
    rating: "4.6",
    reviews: "4.7K+",
    image: "/images/products/grilled-chicken-burger.png",
    category: "Burgers",
  },

  {
    id: "fish-burger",
    name: "Fish Burger",
    description: "Crispy Fish Fillet + Lettuce + Tartar Sauce",
    price: 8.99,
    rating: "4.5",
    reviews: "3.9K+",
    image: "/images/products/fish-burger.png",
    category: "Burgers",
  },

  {
    id: "chicken-sandwich",
    name: "Chicken Sandwich",
    description: "Crispy Chicken + Fresh Lettuce + Sauce",
    price: 7.49,
    rating: "4.5",
    reviews: "4.1K+",
    image: "/images/products/chicken-sandwich.png",
    category: "Burgers",
  },

  /* =========================================================
     CHICKEN
     ========================================================= */

  {
    id: "chicken-nuggets",
    name: "Chicken Nuggets",
    description: "Crispy Chicken Nuggets + Dipping Sauce",
    price: 8.99,
    rating: "4.6",
    reviews: "4.8K+",
    image: "/images/products/chicken-nuggets.png",
    category: "Chicken",
  },

  {
    id: "chicken-strips",
    name: "Chicken Strips",
    description: "Crispy Chicken Strips + Dipping Sauce",
    price: 10.99,
    rating: "4.7",
    reviews: "5.4K+",
    image: "/images/products/chicken-strips.png",
    category: "Chicken",
  },

  {
    id: "chicken-wings",
    name: "Chicken Wings",
    description: "Crispy Chicken Wings + Special Sauce",
    price: 11.99,
    rating: "4.8",
    reviews: "7.1K+",
    image: "/images/products/chicken-wings.png",
    category: "Chicken",
    badge: "POPULAR",
  },

  {
    id: "hot-crispy",
    name: "5 Pcs Hot & Crispy",
    description: "5 Pcs Hot & Crispy Chicken",
    price: 15.99,
    rating: "4.6",
    reviews: "6.3K+",
    image: "/images/products/hot-crispy.png",
    category: "Chicken",
    badge: "SAVE 15%",
  },

  /* =========================================================
     SIDES
     ========================================================= */

  {
    id: "french-fries",
    name: "French Fries",
    description: "Golden Crispy French Fries",
    price: 3.99,
    rating: "4.5",
    reviews: "8.2K+",
    image: "/images/products/french-fries.png",
    category: "Sides",
  },

  {
    id: "onion-rings",
    name: "Onion Rings",
    description: "Crispy Golden Onion Rings",
    price: 4.49,
    rating: "4.5",
    reviews: "3.7K+",
    image: "/images/products/onion-rings.png",
    category: "Sides",
  },

  /* =========================================================
     DRINKS
     ========================================================= */

  {
    id: "cola",
    name: "Cola",
    description: "Refreshing Chilled Cola",
    price: 2.49,
    rating: "4.4",
    reviews: "6.5K+",
    image: "/images/products/cola.png",
    category: "Drinks",
  },

  {
    id: "lemonade",
    name: "Fresh Lemonade",
    description: "Fresh and Refreshing Lemonade",
    price: 2.99,
    rating: "4.6",
    reviews: "4.3K+",
    image: "/images/products/lemonade.png",
    category: "Drinks",
  },

  {
    id: "orange-juice",
    name: "Orange Juice",
    description: "Fresh Orange Juice",
    price: 3.49,
    rating: "4.5",
    reviews: "3.8K+",
    image: "/images/products/orange-juice.png",
    category: "Drinks",
  },

  /* =========================================================
     DESSERTS
     ========================================================= */

  {
    id: "chocolate-brownie",
    name: "Chocolate Brownie",
    description: "Rich Chocolate Brownie",
    price: 4.99,
    rating: "4.8",
    reviews: "4.6K+",
    image: "/images/products/chocolate-brownie.png",
    category: "Desserts",
  },

  {
    id: "chocolate-sundae",
    name: "Chocolate Sundae",
    description: "Creamy Ice Cream + Chocolate Sauce",
    price: 4.49,
    rating: "4.7",
    reviews: "5.1K+",
    image: "/images/products/chocolate-sundae.png",
    category: "Desserts",
  },

  {
    id: "strawberry-sundae",
    name: "Strawberry Sundae",
    description: "Creamy Ice Cream + Strawberry Sauce",
    price: 4.49,
    rating: "4.6",
    reviews: "4.2K+",
    image: "/images/products/strawberry-sundae.png",
    category: "Desserts",
  },

  {
    id: "ice-cream-cone",
    name: "Ice Cream Cone",
    description: "Creamy Soft Serve Ice Cream",
    price: 3.49,
    rating: "4.5",
    reviews: "3.5K+",
    image: "/images/products/ice-cream-cone.png",
    category: "Desserts",
  },
];

/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = [
  "All",
  "Combos",
  "Buckets",
  "Burgers",
  "Chicken",
  "Sides",
  "Drinks",
  "Desserts",
];

/* =========================================================
   MENU PAGE
   ========================================================= */

export default function MenuPage() {
  /* =========================================================
     CART STORE
     ========================================================= */

  const addToCart = useCartStore(
    (state) => state.addToCart,
  );

  const cartItems = useCartStore(
    (state) => state.items,
  );

  /* =========================================================
     LOCAL STATE
     ========================================================= */

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  /* =========================================================
     CART ANIMATION
     =========================================================
     যখন নতুন item cart-এ add হবে, floating cart button-এ
     ছোট একটি pop animation দেখাব।
     ========================================================= */

  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const [addedProductId, setAddedProductId] =
    useState<string | null>(null);

  /* =========================================================
     CART COUNT
     ========================================================= */

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  /* =========================================================
     ADD TO CART
     =========================================================
     Product add হওয়ার সাথে সাথে:
     1. Cart store update হবে
     2. Product button-এ temporary check দেখাবে
     3. Floating cart button animate করবে
     ========================================================= */

  const handleAddToCart = (product: (typeof products)[number]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setAddedProductId(product.id);
    setIsCartAnimating(true);

    window.setTimeout(() => {
      setAddedProductId((current) =>
        current === product.id ? null : current,
      );
    }, 1000);

    window.setTimeout(() => {
      setIsCartAnimating(false);
    }, 500);
  };

  /* =========================================================
     FILTER PRODUCTS
     ========================================================= */

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.description
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Biteora Menu
              </p>

              <h1 className="text-[40px] font-black tracking-[-0.04em] text-[var(--color-text)] sm:text-[52px]">
                Find Your Favorite{" "}
                <span className="text-[var(--color-primary)]">
                  Bite
                </span>
              </h1>

              <p className="mt-3 max-w-[550px] text-[14px] leading-6 text-[var(--color-text-secondary)]">
                Freshly prepared chicken, burgers,
                combos, sides, drinks and desserts.
                Choose your favorite and add it to your
                cart.
              </p>
            </div>

            {/* Cart */}

            {/* =================================================
                FLOATING CART BUTTON
                =================================================
                Cart button এখন fixed থাকবে, তাই customer scroll
                করলেও সবসময় cart access করতে পারবে।

                এটি mobile এবং desktop দুই জায়গাতেই visible থাকবে।
                ================================================= */}

            <Link
              href="/cart"
              aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className={`fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-[13px] font-bold !text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-xl ${
                isCartAnimating
                  ? "scale-110"
                  : "scale-100"
              }`}
            >
              <ShoppingBag
                size={17}
                className={`transition-transform duration-300 ${
                  isCartAnimating ? "rotate-12" : "rotate-0"
                }`}
              />

              <span>Cart</span>

              {cartCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-[var(--color-primary)] transition-transform duration-300 ${
                    isCartAnimating
                      ? "scale-125"
                      : "scale-100"
                  }`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH + CATEGORY FILTER
          ===================================================== */}

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
        {/* Search */}

        <div className="relative max-w-[600px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            maxLength={100}
            placeholder="Search your favorite food..."
            aria-label="Search menu"
            className="w-full rounded-full border border-[var(--color-border)] bg-white py-3.5 pl-11 pr-5 text-[14px] text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
        </div>

        {/* Categories */}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`shrink-0 rounded-full border px-5 py-2.5 text-[12px] font-bold transition-all duration-300 ${
                  isActive
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] !text-white shadow-sm"
                    : "border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          PRODUCT GRID
          ===================================================== */}

      <section className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-6">
          <h2 className="text-[24px] font-black tracking-[-0.03em] text-[var(--color-text)] sm:text-[28px]">
            {selectedCategory === "All"
              ? "All Menu Items"
              : selectedCategory}
          </h2>

          <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "item"
              : "items"}{" "}
            available
          </p>
        </div>

        {/* ===================================================
            NO RESULTS
            =================================================== */}

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-white px-6 py-16 text-center">
            <h3 className="text-[22px] font-black text-[var(--color-text)]">
              No food found
            </h3>

            <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">
              Try another search or choose a different
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-full bg-[var(--color-primary)] px-6 py-3 text-[13px] font-bold !text-white transition-all duration-300 hover:bg-[var(--color-primary-hover)] hover:!text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* =================================================
             PRODUCT CARDS
             ================================================= */

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Product Image */}

                <div className="relative aspect-square overflow-hidden bg-[#f8f3ee]">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badge */}

                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide !text-white">
                      {product.badge}
                    </span>
                  )}

                  {/* Favorite */}

                  <button
                    type="button"
                    aria-label={`Add ${product.name} to favorites`}
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[var(--color-text)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[var(--color-primary)] hover:shadow-md"
                  >
                    <Heart
                      size={16}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Product Information */}

                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    {product.category}
                  </p>

                  <h3 className="mt-1 text-[17px] font-black text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-primary)]">
                    {product.name}
                  </h3>

                  <p className="mt-2 min-h-[42px] text-[13px] leading-5 text-[var(--color-text-secondary)]">
                    {product.description}
                  </p>

                  {/* Rating */}

                  <div className="mt-4 flex items-center gap-1.5">
                    <Star
                      size={14}
                      fill="currentColor"
                      className="text-[var(--color-star)]"
                    />

                    <span className="text-[12px] font-bold text-[var(--color-text)]">
                      {product.rating}
                    </span>

                    <span className="text-[12px] text-[var(--color-text-muted)]">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price + Add To Cart */}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-[20px] font-black text-[var(--color-primary)]">
                      ${product.price.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => handleAddToCart(product)}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] !text-white shadow-sm transition-all duration-300 hover:scale-110 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg ${
                        addedProductId === product.id
                          ? "scale-110"
                          : "scale-100"
                      }`}
                    >
                      {addedProductId === product.id ? (
                        <span
                          className="text-[17px] font-black text-white"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      ) : (
                        <Plus
                          size={18}
                          strokeWidth={2.5}
                          className="text-white transition-transform duration-300 group-hover:rotate-90"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}