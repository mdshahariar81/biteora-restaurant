"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  XCircle,
} from "lucide-react";

type ReportRange =
  | "7days"
  | "30days"
  | "90days";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

interface ReportOrder {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  date: string;
}

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

const REPORT_ORDERS: ReportOrder[] = [
  {
    id: "ORD-1001",
    customer: "Sarah Khan",
    total: 28.5,
    status: "COMPLETED",
    date: "2026-09-30",
  },
  {
    id: "ORD-1002",
    customer: "Rafiul Islam",
    total: 19.0,
    status: "COMPLETED",
    date: "2026-09-30",
  },
  {
    id: "ORD-1003",
    customer: "Nusrat Jahan",
    total: 42.75,
    status: "PREPARING",
    date: "2026-09-30",
  },
  {
    id: "ORD-1004",
    customer: "Tanvir Ahmed",
    total: 15.5,
    status: "CANCELLED",
    date: "2026-09-29",
  },
  {
    id: "ORD-1005",
    customer: "Fariah Rahman",
    total: 36.25,
    status: "COMPLETED",
    date: "2026-09-29",
  },
  {
    id: "ORD-1006",
    customer: "James Wilson",
    total: 22.0,
    status: "READY",
    date: "2026-09-28",
  },
  {
    id: "ORD-1007",
    customer: "Sarah Khan",
    total: 31.5,
    status: "COMPLETED",
    date: "2026-09-28",
  },
  {
    id: "ORD-1008",
    customer: "Nusrat Jahan",
    total: 18.75,
    status: "COMPLETED",
    date: "2026-09-27",
  },
];

const PRODUCT_SALES: ProductSales[] = [
  {
    name: "Classic Chicken Burger",
    quantity: 42,
    revenue: 357,
  },
  {
    name: "Burger Combo",
    quantity: 35,
    revenue: 437.5,
  },
  {
    name: "Chicken Bucket",
    quantity: 28,
    revenue: 504,
  },
  {
    name: "French Fries",
    quantity: 31,
    revenue: 108.5,
  },
  {
    name: "Spicy Chicken Burger",
    quantity: 24,
    revenue: 228,
  },
];

const DAILY_REVENUE: DailyRevenue[] = [
  {
    date: "Sep 24",
    revenue: 182,
    orders: 9,
  },
  {
    date: "Sep 25",
    revenue: 246,
    orders: 12,
  },
  {
    date: "Sep 26",
    revenue: 198,
    orders: 10,
  },
  {
    date: "Sep 27",
    revenue: 275,
    orders: 14,
  },
  {
    date: "Sep 28",
    revenue: 312,
    orders: 16,
  },
  {
    date: "Sep 29",
    revenue: 294,
    orders: 15,
  },
  {
    date: "Sep 30",
    revenue: 326,
    orders: 17,
  },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] =
    useState<ReportRange>("7days");

  const [error, setError] =
    useState("");

  /*
   * Demo data is currently local.
   *
   * Production:
   * Replace the local demo source with the backend
   * report APIs defined at the bottom of this file.
   */

  const completedOrders =
    useMemo(
      () =>
        REPORT_ORDERS.filter(
          (order) =>
            order.status ===
            "COMPLETED",
        ),
      [],
    );

  const cancelledOrders =
    useMemo(
      () =>
        REPORT_ORDERS.filter(
          (order) =>
            order.status ===
            "CANCELLED",
        ),
      [],
    );

  const totalRevenue =
    useMemo(
      () =>
        completedOrders.reduce(
          (total, order) =>
            total + order.total,
          0,
        ),
      [completedOrders],
    );

  const totalOrders =
    REPORT_ORDERS.length;

  const averageOrderValue =
    completedOrders.length > 0
      ? totalRevenue /
        completedOrders.length
      : 0;

  const completionRate =
    totalOrders > 0
      ? (completedOrders.length /
          totalOrders) *
        100
      : 0;

  const maxRevenue =
    Math.max(
      ...DAILY_REVENUE.map(
        (item) => item.revenue,
      ),
      0,
    );

  const statusCounts =
    useMemo(
      () => ({
        pending:
          REPORT_ORDERS.filter(
            (order) =>
              order.status ===
              "PENDING",
          ).length,

        confirmed:
          REPORT_ORDERS.filter(
            (order) =>
              order.status ===
              "CONFIRMED",
          ).length,

        preparing:
          REPORT_ORDERS.filter(
            (order) =>
              order.status ===
              "PREPARING",
          ).length,

        ready:
          REPORT_ORDERS.filter(
            (order) =>
              order.status ===
              "READY",
          ).length,

        completed:
          REPORT_ORDERS.filter(
            (order) =>
              order.status ===
              "COMPLETED",
          ).length,

        cancelled:
          REPORT_ORDERS.filter(
            (order) =>
              order.status ===
              "CANCELLED",
          ).length,
      }),
      [],
    );

  function handleRangeChange(
    value: ReportRange,
  ) {
    setError("");

    /*
     * Production:
     *
     * Fetch new report data using:
     *
     * GET /api/reports/summary?range=${value}
     * GET /api/reports/revenue?range=${value}
     * GET /api/reports/products?range=${value}
     * GET /api/reports/orders?range=${value}
     *
     * Backend must calculate the actual date range.
     */

    setDateRange(value);
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            Restaurant Analytics
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Reports
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Monitor revenue, orders, product
            performance and restaurant activity.
          </p>
        </div>

        <select
          value={dateRange}
          onChange={(event) =>
            handleRangeChange(
              event.target
                .value as ReportRange,
            )
          }
          className="h-11 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold outline-none focus:border-[var(--color-primary)]"
        >
          <option value="7days">
            Last 7 days
          </option>

          <option value="30days">
            Last 30 days
          </option>

          <option value="90days">
            Last 90 days
          </option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="shrink-0 underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Demo data notice */}
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-[11px] leading-5 text-blue-700">
          Reports are currently using temporary
          frontend demo data. Revenue, orders and
          analytics will be loaded from the backend
          API in production.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              Total Revenue
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <DollarSign size={17} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-extrabold text-[var(--color-text)]">
            $
            {totalRevenue.toFixed(
              2,
            )}
          </p>

          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-green-600">
            <TrendingUp size={13} />
            Revenue from completed orders
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              Total Orders
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
              <ShoppingBag size={17} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-extrabold text-[var(--color-text)]">
            {totalOrders}
          </p>

          <p className="mt-2 text-[11px] font-semibold text-[var(--color-text-muted)]">
            Orders in selected period
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              Average Order
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 size={17} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-extrabold text-[var(--color-text)]">
            $
            {averageOrderValue.toFixed(
              2,
            )}
          </p>

          <p className="mt-2 text-[11px] font-semibold text-[var(--color-text-muted)]">
            Completed orders average
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              Completion Rate
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={17} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-extrabold text-[var(--color-text)]">
            {completionRate.toFixed(
              1,
            )}
            %
          </p>

          <p className="mt-2 text-[11px] font-semibold text-[var(--color-text-muted)]">
            {completedOrders.length}{" "}
            completed orders
          </p>
        </div>
      </div>

      {/* Revenue overview */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Revenue Overview
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Daily revenue and order volume
            </p>
          </div>

          <BarChart3
            size={20}
            className="text-[var(--color-text-muted)]"
          />
        </div>

        <div className="mt-7 flex h-64 items-end gap-2 overflow-x-auto sm:gap-4">
          {DAILY_REVENUE.map(
            (item) => {
              const height =
                maxRevenue > 0
                  ? (item.revenue /
                      maxRevenue) *
                    100
                  : 0;

              return (
                <div
                  key={item.date}
                  className="flex min-w-[52px] flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)]">
                    ${item.revenue}
                  </div>

                  <div className="flex h-44 w-full max-w-[48px] items-end rounded-lg bg-[var(--color-background)]">
                    <div
                      className="w-full rounded-lg bg-[var(--color-primary)] transition-all"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.date}: $${item.revenue}`}
                    />
                  </div>

                  <div className="text-center text-[10px] font-semibold text-[var(--color-text-muted)]">
                    {item.date}
                  </div>

                  <div className="text-[9px] text-[var(--color-text-muted)]">
                    {item.orders}{" "}
                    orders
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Middle section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Order status */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Order Status
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Current order distribution
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <StatusRow
              label="Pending"
              count={
                statusCounts.pending
              }
              icon={
                <Clock3 size={15} />
              }
              className="text-amber-600"
            />

            <StatusRow
              label="Confirmed"
              count={
                statusCounts.confirmed
              }
              icon={
                <CheckCircle2
                  size={15}
                />
              }
              className="text-blue-600"
            />

            <StatusRow
              label="Preparing"
              count={
                statusCounts.preparing
              }
              icon={
                <Package size={15} />
              }
              className="text-orange-600"
            />

            <StatusRow
              label="Ready"
              count={
                statusCounts.ready
              }
              icon={
                <ShoppingBag
                  size={15}
                />
              }
              className="text-purple-600"
            />

            <StatusRow
              label="Completed"
              count={
                statusCounts.completed
              }
              icon={
                <CheckCircle2
                  size={15}
                />
              }
              className="text-green-600"
            />

            <StatusRow
              label="Cancelled"
              count={
                statusCounts.cancelled
              }
              icon={
                <XCircle size={15} />
              }
              className="text-red-600"
            />
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Top Selling Products
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Products by quantity sold
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {PRODUCT_SALES.map(
              (
                product,
                index,
              ) => (
                <div
                  key={
                    product.name
                  }
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-background)] text-xs font-extrabold text-[var(--color-primary)]">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[var(--color-text)]">
                      {
                        product.name
                      }
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                      {
                        product.quantity
                      }{" "}
                      units sold
                    </p>
                  </div>

                  <p className="text-sm font-extrabold text-[var(--color-text)]">
                    $
                    {product.revenue.toFixed(
                      2,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Recent sales */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Recent Sales
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Latest orders included in reports
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
            <ShoppingBag size={17} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-left">
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Order
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Customer
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Date
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {REPORT_ORDERS.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]"
                  >
                    <td className="px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                      {order.id}
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {
                        order.customer
                      }
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {order.date}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          order.status
                        }
                      />
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-extrabold text-[var(--color-text)]">
                      $
                      {order.total.toFixed(
                        2,
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {REPORT_ORDERS.length ===
          0 && (
          <div className="p-10 text-center">
            <ShoppingBag
              size={28}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <p className="mt-3 text-sm font-bold text-[var(--color-text)]">
              No report data available
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              There are no orders available for
              this report.
            </p>
          </div>
        )}
      </div>

      {/* Additional metrics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <XCircle size={18} />
            </div>

            <div>
              <p className="text-xs font-semibold text-red-700">
                Cancelled Orders
              </p>

              <p className="mt-1 text-2xl font-extrabold text-red-700">
                {
                  cancelledOrders.length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
              <CheckCircle2
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-green-700">
                Completed Revenue
              </p>

              <p className="mt-1 text-2xl font-extrabold text-green-700">
                $
                {totalRevenue.toFixed(
                  2,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backend API contract */}
      {/*
        --------------------------------------------------
        PRODUCTION BACKEND API CONTRACT
        --------------------------------------------------

        GET /api/reports/summary?range=7days
        GET /api/reports/revenue?range=7days
        GET /api/reports/products?range=7days
        GET /api/reports/orders?range=7days

        Backend should return trusted calculated data.

        Example summary response:

        {
          "range": "7days",
          "totalRevenue": 0,
          "totalOrders": 0,
          "averageOrderValue": 0,
          "completionRate": 0,
          "completedOrders": 0,
          "cancelledOrders": 0
        }

        Example revenue response:

        {
          "items": [
            {
              "date": "2026-09-30",
              "revenue": 0,
              "orders": 0
            }
          ]
        }

        Example products response:

        {
          "items": [
            {
              "name": "Classic Chicken Burger",
              "quantity": 0,
              "revenue": 0
            }
          ]
        }

        Example orders response:

        {
          "items": [],
          "total": 0
        }

        Backend responsibilities:

        - Authentication
        - Authorization
        - Date range validation
        - Revenue calculation
        - Order aggregation
        - Product sales aggregation
        - Cancellation statistics
        - Accurate financial calculations
        - Pagination where required
        - Protection against unauthorized report access

        IMPORTANT:

        Revenue, order totals, completion rates and
        analytics MUST be calculated from trusted
        backend/database data.

        Frontend/demo values must never be treated as
        authoritative financial information.
        --------------------------------------------------
      */}
    </div>
  );
}

function StatusRow({
  label,
  count,
  icon,
  className,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] p-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-background)] ${className}`}
        >
          {icon}
        </div>

        <span className="text-sm font-semibold text-[var(--color-text)]">
          {label}
        </span>
      </div>

      <span className="text-sm font-extrabold text-[var(--color-text)]">
        {count}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const styles: Record<
    OrderStatus,
    string
  > = {
    PENDING:
      "bg-amber-50 text-amber-700",
    CONFIRMED:
      "bg-blue-50 text-blue-700",
    PREPARING:
      "bg-orange-50 text-orange-700",
    READY:
      "bg-purple-50 text-purple-700",
    COMPLETED:
      "bg-green-50 text-green-700",
    CANCELLED:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}