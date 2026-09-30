"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Loader2,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCartStore } from "@/store/cartStore";

/* =========================================================
   CONSTANTS
   ========================================================= */

const PACKAGING_FEE = 1.0;

/* =========================================================
   COUPON CONFIGURATION
   =========================================================
   These are temporary frontend/demo coupons.

   IMPORTANT:
   In production, coupon validation must be performed
   by the backend.

   Backend should verify:
   - Coupon exists
   - Coupon is active
   - Expiry date
   - Usage limit
   - Minimum order amount
   - Customer eligibility
   - Discount amount
   ========================================================= */

const COUPONS = {
  WELCOME10: {
    type: "percentage" as const,
    value: 10,
    label: "10% off",
  },

  SAVE5: {
    type: "fixed" as const,
    value: 5,
    label: "$5.00 off",
  },

  BITE20: {
    type: "percentage" as const,
    value: 20,
    label: "20% off",
  },
};

type CouponCode = keyof typeof COUPONS;

/* =========================================================
   CHECKOUT VALIDATION
   ========================================================= */

const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(80, "Name must be 80 characters or less."),

    phone: z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number.")
      .max(20, "Phone number is too long.")
      .regex(
        /^[0-9+\-\s()]+$/,
        "Please enter a valid phone number.",
      ),

    email: z
      .string()
      .trim()
      .max(120, "Email is too long.")
      .refine(
        (value) =>
          value === "" ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Please enter a valid email address.",
      ),

    orderType: z.enum(["dine-in", "takeaway"]),

    tableNumber: z
      .string()
      .trim()
      .max(10, "Table number is too long.")
      .regex(
        /^\d*$/,
        "Table number must contain numbers only.",
      ),

    paymentMethod: z.enum(["cash", "online"]),

    notes: z
      .string()
      .trim()
      .max(
        300,
        "Special instructions must be 300 characters or less.",
      ),
  })
  .superRefine((data, context) => {
    if (
      data.orderType === "dine-in" &&
      data.tableNumber.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tableNumber"],
        message: "Please enter your table number.",
      });
    }
  });

type CheckoutFormData = z.infer<typeof checkoutSchema>;

/* =========================================================
   CHECKOUT PAGE
   ========================================================= */

export default function CheckoutPage() {
  /* =======================================================
     CART STORE
     ======================================================= */

  const items = useCartStore((state) => state.items);

  /* =======================================================
     LOCAL STATE
     ======================================================= */

  const [submitError, setSubmitError] = useState("");

  const [isSubmittingOrder, setIsSubmittingOrder] =
    useState(false);

  /* =======================================================
     COUPON STATE
     ======================================================= */

  const [couponInput, setCouponInput] = useState("");

  const [appliedCoupon, setAppliedCoupon] =
    useState<CouponCode | null>(null);

  const [couponError, setCouponError] = useState("");

  const [couponSuccess, setCouponSuccess] =
    useState("");

  /* =======================================================
     FORM
     ======================================================= */

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),

    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      orderType: "dine-in",
      tableNumber: "",
      paymentMethod: "cash",
      notes: "",
    },
  });

  /* =======================================================
     WATCH FORM VALUES
     ======================================================= */

  const orderType = watch("orderType");

  const paymentMethod = watch("paymentMethod");

  /* =======================================================
     SUBTOTAL
     ======================================================= */

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0,
    );
  }, [items]);

  /* =======================================================
     PACKAGING FEE
     ======================================================= */

  const packagingFee =
    orderType === "takeaway"
      ? PACKAGING_FEE
      : 0;

  /* =======================================================
     COUPON DISCOUNT
     ======================================================= */

  const discount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    const coupon = COUPONS[appliedCoupon];

    if (coupon.type === "percentage") {
      return Math.min(
        subtotal,
        (subtotal * coupon.value) / 100,
      );
    }

    return Math.min(subtotal, coupon.value);
  }, [appliedCoupon, subtotal]);

  /* =======================================================
     FINAL TOTAL
     ======================================================= */

  const total = Math.max(
    0,
    subtotal + packagingFee - discount,
  );

  /* =======================================================
     APPLY COUPON
     ======================================================= */

  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");

    const normalizedCode =
      couponInput.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        COUPONS,
        normalizedCode,
      )
    ) {
      setCouponError(
        "This coupon code is invalid or unavailable.",
      );

      setAppliedCoupon(null);

      return;
    }

    const coupon =
      COUPONS[normalizedCode as CouponCode];

    setAppliedCoupon(normalizedCode as CouponCode);

    setCouponSuccess(
      `Coupon applied successfully — ${coupon.label}.`,
    );
  };

  /* =======================================================
     REMOVE COUPON
     ======================================================= */

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    setCouponSuccess("");
  };

  /* =======================================================
     EMPTY CART
     ======================================================= */

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-background)]">
        <section className="border-b border-[var(--color-border)] bg-white">
          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-primary)]"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>
          </div>
        </section>

        <section className="mx-auto flex min-h-[60vh] max-w-[1400px] items-center justify-center px-5 py-12 sm:px-8 lg:px-10">
          <div className="w-full max-w-[560px] rounded-3xl border border-[var(--color-border)] bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f3ee] text-[var(--color-primary)]">
              <ShoppingBag
                size={28}
                strokeWidth={1.8}
              />
            </div>

            <h1 className="mt-5 text-[26px] font-black tracking-[-0.03em] text-[var(--color-text)]">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-2 max-w-[390px] text-[14px] leading-6 text-[var(--color-text-secondary)]">
              Add some delicious items to your cart before
              continuing to checkout.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-[13px] font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg"
            >
              Explore Menu
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* =======================================================
     SUBMIT ORDER
     ======================================================= */

  const onSubmit = async (
    data: CheckoutFormData,
  ) => {
    setSubmitError("");
    setIsSubmittingOrder(true);

    /*
     * This payload will eventually be sent to the backend.
     *
     * IMPORTANT:
     * Backend must independently validate:
     * - coupon
     * - products
     * - quantities
     * - prices
     * - packaging fee
     * - final total
     */

    const payload = {
      customer: {
        fullName: data.fullName.trim(),

        phone: data.phone.trim(),

        ...(data.email.trim()
          ? {
              email: data.email.trim(),
            }
          : {}),
      },

      orderType: data.orderType,

      ...(data.orderType === "dine-in"
        ? {
            tableNumber: data.tableNumber.trim(),
          }
        : {}),

      paymentMethod: data.paymentMethod,

      ...(data.notes.trim()
        ? {
            notes: data.notes.trim(),
          }
        : {}),

      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),

      couponCode: appliedCoupon,

      /*
       * These are client-side display values only.
       * Backend must recalculate them.
       */

      clientSubtotal: subtotal,

      clientPackagingFee: packagingFee,

      clientDiscount: discount,

      clientTotal: total,
    };

    /*
     * =====================================================
     * FUTURE BACKEND API
     * =====================================================
     *
     * const response = await fetch("/api/orders", {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *   },
     *   body: JSON.stringify(payload),
     * });
     *
     * Backend must verify the coupon again.
     */

    console.log("Checkout payload:", payload);

    /*
     * Do not show fake success before backend exists.
     */

    window.setTimeout(() => {
      setIsSubmittingOrder(false);

      setSubmitError(
        "Order service is not connected yet. Please connect the backend API before placing a real order.",
      );
    }, 700);
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* ===================================================
          PAGE HEADER
          =================================================== */}

      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
          <Link
            href="/cart"
            className="mb-4 inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Biteora Checkout
          </p>

          <h1 className="text-[36px] font-black tracking-[-0.04em] text-[var(--color-text)] sm:text-[46px]">
            Complete Your Order
          </h1>

          <p className="mt-2 max-w-[600px] text-[14px] leading-6 text-[var(--color-text-secondary)]">
            Enter your details, choose how you would like
            to receive your order, and review your total.
          </p>
        </div>
      </section>

      {/* ===================================================
          CHECKOUT CONTENT
          =================================================== */}

      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* =================================================
              LEFT COLUMN
              ================================================= */}

          <div className="space-y-5">
            {/* CUSTOMER INFORMATION */}

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
              <h2 className="text-[19px] font-black text-[var(--color-text)]">
                Customer Information
              </h2>

              <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                We need these details to process your order.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* FULL NAME */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
                  >
                    Full Name
                    <span className="text-[var(--color-primary)]">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-[13px] text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
                      errors.fullName
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />

                  {errors.fullName && (
                    <p className="mt-2 text-[11px] font-medium text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
                  >
                    Phone Number
                    <span className="text-[var(--color-primary)]">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    {...register("phone")}
                    placeholder="+1 234 567 890"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-[13px] text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
                      errors.phone
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-[11px] font-medium text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
                  >
                    Email

                    <span className="ml-1 text-[11px] font-normal text-[var(--color-text-muted)]">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    maxLength={120}
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-[13px] text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-2 text-[11px] font-medium text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ORDER TYPE */}

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
              <h2 className="text-[19px] font-black text-[var(--color-text)]">
                Order Type
              </h2>

              <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                Choose how you would like to receive your food.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* DINE IN */}

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="dine-in"
                    {...register("orderType")}
                    className="sr-only"
                  />

                  <div
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      orderType === "dine-in"
                        ? "border-[var(--color-primary)] bg-[#fff8f5] shadow-sm"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
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
                  </div>
                </label>

                {/* TAKEAWAY */}

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="takeaway"
                    {...register("orderType")}
                    className="sr-only"
                  />

                  <div
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      orderType === "takeaway"
                        ? "border-[var(--color-primary)] bg-[#fff8f5] shadow-sm"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
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
                  </div>
                </label>
              </div>

              {/* TABLE NUMBER */}

              {orderType === "dine-in" && (
                <div className="mt-5">
                  <label
                    htmlFor="tableNumber"
                    className="mb-2 block text-[12px] font-bold text-[var(--color-text)]"
                  >
                    Table Number
                    <span className="text-[var(--color-primary)]">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    id="tableNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    {...register("tableNumber")}
                    onInput={(event) => {
                      event.currentTarget.value =
                        event.currentTarget.value.replace(
                          /\D/g,
                          "",
                        );
                    }}
                    placeholder="Enter your table number"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-[13px] text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
                      errors.tableNumber
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />

                  {errors.tableNumber ? (
                    <p className="mt-2 text-[11px] font-medium text-red-600">
                      {errors.tableNumber.message}
                    </p>
                  ) : (
                    <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                      Please enter the table number where you are
                      sitting.
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* PAYMENT METHOD */}

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
              <h2 className="text-[19px] font-black text-[var(--color-text)]">
                Payment Method
              </h2>

              <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                Select your preferred payment method.
              </p>

              <div className="mt-5 space-y-3">
                {/* CASH */}

                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    value="cash"
                    {...register("paymentMethod")}
                    className="sr-only"
                  />

                  <div
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      paymentMethod === "cash"
                        ? "border-[var(--color-primary)] bg-[#fff8f5]"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          paymentMethod === "cash"
                            ? "border-[var(--color-primary)]"
                            : "border-[#cfc8bf]"
                        }`}
                      >
                        {paymentMethod === "cash" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </div>

                      <div>
                        <p className="text-[14px] font-black text-[var(--color-text)]">
                          Cash
                        </p>

                        <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">
                          Pay with cash at the restaurant.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* ONLINE */}

                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    value="online"
                    {...register("paymentMethod")}
                    className="sr-only"
                  />

                  <div
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      paymentMethod === "online"
                        ? "border-[var(--color-primary)] bg-[#fff8f5]"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            paymentMethod === "online"
                              ? "border-[var(--color-primary)]"
                              : "border-[#cfc8bf]"
                          }`}
                        >
                          {paymentMethod === "online" && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                          )}
                        </div>

                        <div>
                          <p className="text-[14px] font-black text-[var(--color-text)]">
                            Online Payment
                          </p>

                          <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">
                            Pay securely online.
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-[#f5f1eb] px-2.5 py-1 text-[10px] font-bold text-[var(--color-text-muted)]">
                        Secure
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* SPECIAL INSTRUCTIONS */}

            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
              <label
                htmlFor="notes"
                className="block text-[19px] font-black text-[var(--color-text)]"
              >
                Special Instructions
              </label>

              <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                Optional notes for the restaurant.
              </p>

              <textarea
                id="notes"
                rows={4}
                maxLength={300}
                {...register("notes")}
                placeholder="Example: No onions, extra sauce..."
                className={`mt-5 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-[13px] text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
                  errors.notes
                    ? "border-red-400"
                    : "border-[var(--color-border)]"
                }`}
              />

              {errors.notes && (
                <p className="mt-2 text-[11px] font-medium text-red-600">
                  {errors.notes.message}
                </p>
              )}
            </section>
          </div>

          {/* =================================================
              RIGHT COLUMN
              ================================================= */}

          <aside className="h-fit rounded-3xl border border-[var(--color-border)] bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-[20px] font-black text-[var(--color-text)]">
              Order Summary
            </h2>

            {/* ITEMS */}

            <div className="mt-5 max-h-[360px] space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f8f3ee]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-[var(--color-text)]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="text-[13px] font-bold text-[var(--color-text)]">
                    $
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* =================================================
                COUPON
                ================================================= */}

            <div className="mt-6 border-t border-[var(--color-border)] pt-5">
              <div className="flex items-center gap-2">
                <Tag
                  size={16}
                  className="text-[var(--color-primary)]"
                />

                <h3 className="text-[14px] font-black text-[var(--color-text)]">
                  Have a coupon?
                </h3>
              </div>

              {!appliedCoupon ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(event) => {
                      setCouponInput(
                        event.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, ""),
                      );

                      setCouponError("");
                      setCouponSuccess("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    maxLength={30}
                    placeholder="Enter coupon code"
                    aria-label="Coupon code"
                    className={`min-w-0 flex-1 rounded-2xl border bg-white px-4 py-3 text-[12px] font-bold tracking-wide text-[var(--color-text)] outline-none transition-all duration-300 placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
                      couponError
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="shrink-0 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-[12px] font-bold !text-white transition-all duration-300 hover:bg-[var(--color-primary-hover)]"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Check
                      size={16}
                      strokeWidth={3}
                      className="shrink-0 text-green-600"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-black tracking-wide text-green-700">
                        {appliedCoupon}
                      </p>

                      <p className="mt-0.5 text-[11px] text-green-600">
                        {COUPONS[appliedCoupon].label}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    aria-label="Remove coupon"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-green-700 transition-colors duration-300 hover:bg-green-100"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {couponError && (
                <p className="mt-2 text-[11px] font-medium text-red-600">
                  {couponError}
                </p>
              )}

              {couponSuccess && !couponError && (
                <p className="mt-2 text-[11px] font-medium text-green-600">
                  {couponSuccess}
                </p>
              )}
            </div>

            {/* =================================================
                PRICE SUMMARY
                ================================================= */}

            <div className="mt-5 space-y-4 border-t border-[var(--color-border)] pt-5">
              {/* SUBTOTAL */}

              <div className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--color-text-secondary)]">
                  Subtotal
                </span>

                <span className="font-bold text-[var(--color-text)]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* PACKAGING */}

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

              {/* DISCOUNT */}

              {discount > 0 && (
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-green-600">
                    Discount
                  </span>

                  <span className="font-bold text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* ORDER TYPE */}

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

              {/* TOTAL */}

              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-black text-[var(--color-text)]">
                    Total
                  </span>

                  <span className="text-[23px] font-black text-[var(--color-primary)]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* ERROR */}

            {submitError && (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-[12px] font-medium leading-5 text-red-700">
                  {submitError}
                </p>
              </div>
            )}

            {/* PLACE ORDER */}

            <button
              type="submit"
              disabled={isSubmittingOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-[13px] font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:!text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isSubmittingOrder ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Processing...
                </>
              ) : (
                <>
                  <Check
                    size={16}
                    strokeWidth={2.5}
                  />

                  Place Order
                </>
              )}
            </button>

            <Link
              href="/cart"
              className="mt-3 flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3.5 text-[13px] font-bold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Back to Cart
            </Link>

            <p className="mt-4 text-center text-[10px] leading-5 text-[var(--color-text-muted)]">
              Coupon discounts and order totals will be
              securely verified by the restaurant system.
            </p>
          </aside>
        </form>
      </section>
    </main>
  );
}