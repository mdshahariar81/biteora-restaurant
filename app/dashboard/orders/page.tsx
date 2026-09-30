"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Search,
  ShoppingBag,
  XCircle,
} from "lucide-react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

type OrderType = "DINE_IN" | "TAKEAWAY";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

/*
 * Temporary development data.
 *
 * Production:
 * These orders will come from:
 *
 * GET /api/orders
 *
 * The backend/database will become the source of truth.
 */
const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customerName: "John Smith",
    phone: "+1 555 0101",
    orderType: "DINE_IN",
    tableNumber: "T04",
    items: [
      {
        name: "Classic Chicken Burger",
        quantity: 2,
        price: 8.5,
      },
      {
        name: "French Fries",
        quantity: 1,
        price: 3.5,
      },
    ],
    total: 20.5,
    status: "PENDING",
    createdAt: "2026-09-29 14:32",
  },
  {
    id: "ORD-1002",
    customerName: "Sarah Wilson",
    phone: "+1 555 0102",
    orderType: "TAKEAWAY",
    items: [
      {
        name: "Spicy Chicken Burger",
        quantity: 1,
        price: 9.5,
      },
      {
        name: "Chicken Nuggets",
        quantity: 1,
        price: 5.5,
      },
    ],
    total: 16,
    status: "CONFIRMED",
    createdAt: "2026-09-29 14:25",
  },
  {
    id: "ORD-1003",
    customerName: "Michael Brown",
    phone: "+1 555 0103",
    orderType: "DINE_IN",
    tableNumber: "T08",
    items: [
      {
        name: "Burger Combo",
        quantity: 2,
        price: 12.5,
      },
    ],
    total: 25,
    status: "PREPARING",
    createdAt: "2026-09-29 14:10",
  },
  {
    id: "ORD-1004",
    customerName: "Emma Davis",
    phone: "+1 555 0104",
    orderType: "TAKEAWAY",
    items: [
      {
        name: "Chicken Wings",
        quantity: 1,
        price: 8,
      },
      {
        name: "Cola",
        quantity: 2,
        price: 2.5,
      },
    ],
    total: 13,
    status: "READY",
    createdAt: "2026-09-29 13:55",
  },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PREPARING: "bg-purple-50 text-purple-700",
  READY: "bg-green-50 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>(INITIAL_ORDERS);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<OrderStatus | "ALL">("ALL");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [actionMessage, setActionMessage] =
    useState("");

  const filteredOrders = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.id
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.customerName
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.phone
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status }
          : order,
      ),
    );

    setSelectedOrder((currentOrder) =>
      currentOrder?.id === orderId
        ? { ...currentOrder, status }
        : currentOrder,
    );

    setActionMessage(
      `Order ${orderId} updated to ${STATUS_LABELS[status]}.`,
    );
  }

  function cancelOrder(orderId: string) {
    const confirmed = window.confirm(
      `Cancel order ${orderId}?`,
    );

    if (!confirmed) return;

    updateOrderStatus(orderId, "CANCELLED");
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          Restaurant Operations
        </p>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Orders
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          Monitor incoming orders and manage their status.
        </p>
      </div>

      {/* Message */}
      {actionMessage && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
          {actionMessage}
        </div>
      )}

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Pending",
            value: orders.filter(
              (order) => order.status === "PENDING",
            ).length,
            icon: Clock3,
          },
          {
            label: "Preparing",
            value: orders.filter(
              (order) =>
                order.status === "PREPARING",
            ).length,
            icon: ShoppingBag,
          },
          {
            label: "Ready",
            value: orders.filter(
              (order) => order.status === "READY",
            ).length,
            icon: CheckCircle2,
          },
          {
            label: "Completed",
            value: orders.filter(
              (order) =>
                order.status === "COMPLETED",
            ).length,
            icon: CheckCircle2,
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                  {card.label}
                </p>

                <Icon
                  size={18}
                  className="text-[var(--color-primary)]"
                />
              </div>

              <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
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
              placeholder="Search order ID, customer or phone..."
              className="h-11 w-full rounded-xl border border-[var(--color-border)] pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          {/* Status */}
          <div className="relative lg:w-52">
            <Filter
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | OrderStatus
                    | "ALL",
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-[var(--color-border)] bg-white pl-10 pr-4 text-sm outline-none focus:border-[var(--color-primary)]"
            >
              <option value="ALL">
                All statuses
              </option>

              {Object.entries(STATUS_LABELS).map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-left">
                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Order
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Customer
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Type
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Total
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-[var(--color-text)]">
                      {order.id}
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                      {order.createdAt}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {order.customerName}
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {order.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-[var(--color-text)]">
                      {order.orderType === "DINE_IN"
                        ? "Dine In"
                        : "Takeaway"}
                    </p>

                    {order.tableNumber && (
                      <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                        Table {order.tableNumber}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                    ${order.total.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_CLASSES[order.status]}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-xs font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      {order.status !==
                        "COMPLETED" &&
                        order.status !==
                          "CANCELLED" && (
                          <button
                            type="button"
                            onClick={() =>
                              cancelOrder(order.id)
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
                          >
                            <XCircle size={14} />
                            Cancel
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-10 text-center">
            <ShoppingBag
              size={26}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <p className="mt-3 text-sm font-bold text-[var(--color-text)]">
              No orders found
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Order Details
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[var(--color-text)]">
                  {selectedOrder.id}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-background)]"
              >
                <XCircle size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Customer */}
              <div>
                <p className="text-xs font-bold text-[var(--color-text)]">
                  Customer
                </p>

                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {selectedOrder.customerName}
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {selectedOrder.phone}
                </p>
              </div>

              {/* Order type */}
              <div className="rounded-xl bg-[var(--color-background)] p-4">
                <p className="text-xs font-bold text-[var(--color-text)]">
                  Order Type
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {selectedOrder.orderType ===
                  "DINE_IN"
                    ? `Dine In${
                        selectedOrder.tableNumber
                          ? ` — Table ${selectedOrder.tableNumber}`
                          : ""
                      }`
                    : "Takeaway"}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-[var(--color-text)]">
                  Items
                </p>

                <div className="mt-3 space-y-3">
                  {selectedOrder.items.map(
                    (item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text)]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-[var(--color-text)]">
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  Total
                </span>

                <span className="text-lg font-extrabold text-[var(--color-primary)]">
                  $
                  {selectedOrder.total.toFixed(2)}
                </span>
              </div>

              {/* Status actions */}
              {selectedOrder.status !==
                "CANCELLED" && (
                <div>
                  <p className="text-xs font-bold text-[var(--color-text)]">
                    Update Status
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {(
                      [
                        "CONFIRMED",
                        "PREPARING",
                        "READY",
                        "COMPLETED",
                      ] as OrderStatus[]
                    ).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          updateOrderStatus(
                            selectedOrder.id,
                            status,
                          )
                        }
                        className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${
                          selectedOrder.status ===
                          status
                            ? "bg-[var(--color-primary)] text-white"
                            : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                        }`}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancel */}
              {selectedOrder.status !==
                "CANCELLED" &&
                selectedOrder.status !==
                  "COMPLETED" && (
                  <button
                    type="button"
                    onClick={() =>
                      cancelOrder(
                        selectedOrder.id,
                      )
                    }
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <XCircle size={16} />
                    Cancel Order
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}