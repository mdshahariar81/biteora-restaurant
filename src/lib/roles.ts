/*
 * Biteora Role & Permission Configuration
 *
 * These roles are temporary development roles.
 *
 * In production, roles and permissions will come
 * from the authenticated backend/database session.
 */

export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  WORKER: "WORKER",
} as const;

export type UserRole =
  (typeof ROLES)[keyof typeof ROLES];

/*
 * Application permissions.
 *
 * We keep permissions separate from roles so that
 * the system can later become more flexible.
 */
export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",

  ORDERS_VIEW: "orders.view",
  ORDERS_UPDATE: "orders.update",
  ORDERS_CANCEL: "orders.cancel",

  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",

  COUPONS_VIEW: "coupons.view",
  COUPONS_CREATE: "coupons.create",
  COUPONS_UPDATE: "coupons.update",
  COUPONS_DELETE: "coupons.delete",

  CUSTOMERS_VIEW: "customers.view",

  REPORTS_VIEW: "reports.view",

  STAFF_VIEW: "staff.view",
  STAFF_MANAGE: "staff.manage",

  SETTINGS_VIEW: "settings.view",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/*
 * Role → permissions
 *
 * OWNER:
 * Full access.
 *
 * ADMIN:
 * Restaurant management access, but no staff/settings control.
 *
 * WORKER:
 * Operational order access only.
 */
export const ROLE_PERMISSIONS: Record<
  UserRole,
  readonly Permission[]
> = {
  OWNER: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.ORDERS_CANCEL,

    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,

    PERMISSIONS.COUPONS_VIEW,
    PERMISSIONS.COUPONS_CREATE,
    PERMISSIONS.COUPONS_UPDATE,
    PERMISSIONS.COUPONS_DELETE,

    PERMISSIONS.CUSTOMERS_VIEW,

    PERMISSIONS.REPORTS_VIEW,

    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.STAFF_MANAGE,

    PERMISSIONS.SETTINGS_VIEW,
  ],

  ADMIN: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.ORDERS_CANCEL,

    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,

    PERMISSIONS.COUPONS_VIEW,
    PERMISSIONS.COUPONS_CREATE,
    PERMISSIONS.COUPONS_UPDATE,
    PERMISSIONS.COUPONS_DELETE,

    PERMISSIONS.CUSTOMERS_VIEW,

    PERMISSIONS.REPORTS_VIEW,
  ],

  WORKER: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_UPDATE,
  ],
};

/*
 * Check whether a role has a specific permission.
 *
 * This helper can later also be used by backend
 * authorization logic.
 */
export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}