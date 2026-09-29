"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCartStore } from "@/store/cartStore";

/* =========================================================
   ORDER SETTINGS
   =========================================================
   Takeaway / Parcel order-এর জন্য fixed packaging charge।

   IMPORTANT:
   এটা এখন frontend display-এর জন্য।
   Final order করার সময় backend অবশ্যই নিজে fee calculate
   এবং validate করবে।
   ========================================================= */

const PACKAGING_FEE = 1.0;

type OrderType = "dine-in" | "takeaway";

export default function CartPage() {
  /* =========================================================
     CART STORE
     ========================================================= */

  const items = useCartStore((state) => state.items);

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity,
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity,
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart,
  );

  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  /* =========================================================
     ORDER TYPE
     =========================================================
     Customer:
     - Dine In
     - Takeaway / Parcel

     Default হিসেবে Dine In রাখা হয়েছে।
     ========================================================= */

  const [orderType, setOrderType] =
    useState<OrderType>("dine-in");

  /* =========================================================
     TABLE NUMBER
     =========================================================
     Dine In হলে customer-এর table number লাগবে।
     ========================================================= */

  const [tableNumber, setTableNumber] = useState("");

  /* =========================================================
     UI FEEDBACK STATE
     ========================================================= */

  const [removedItemId, setRemovedItemId] = useState<
    string | null
  >(null);

  const [showClearConfirm, setShowClearConfirm] =
    useState(false);

  /* =========================================================
     SUBTOTAL
     ========================================================= */

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  /* =========================================================
     PACKAGING FEE
     =========================================================
     Dine In:
       $0.00

     Takeaway:
       $1.00
     ========================================================= */

  const packagingFee =
    orderType === "takeaway" ? PACKAGING_FEE : 0;

  /* =========================================================
     FINAL TOTAL
     ========================================================= */

  const total = subtotal + packagingFee;

  /* =========================================================
     REMOVE ITEM
     ========================================================= */

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);

    setRemovedItemId(id);

    window.setTimeout(() => {
      setRemovedItemId((current) =>
        current === id ? null : current,
      );
    }, 1000);
  };

  /* =========================================================
     CLEAR CART
     ========================================================= */

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  /* =========================================================
     ORDER TYPE CHANGE
     ========================================================= */

  const handleOrderTypeChange = (
    type: OrderType,
  ) => {
    setOrderType(type);

    /* Table number শুধু Dine In-এর জন্য প্রয়োজন */
    if (type === "takeaway") {
      setTableNumber("");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* =====================================================
          Header
          ===================================================== */}

      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
          <Link
            href="/menu"
            className="mb-4 inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={16} />
            Back to Menu
          </Link>

          <h1 className="text-[36px] font-black tracking-[-0.04em] text-[var(--color-text)] sm:text-[44px]">
            Your Cart
          </h1>

          <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">
            Review your selected items before checkout.
          </p>
        </div>
      </section>

      {/* =====================================================
          Cart Content
          ===================================================== */}

      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10">
        {items.length === 0 ? (
          /* =================================================
             EMPTY CART
             ================================================= */

          <div className="mx-auto flex max-w-[560px] flex-col items-center rounded-3xl border border-[var(--color-border)] bg-white px-6 py-14 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f3ee] text-[var(--color-primary)]">
              <ShoppingBag
                size={28}
                strokeWidth={1.8}
              />
            </div>

            <h2 className="mt-5 text-[24px] font-black text-[var(--color-text)]">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-[380px] text-[14px] leading-6 text-[var(--color-text-secondary)]">
              Looks like you have not added anything to
              your cart yet. Explore our menu and find
              something delicious.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-[13px] font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          /* =================================================
             CART WITH ITEMS
             ================================================= */

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* =================================================
                LEFT SIDE
                ================================================= */}

            <div className="space-y-4">
              {/* =================================================
                  ORDER TYPE
                  ================================================= */}

              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
                <div>
                  <h2 className="text-[18px] font-black text-[var(--color-text)]">
                    How would you like your order?
                  </h2>

                  <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                    Choose dine-in or takeaway before
                    continuing.
                  </p>
                </div>

                {/* Order Type Options */}

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* =================================================
                      DINE IN
                      ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      handleOrderTypeChange("dine-in")
                    }
                    className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                      orderType === "dine-in"
                        ? "border-[var(--color-primary)] bg-[#fff8f5] shadow-sm"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          orderType === "dine-in"
                            ? "border-[var(--color-primary)]"
                            : "border-[#cfc8bf]"
                        }`}
                      >
                        {orderType === "dine-in" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </div>

                      <div>
                        <p className="text-[14px] font-black text-[var(--color-text)]">
                          Dine In
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-[var(--color-text-secondary)]">
                          Enjoy your meal at the restaurant.
                        </p>

                        <p className="mt-2 text-[12px] font-bold text-[var(--color-primary)]">
                          No packaging fee
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* =================================================
                      TAKEAWAY
                      ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      handleOrderTypeChange("takeaway")
                    }
                    className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                      orderType === "takeaway"
                        ? "border-[var(--color-primary)] bg-[#fff8f5] shadow-sm"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          orderType === "takeaway"
                            ? "border-[var(--color-primary)]"
                            : "border-[#cfc8bf]"
                        }`}
                      >
                        {orderType === "takeaway" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </div>

                      <div>
                        <p className="text-[14px] font-black text-[var(--color-text)]">
                          Takeaway / Parcel
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-[var(--color-text-secondary)]">
                          Take your food with you.
                        </p>

                        <p className="mt-2 text-[12px] font-bold text-[var(--color-primary)]">
                          +$1.00 packaging fee
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* =================================================
                    TABLE NUMBER
                    ================================================= */}

                {orderType === "dine-in" && (
                  <div className="mt-5">
                    <label
                      htmlFor="table-number"
                      className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
                    >
                      Table Number
                    </label>

                    <input
                      id="table-number"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={tableNumber}
                      onChange={(event) =>
                        setTableNumber(
                          event.target.value.replace(
                            /\D/g,
                            "",
                          ),
                        )
                      }
                      placeholder="Enter your table number"
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[13px] text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    />

                    <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                      Please enter the table number where
                      you are sitting.
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  CART HEADER / CLEAR CART
                  ================================================= */}

              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-[var(--color-text-secondary)]">
                  {items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0,
                  )}{" "}
                  item(s)
                </p>

                {showClearConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[var(--color-text-secondary)]">
                      Clear all items?
                    </span>

                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-bold !text-white transition-all duration-300 hover:bg-[var(--color-primary-hover)]"
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowClearConfirm(false)
                      }
                      className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--color-text-secondary)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setShowClearConfirm(true)
                    }
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-primary)]"
                  >
                    <Trash2 size={14} />
                    Clear Cart
                  </button>
                )}
              </div>

              {/* =================================================
                  CART PRODUCTS
                  ================================================= */}

              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-4 sm:p-5"
                >
                  {/* Product Image */}

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f8f3ee] sm:h-28 sm:w-28">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Information */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-[15px] font-black text-[var(--color-text)] sm:text-[17px]">
                          {item.name}
                        </h2>

                        <p className="mt-1 text-[13px] font-bold text-[var(--color-primary)]">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Product */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(item.id)
                        }
                        aria-label={`Remove ${item.name} from cart`}
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          removedItemId === item.id
                            ? "bg-green-50 text-green-600"
                            : "text-[var(--color-text-muted)] hover:bg-[#fff0e3] hover:text-[var(--color-primary)]"
                        }`}
                      >
                        {removedItemId === item.id ? (
                          <Check
                            size={16}
                            strokeWidth={3}
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>

                    {/* Quantity + Item Total */}

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)] transition-colors duration-300 hover:text-[var(--color-primary)]"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-8 text-center text-[13px] font-bold text-[var(--color-text)]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)] transition-colors duration-300 hover:text-[var(--color-primary)]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="text-[15px] font-black text-[var(--color-text)]">
                        $
                        {(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* =================================================
                ORDER SUMMARY
                ================================================= */}

            <aside className="h-fit rounded-3xl border border-[var(--color-border)] bg-white p-6 lg:sticky lg:top-24">
              <h2 className="text-[20px] font-black text-[var(--color-text)]">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                {/* Subtotal */}

                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[var(--color-text-secondary)]">
                    Subtotal
                  </span>

                  <span className="font-bold text-[var(--color-text)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Packaging */}

                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[var(--color-text-secondary)]">
                    Packaging
                  </span>

                  <span className="font-bold text-[var(--color-text)]">
                    {packagingFee === 0
                      ? "$0.00"
                      : `+$${packagingFee.toFixed(2)}`}
                  </span>
                </div>

                {/* Order Type */}

                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[var(--color-text-secondary)]">
                    Order Type
                  </span>

                  <span className="font-bold text-[var(--color-text)]">
                    {orderType === "dine-in"
                      ? "Dine In"
                      : "Takeaway"}
                  </span>
                </div>

                {/* Table Number */}

                {orderType === "dine-in" &&
                  tableNumber && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-[var(--color-text-secondary)]">
                        Table
                      </span>

                      <span className="font-bold text-[var(--color-text)]">
                        {tableNumber}
                      </span>
                    </div>
                  )}

                {/* Total */}

                <div className="border-t border-[var(--color-border)] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] font-black text-[var(--color-text)]">
                      Total
                    </span>

                    <span className="text-[22px] font-black text-[var(--color-primary)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  CHECKOUT
                  ================================================= */}

              <button
                type="button"
                disabled
                className="mt-6 flex w-full cursor-not-allowed items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-[13px] font-bold !text-white opacity-60"
              >
                Checkout Coming Soon
              </button>

              {/* Continue Shopping */}

              <Link
                href="/menu"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3.5 text-[13px] font-bold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                Continue Shopping
              </Link>

              {/* =================================================
                  BACKEND SECURITY NOTE

                  Checkout is intentionally not connected yet.

                  Later backend must:

                  - Validate product IDs
                  - Validate quantities
                  - Recalculate product prices
                  - Check product availability
                  - Validate order type
                  - Validate table number for dine-in
                  - Apply the $1 packaging fee only for takeaway
                  - Calculate final total server-side
                  - Never trust frontend/localStorage prices
                  ================================================= */}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}