"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  TicketPercent,
  Trash2,
  X,
} from "lucide-react";

type DiscountType = "percentage" | "fixed";

interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
}

interface CouponForm {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  minOrderAmount: string;
  expiryDate: string;
  usageLimit: string;
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coupon-welcome10",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 20,
    expiryDate: "2026-12-31",
    usageLimit: 100,
    usedCount: 24,
    active: true,
  },
  {
    id: "coupon-save5",
    code: "SAVE5",
    discountType: "fixed",
    discountValue: 5,
    minOrderAmount: 25,
    expiryDate: "2026-11-30",
    usageLimit: 50,
    usedCount: 12,
    active: true,
  },
  {
    id: "coupon-bite20",
    code: "BITE20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 30,
    expiryDate: "2026-10-31",
    usageLimit: 30,
    usedCount: 30,
    active: false,
  },
];

const EMPTY_FORM: CouponForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "0",
  expiryDate: "",
  usageLimit: "",
};

export default function CouponsPage() {
  const [coupons, setCoupons] =
    useState<Coupon[]>(INITIAL_COUPONS);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | "Active" | "Inactive">("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] =
    useState<Coupon | null>(null);

  const [form, setForm] =
    useState<CouponForm>(EMPTY_FORM);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesSearch =
        !query ||
        coupon.code.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && coupon.active) ||
        (statusFilter === "Inactive" && !coupon.active);

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  const activeCount = coupons.filter(
    (coupon) => coupon.active,
  ).length;

  const inactiveCount = coupons.filter(
    (coupon) => !coupon.active,
  ).length;

  function openAddModal() {
    setEditingCoupon(null);
    setForm(EMPTY_FORM);
    setError("");
    setMessage("");
    setShowModal(true);
  }

  function openEditModal(coupon: Coupon) {
    setEditingCoupon(coupon);

    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount.toString(),
      expiryDate: coupon.expiryDate,
      usageLimit:
        coupon.usageLimit === null
          ? ""
          : coupon.usageLimit.toString(),
    });

    setError("");
    setMessage("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCoupon(null);
    setError("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const code = form.code
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "");

    const discountValue = Number(
      form.discountValue,
    );

    const minOrderAmount = Number(
      form.minOrderAmount,
    );

    const usageLimit =
      form.usageLimit.trim() === ""
        ? null
        : Number(form.usageLimit);

    // --------------------------------------------------
    // Frontend validation
    //
    // IMPORTANT:
    // Backend must perform the same validation.
    // Frontend validation is only for UX.
    // --------------------------------------------------

    if (!code) {
      setError("Coupon code is required.");
      return;
    }

    if (code.length < 3) {
      setError(
        "Coupon code must contain at least 3 characters.",
      );
      return;
    }

    if (code.length > 30) {
      setError(
        "Coupon code must be 30 characters or less.",
      );
      return;
    }

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      setError("Please enter a valid discount value.");
      return;
    }

    if (
      form.discountType === "percentage" &&
      discountValue > 100
    ) {
      setError(
        "Percentage discount cannot exceed 100%.",
      );
      return;
    }

    if (
      !Number.isFinite(minOrderAmount) ||
      minOrderAmount < 0
    ) {
      setError(
        "Please enter a valid minimum order amount.",
      );
      return;
    }

    if (!form.expiryDate) {
      setError("Expiry date is required.");
      return;
    }

    const expiry = new Date(
      `${form.expiryDate}T23:59:59`,
    );

    if (Number.isNaN(expiry.getTime())) {
      setError("Please enter a valid expiry date.");
      return;
    }

    if (
      usageLimit !== null &&
      (!Number.isFinite(usageLimit) ||
        usageLimit <= 0 ||
        !Number.isInteger(usageLimit))
    ) {
      setError(
        "Usage limit must be a positive whole number.",
      );
      return;
    }

    if (
      usageLimit !== null &&
      editingCoupon &&
      usageLimit < editingCoupon.usedCount
    ) {
      setError(
        `Usage limit cannot be less than current usage (${editingCoupon.usedCount}).`,
      );
      return;
    }

    // --------------------------------------------------
    // Backend API contract
    //
    // POST  /api/coupons
    // PATCH /api/coupons/:id
    //
    // Backend must verify:
    // - authentication
    // - authorization / role
    // - coupon uniqueness
    // - discount rules
    // - expiry
    // - usage limits
    // - eligibility
    // --------------------------------------------------

    const couponPayload = {
      code,
      discountType: form.discountType,
      discountValue,
      minOrderAmount,
      expiryDate: form.expiryDate,
      usageLimit,
    };

    if (editingCoupon) {
      // ==================================================
      // BACKEND INTEGRATION
      // ==================================================
      //
      // Later:
      //
      // await updateCoupon(
      //   editingCoupon.id,
      //   couponPayload,
      // );
      //
      // Expected:
      // PATCH /api/coupons/:id
      //
      // ==================================================

      setCoupons((current) =>
        current.map((coupon) =>
          coupon.id === editingCoupon.id
            ? {
                ...coupon,
                ...couponPayload,
              }
            : coupon,
        ),
      );

      setMessage("Coupon updated successfully.");
    } else {
      // ==================================================
      // BACKEND INTEGRATION
      // ==================================================
      //
      // Later:
      //
      // const createdCoupon =
      //   await createCoupon(couponPayload);
      //
      // Expected:
      // POST /api/coupons
      //
      // Backend should generate the real database ID.
      //
      // ==================================================

      const duplicate = coupons.some(
        (coupon) =>
          coupon.code.toLowerCase() ===
          code.toLowerCase(),
      );

      if (duplicate) {
        setError(
          "A coupon with this code already exists.",
        );
        return;
      }

      const newCoupon: Coupon = {
        id: `coupon-${Date.now()}`,
        ...couponPayload,
        usedCount: 0,
        active: true,
      };

      setCoupons((current) => [
        newCoupon,
        ...current,
      ]);

      setMessage("Coupon created successfully.");
    }

    closeModal();
  }

  function toggleCoupon(couponId: string) {
    setCoupons((current) =>
      current.map((coupon) =>
        coupon.id === couponId
          ? {
              ...coupon,
              active: !coupon.active,
            }
          : coupon,
      ),
    );

    setMessage("Coupon status updated.");
  }

  function deleteCoupon(coupon: Coupon) {
    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}"?`,
    );

    if (!confirmed) return;

    setCoupons((current) =>
      current.filter(
        (item) => item.id !== coupon.id,
      ),
    );

    setMessage("Coupon deleted successfully.");
  }

  function formatDiscount(coupon: Coupon) {
    return coupon.discountType === "percentage"
      ? `${coupon.discountValue}%`
      : `$${coupon.discountValue.toFixed(2)}`;
  }

  function formatUsage(coupon: Coupon) {
    return coupon.usageLimit === null
      ? `${coupon.usedCount} / Unlimited`
      : `${coupon.usedCount} / ${coupon.usageLimit}`;
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            Restaurant Management
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Coupons
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Create and manage discount coupons,
            usage limits and expiry dates.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-lg"
        >
          <Plus size={18} />
          Add Coupon
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Total Coupons
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            {coupons.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Active
          </p>

          <p className="mt-3 text-2xl font-extrabold text-green-600">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Inactive
          </p>

          <p className="mt-3 text-2xl font-extrabold text-gray-500">
            {inactiveCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Total Used
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            {coupons.reduce(
              (total, coupon) =>
                total + coupon.usedCount,
              0,
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search coupon code..."
              className="h-11 w-full rounded-xl border border-[var(--color-border)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "All"
                  | "Active"
                  | "Inactive",
              )
            }
            className="h-11 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)] lg:w-48"
          >
            <option value="All">
              All statuses
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* Coupon table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-left">
                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Coupon
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Discount
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Minimum Order
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Usage
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Expiry
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
                        <TicketPercent size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-extrabold text-[var(--color-text)]">
                          {coupon.code}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {coupon.discountType ===
                          "percentage"
                            ? "Percentage discount"
                            : "Fixed amount discount"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                    {formatDiscount(coupon)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    ${coupon.minOrderAmount.toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    {formatUsage(coupon)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    {coupon.expiryDate}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        toggleCoupon(coupon.id)
                      }
                      className={`rounded-full px-3 py-1 text-[10px] font-bold transition ${
                        coupon.active
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {coupon.active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(coupon)
                        }
                        aria-label={`Edit ${coupon.code}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteCoupon(coupon)
                        }
                        aria-label={`Delete ${coupon.code}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="p-10 text-center">
            <TicketPercent
              size={28}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <p className="mt-3 text-sm font-bold text-[var(--color-text)]">
              No coupons found
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Try another search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Coupon Management
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[var(--color-text)]">
                  {editingCoupon
                    ? "Edit Coupon"
                    : "Add Coupon"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-background)]"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}

              {/* Coupon code */}
              <div>
                <label
                  htmlFor="coupon-code"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Coupon code
                </label>

                <input
                  id="coupon-code"
                  type="text"
                  value={form.code}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      code: event.target.value
                        .toUpperCase()
                        .replace(
                          /[^A-Z0-9_-]/g,
                          "",
                        ),
                    }))
                  }
                  placeholder="WELCOME10"
                  maxLength={30}
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm font-semibold uppercase outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Discount type */}
              <div>
                <label
                  htmlFor="discount-type"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Discount type
                </label>

                <select
                  id="discount-type"
                  value={form.discountType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      discountType:
                        event.target.value as DiscountType,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="percentage">
                    Percentage
                  </option>
                  <option value="fixed">
                    Fixed amount
                  </option>
                </select>
              </div>

              {/* Discount value */}
              <div>
                <label
                  htmlFor="discount-value"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Discount value
                </label>

                <div className="relative">
                  <input
                    id="discount-value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discountValue}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        discountValue:
                          event.target.value,
                      }))
                    }
                    placeholder={
                      form.discountType ===
                      "percentage"
                        ? "10"
                        : "5.00"
                    }
                    className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 pr-16 text-sm outline-none focus:border-[var(--color-primary)]"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-muted)]">
                    {form.discountType ===
                    "percentage"
                      ? "%"
                      : "USD"}
                  </span>
                </div>
              </div>

              {/* Minimum order */}
              <div>
                <label
                  htmlFor="min-order"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Minimum order amount
                </label>

                <input
                  id="min-order"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minOrderAmount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      minOrderAmount:
                        event.target.value,
                    }))
                  }
                  placeholder="20.00"
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Expiry date */}
              <div>
                <label
                  htmlFor="expiry-date"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Expiry date
                </label>

                <input
                  id="expiry-date"
                  type="date"
                  value={form.expiryDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      expiryDate:
                        event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Usage limit */}
              <div>
                <label
                  htmlFor="usage-limit"
                  className="mb-2 block text-xs font-bold text-[var(--color-text)]"
                >
                  Usage limit
                </label>

                <input
                  id="usage-limit"
                  type="number"
                  min="1"
                  step="1"
                  value={form.usageLimit}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      usageLimit:
                        event.target.value,
                    }))
                  }
                  placeholder="100"
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
                />

                <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                  Leave empty for unlimited usage.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-11 flex-1 rounded-xl bg-[var(--color-primary)] text-sm font-bold text-white hover:bg-[var(--color-primary-hover)]"
                >
                  {editingCoupon
                    ? "Save Changes"
                    : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}