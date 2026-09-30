"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  Mail,
  Phone,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

type CustomerStatus = "active" | "inactive";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
  joinedDate: string;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "customer-001",
    name: "Sarah Khan",
    email: "sarah.khan@example.com",
    phone: "+1 555 201 4587",
    status: "active",
    ordersCount: 12,
    totalSpent: 184.5,
    lastOrderDate: "2026-09-28",
    joinedDate: "2026-05-14",
  },
  {
    id: "customer-002",
    name: "Rafiul Islam",
    email: "rafiul.islam@example.com",
    phone: "+1 555 302 7812",
    status: "active",
    ordersCount: 8,
    totalSpent: 126.0,
    lastOrderDate: "2026-09-26",
    joinedDate: "2026-06-02",
  },
  {
    id: "customer-003",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    phone: "+1 555 418 2290",
    status: "active",
    ordersCount: 19,
    totalSpent: 312.75,
    lastOrderDate: "2026-09-29",
    joinedDate: "2026-03-21",
  },
  {
    id: "customer-004",
    name: "Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    phone: "+1 555 509 6321",
    status: "inactive",
    ordersCount: 4,
    totalSpent: 58.0,
    lastOrderDate: "2026-07-18",
    joinedDate: "2026-04-09",
  },
  {
    id: "customer-005",
    name: "Fariah Rahman",
    email: "fariah.rahman@example.com",
    phone: "+1 555 615 9044",
    status: "active",
    ordersCount: 15,
    totalSpent: 241.25,
    lastOrderDate: "2026-09-25",
    joinedDate: "2026-02-17",
  },
  {
    id: "customer-006",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 555 721 3456",
    status: "active",
    ordersCount: 6,
    totalSpent: 94.5,
    lastOrderDate: "2026-09-20",
    joinedDate: "2026-07-11",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] =
    useState<Customer[]>(INITIAL_CUSTOMERS);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | "Active" | "Inactive"
    >("All");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          customer.status === "active") ||
        (statusFilter === "Inactive" &&
          customer.status === "inactive");

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCustomers = customers.filter(
    (customer) => customer.status === "active",
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "inactive",
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) =>
      total + customer.ordersCount,
    0,
  );

  const totalRevenue = customers.reduce(
    (total, customer) =>
      total + customer.totalSpent,
    0,
  );

  function toggleCustomerStatus(
    customerId: string,
  ) {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              status:
                customer.status === "active"
                  ? "inactive"
                  : "active",
            }
          : customer,
      ),
    );
  }

  function formatDate(date: string | null) {
    if (!date) return "No orders yet";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          Restaurant Management
        </p>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Customers
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          View customer accounts, order activity and
          spending history.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              Total Customers
            </p>

            <UserRound
              size={18}
              className="text-[var(--color-text-muted)]"
            />
          </div>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            {customers.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              Active
            </p>

            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>

          <p className="mt-3 text-2xl font-extrabold text-green-600">
            {activeCustomers}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              Total Orders
            </p>

            <ShoppingBag
              size={18}
              className="text-[var(--color-text-muted)]"
            />
          </div>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Customer Revenue
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">
            ${totalRevenue.toFixed(2)}
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
              placeholder="Search by name, email or phone..."
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
              All customers
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

      {/* Customer table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-left">
                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Customer
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Contact
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Orders
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Total Spent
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Last Order
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  View
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]"
                >
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-background)] text-sm font-extrabold text-[var(--color-primary)]">
                        {customer.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[var(--color-text)]">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          Joined{" "}
                          {formatDate(
                            customer.joinedDate,
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                        <Mail size={13} />
                        {customer.email}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                        <Phone size={13} />
                        {customer.phone}
                      </div>
                    </div>
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                    {customer.ordersCount}
                  </td>

                  {/* Total spent */}
                  <td className="px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                    ${customer.totalSpent.toFixed(2)}
                  </td>

                  {/* Last order */}
                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    {formatDate(
                      customer.lastOrderDate,
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        toggleCustomerStatus(
                          customer.id,
                        )
                      }
                      className={`rounded-full px-3 py-1 text-[10px] font-bold transition ${
                        customer.status === "active"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {customer.status ===
                      "active"
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>

                  {/* View */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCustomer(
                            customer,
                          )
                        }
                        aria-label={`View ${customer.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-10 text-center">
            <UserRound
              size={28}
              className="mx-auto text-[var(--color-text-muted)]"
            />

            <p className="mt-3 text-sm font-bold text-[var(--color-text)]">
              No customers found
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Try another search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Customer details modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Customer Details
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[var(--color-text)]">
                  {selectedCustomer.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-background)]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Profile */}
              <div className="flex items-center gap-4 rounded-2xl bg-[var(--color-background)] p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-lg font-extrabold text-[var(--color-primary)] shadow-sm">
                  {selectedCustomer.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[var(--color-text)]">
                    {selectedCustomer.name}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Customer ID:{" "}
                    {selectedCustomer.id}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Mail size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Email
                    </span>
                  </div>

                  <p className="mt-2 break-all text-sm font-semibold text-[var(--color-text)]">
                    {selectedCustomer.email}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Phone size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Phone
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                    {selectedCustomer.phone}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--color-border)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Total Orders
                  </p>

                  <p className="mt-2 text-xl font-extrabold text-[var(--color-text)]">
                    {selectedCustomer.ordersCount}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Total Spent
                  </p>

                  <p className="mt-2 text-xl font-extrabold text-[var(--color-text)]">
                    $
                    {selectedCustomer.totalSpent.toFixed(
                      2,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Last Order
                  </p>

                  <p className="mt-2 text-sm font-bold text-[var(--color-text)]">
                    {formatDate(
                      selectedCustomer.lastOrderDate,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Joined
                  </p>

                  <p className="mt-2 text-sm font-bold text-[var(--color-text)]">
                    {formatDate(
                      selectedCustomer.joinedDate,
                    )}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] p-4">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">
                    Account Status
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Control customer account availability.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toggleCustomerStatus(
                      selectedCustomer.id,
                    );

                    setSelectedCustomer(
                      (current) =>
                        current
                          ? {
                              ...current,
                              status:
                                current.status ===
                                "active"
                                  ? "inactive"
                                  : "active",
                            }
                          : null,
                    );
                  }}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                    selectedCustomer.status ===
                    "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {selectedCustomer.status ===
                  "active"
                    ? "Active"
                    : "Inactive"}
                </button>
              </div>

              {/* Backend note */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-[11px] leading-5 text-blue-700">
                  Customer data is currently using
                  temporary frontend data. Production
                  customer records will come from the
                  backend API.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="h-11 w-full rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backend API contract */}
      {/*
        Production API contract:

        GET /api/customers
        GET /api/customers/:id
        PATCH /api/customers/:id/status

        Backend responsibilities:
        - Authentication
        - Authorization
        - Database queries
        - Customer privacy/access control
        - Server-side validation
        - Pagination
        - Search/filter validation
        - Order aggregation
        - Total spending calculation

        IMPORTANT:
        The frontend must never be trusted for
        customer status, order count or spending.
      */}
    </div>
  );
}