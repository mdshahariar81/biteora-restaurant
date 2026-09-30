"use client";

import { FormEvent, useState } from "react";
import {
  Bell,
  Building2,
  Check,
  Clock3,
  CreditCard,
  LockKeyhole,
  Save,
  ShieldCheck,
  Store,
} from "lucide-react";

interface RestaurantSettings {
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
}

interface OrderSettings {
  acceptOrders: boolean;
  allowDineIn: boolean;
  allowTakeaway: boolean;
  autoConfirmOrders: boolean;
}

interface NotificationSettings {
  newOrder: boolean;
  orderStatus: boolean;
  lowStock: boolean;
  dailyReport: boolean;
}

const INITIAL_RESTAURANT_SETTINGS: RestaurantSettings = {
  restaurantName: "Biteora",
  email: "hello@biteora.com",
  phone: "+1 555 123 4567",
  address: "123 Main Street, City Center",
  currency: "USD",
  timezone: "UTC",
};

const INITIAL_ORDER_SETTINGS: OrderSettings = {
  acceptOrders: true,
  allowDineIn: true,
  allowTakeaway: true,
  autoConfirmOrders: false,
};

const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  newOrder: true,
  orderStatus: true,
  lowStock: true,
  dailyReport: false,
};

export default function SettingsPage() {
  const [restaurantSettings, setRestaurantSettings] =
    useState<RestaurantSettings>(
      INITIAL_RESTAURANT_SETTINGS,
    );

  const [orderSettings, setOrderSettings] =
    useState<OrderSettings>(
      INITIAL_ORDER_SETTINGS,
    );

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(
      INITIAL_NOTIFICATION_SETTINGS,
    );

  const [message, setMessage] = useState("");

  function handleRestaurantSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(
      "Restaurant settings saved successfully.",
    );

    /*
      Production API:

      PATCH /api/settings/restaurant

      Backend responsibilities:
      - Authentication
      - OWNER/ADMIN authorization
      - Server-side validation
      - Persist settings in database
    */
  }

  function handleOrderSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(
      "Order settings saved successfully.",
    );

    /*
      Production API:

      PATCH /api/settings/orders
    */
  }

  function handleNotificationSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(
      "Notification settings saved successfully.",
    );

    /*
      Production API:

      PATCH /api/settings/notifications
    */
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          Dashboard Configuration
        </p>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Settings
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          Manage restaurant information, ordering
          preferences and notifications.
        </p>
      </div>

      {/* Success message */}
      {message && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
          <Check size={15} />
          {message}
        </div>
      )}

      {/* Restaurant information */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
            <Building2 size={18} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Restaurant Information
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Basic information displayed across the
              restaurant platform.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleRestaurantSave}
          className="space-y-5 p-5 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Restaurant name */}
            <div>
              <label
                htmlFor="restaurant-name"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Restaurant name
              </label>

              <input
                id="restaurant-name"
                type="text"
                value={
                  restaurantSettings.restaurantName
                }
                onChange={(event) =>
                  setRestaurantSettings(
                    (current) => ({
                      ...current,
                      restaurantName:
                        event.target.value,
                    }),
                  )
                }
                maxLength={100}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="restaurant-email"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Email
              </label>

              <input
                id="restaurant-email"
                type="email"
                value={restaurantSettings.email}
                onChange={(event) =>
                  setRestaurantSettings(
                    (current) => ({
                      ...current,
                      email: event.target.value,
                    }),
                  )
                }
                maxLength={150}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="restaurant-phone"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Phone
              </label>

              <input
                id="restaurant-phone"
                type="tel"
                value={restaurantSettings.phone}
                onChange={(event) =>
                  setRestaurantSettings(
                    (current) => ({
                      ...current,
                      phone: event.target.value,
                    }),
                  )
                }
                maxLength={30}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="mb-2 block text-xs font-bold text-[var(--color-text)]"
              >
                Currency
              </label>

              <select
                id="currency"
                value={restaurantSettings.currency}
                onChange={(event) =>
                  setRestaurantSettings(
                    (current) => ({
                      ...current,
                      currency:
                        event.target.value,
                    }),
                  )
                }
                className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)]"
              >
                <option value="USD">
                  USD — US Dollar
                </option>

                <option value="EUR">
                  EUR — Euro
                </option>

                <option value="GBP">
                  GBP — British Pound
                </option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="restaurant-address"
              className="mb-2 block text-xs font-bold text-[var(--color-text)]"
            >
              Restaurant address
            </label>

            <textarea
              id="restaurant-address"
              rows={3}
              value={restaurantSettings.address}
              onChange={(event) =>
                setRestaurantSettings(
                  (current) => ({
                    ...current,
                    address: event.target.value,
                  }),
                )
              }
              maxLength={300}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Timezone */}
          <div>
            <label
              htmlFor="timezone"
              className="mb-2 block text-xs font-bold text-[var(--color-text)]"
            >
              Timezone
            </label>

            <select
              id="timezone"
              value={restaurantSettings.timezone}
              onChange={(event) =>
                setRestaurantSettings(
                  (current) => ({
                    ...current,
                    timezone:
                      event.target.value,
                  }),
                )
              }
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary)]"
            >
              <option value="UTC">
                UTC
              </option>

              <option value="Asia/Dhaka">
                Asia/Dhaka
              </option>

              <option value="Asia/Shanghai">
                Asia/Shanghai
              </option>

              <option value="America/New_York">
                America/New_York
              </option>

              <option value="Europe/London">
                Europe/London
              </option>
            </select>
          </div>

          <SaveButton />
        </form>
      </section>

      {/* Order settings */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
            <Store size={18} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Order Settings
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Control how customers can place orders.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleOrderSave}
          className="divide-y divide-[var(--color-border)]"
        >
          <SettingToggle
            label="Accept new orders"
            description="Allow customers to place new orders."
            checked={orderSettings.acceptOrders}
            onChange={(checked) =>
              setOrderSettings((current) => ({
                ...current,
                acceptOrders: checked,
              }))
            }
          />

          <SettingToggle
            label="Dine-in orders"
            description="Allow customers to select dine-in ordering."
            checked={orderSettings.allowDineIn}
            onChange={(checked) =>
              setOrderSettings((current) => ({
                ...current,
                allowDineIn: checked,
              }))
            }
          />

          <SettingToggle
            label="Takeaway orders"
            description="Allow customers to select takeaway ordering."
            checked={orderSettings.allowTakeaway}
            onChange={(checked) =>
              setOrderSettings((current) => ({
                ...current,
                allowTakeaway: checked,
              }))
            }
          />

          <SettingToggle
            label="Auto-confirm orders"
            description="Automatically confirm newly received orders."
            checked={orderSettings.autoConfirmOrders}
            onChange={(checked) =>
              setOrderSettings((current) => ({
                ...current,
                autoConfirmOrders: checked,
              }))
            }
          />

          <div className="p-5">
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)]"
            >
              <Save size={16} />
              Save Order Settings
            </button>
          </div>
        </form>
      </section>

      {/* Notifications */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
            <Bell size={18} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Notifications
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Choose which dashboard notifications are enabled.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleNotificationSave}
          className="divide-y divide-[var(--color-border)]"
        >
          <SettingToggle
            label="New order notifications"
            description="Notify staff when a new order is received."
            checked={notificationSettings.newOrder}
            onChange={(checked) =>
              setNotificationSettings(
                (current) => ({
                  ...current,
                  newOrder: checked,
                }),
              )
            }
          />

          <SettingToggle
            label="Order status notifications"
            description="Notify when an order status changes."
            checked={notificationSettings.orderStatus}
            onChange={(checked) =>
              setNotificationSettings(
                (current) => ({
                  ...current,
                  orderStatus: checked,
                }),
              )
            }
          />

          <SettingToggle
            label="Low stock notifications"
            description="Notify staff when products need attention."
            checked={notificationSettings.lowStock}
            onChange={(checked) =>
              setNotificationSettings(
                (current) => ({
                  ...current,
                  lowStock: checked,
                }),
              )
            }
          />

          <SettingToggle
            label="Daily report"
            description="Receive a daily restaurant performance summary."
            checked={notificationSettings.dailyReport}
            onChange={(checked) =>
              setNotificationSettings(
                (current) => ({
                  ...current,
                  dailyReport: checked,
                }),
              )
            }
          />

          <div className="p-5">
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)]"
            >
              <Save size={16} />
              Save Notification Settings
            </button>
          </div>
        </form>
      </section>

      {/* Security */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Security
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Security-related account controls.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <LockKeyhole
                size={18}
                className="mt-0.5 text-[var(--color-text-muted)]"
              />

              <div>
                <p className="text-sm font-bold text-[var(--color-text)]">
                  Change password
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Update the current account password.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="h-10 rounded-xl border border-[var(--color-border)] px-4 text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
            >
              Change Password
            </button>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <p className="text-xs font-bold text-blue-800">
                Backend security required
              </p>

              <p className="mt-1 text-[11px] leading-5 text-blue-700">
                Authentication, authorization, password
                hashing, session management and permission
                checks must be enforced on the backend.
                Frontend controls are not security boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business hours placeholder */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
            <Clock3 size={18} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Business Hours
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Restaurant opening and closing schedule.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] p-5">
            <p className="text-sm font-bold text-[var(--color-text)]">
              Business hours configuration
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
              The backend can later provide per-day opening,
              closing, break hours and holiday schedules.
            </p>
          </div>
        </div>
      </section>

      {/* Payment information */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
            <CreditCard size={18} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Payment Configuration
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Payment provider configuration will be handled by
              the backend.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-bold text-blue-800">
              Backend integration required
            </p>

            <p className="mt-1 text-[11px] leading-5 text-blue-700">
              Payment provider keys, webhook verification,
              transaction validation and payment status must
              never be trusted from the frontend.
            </p>
          </div>
        </div>
      </section>

      {/* Backend contract */}
      {/*
        Production API contract:

        GET  /api/settings
        PATCH /api/settings/restaurant
        PATCH /api/settings/orders
        PATCH /api/settings/notifications
        PATCH /api/settings/business-hours

        Security:
        - Only authorized OWNER/ADMIN users can modify
          permitted settings.
        - Backend must validate every field.
        - Frontend values are never trusted.
        - Sensitive payment credentials must remain
          server-side.
      */}
    </div>
  );
}

function SaveButton() {
  return (
    <button
      type="submit"
      className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white hover:bg-[var(--color-primary-hover)]"
    >
      <Save size={16} />
      Save Restaurant Settings
    </button>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 p-5">
      <div>
        <p className="text-sm font-bold text-[var(--color-text)]">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[var(--color-primary)]"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}