"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { useCartStore } from "@/store/cartStore";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Offers", href: "/#offers" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================================================
     CART STORE
     =========================================================
     Zustand থেকে current cart items নিচ্ছি।
     ========================================================= */

  const cartItems = useCartStore((state) => state.items);

  /* =========================================================
     CART COUNT
     =========================================================
     প্রতিটি product-এর quantity যোগ করে মোট cart quantity
     বের করছি।

     Example:
     Chicken Strips × 5
     Chicken Wrap × 6
     Total = 11
     ========================================================= */

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 animate-[navbarFadeIn_0.5s_ease-out_both] border-b border-[var(--color-border)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* =====================================================
            Brand
            ===================================================== */}

        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5"
          aria-label="Biteora Home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-[17px] font-black !text-white transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            B
          </span>

          <span className="text-[20px] font-black tracking-[-0.04em] text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-primary)]">
            Biteora
          </span>
        </Link>

        {/* =====================================================
            Desktop Navigation
            ===================================================== */}

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative py-2 text-[13px] font-bold transition-colors duration-300 ${
                index === 0
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text)] hover:text-[var(--color-primary)]"
              }`}
            >
              {item.label}

              {/* Animated Underline */}

              <span
                className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[var(--color-primary)] transition-all duration-300 ${
                  index === 0
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* =====================================================
            Desktop Actions
            ===================================================== */}

        <div className="hidden items-center gap-2 sm:flex">
          {/* Search */}

          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]"
          >
            <Search size={18} strokeWidth={2} />
          </button>

          {/* Shopping Cart */}

          <Link
            href="/cart"
            aria-label={`Shopping cart${
              cartCount > 0 ? ` with ${cartCount} items` : ""
            }`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]"
          >
            <ShoppingBag size={18} strokeWidth={2} />

            {cartCount > 0 && (
              <span
                key={cartCount}
                className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-black !text-white animate-[cartBadgePop_250ms_ease-out_both]"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Order Now */}

          <Link
            href="/menu"
            className="ml-2 inline-flex items-center rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-[13px] font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg"
          >
            Order Now
          </Link>
        </div>

        {/* =====================================================
            Mobile Actions
            ===================================================== */}

        <div className="flex items-center gap-1 sm:hidden">
          {/* Mobile Cart */}

          <Link
            href="/cart"
            aria-label={`Shopping cart${
              cartCount > 0 ? ` with ${cartCount} items` : ""
            }`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)]"
          >
            <ShoppingBag size={19} strokeWidth={2} />

            {cartCount > 0 && (
              <span
                key={`mobile-${cartCount}`}
                className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-black !text-white animate-[cartBadgePop_250ms_ease-out_both]"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}

          <button
            type="button"
            aria-label={
              mobileMenuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen((open) => !open)
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] transition-all duration-300 hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] animate-[menuIconIn_0.2s_ease-out_both]"
          >
            {mobileMenuOpen ? (
              <X size={21} strokeWidth={2} />
            ) : (
              <Menu size={21} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* =======================================================
          Mobile Navigation
          ======================================================= */}

      {mobileMenuOpen && (
        <div className="border-t border-[var(--color-border)] bg-white animate-[mobileMenuIn_0.3s_ease-out_both]">
          <nav
            className="mx-auto flex max-w-[1400px] flex-col px-5 py-4 sm:px-8"
            aria-label="Mobile navigation"
          >
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
                className={`border-b border-[var(--color-border)] py-3.5 text-[14px] font-bold last:border-b-0 animate-[mobileLinkIn_0.35s_ease-out_both] ${
                  index === 0
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text)]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Order Now */}

            <Link
              href="/menu"
              onClick={closeMobileMenu}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 text-[13px] font-bold !text-white transition-all duration-300 hover:bg-[var(--color-primary-hover)] hover:!text-white"
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}