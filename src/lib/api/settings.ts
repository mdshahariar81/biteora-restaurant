// src/lib/api/settings.ts

import {
  apiGet,
  apiPatch,
} from "./client";

export interface RestaurantSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
}

export interface OrderSettings {
  acceptOrders: boolean;
  dineIn: boolean;
  takeaway: boolean;
  autoConfirm: boolean;
}

export interface NotificationSettings {
  newOrder: boolean;
  orderStatus: boolean;
  lowStock: boolean;
  dailyReport: boolean;
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

/**
 * Backend API Contract
 *
 * GET /api/settings
 *
 * PATCH /api/settings/restaurant
 * PATCH /api/settings/orders
 * PATCH /api/settings/notifications
 * PATCH /api/settings/business-hours
 *
 * IMPORTANT:
 * - Backend must authenticate the current user.
 * - Backend must authorize access based on role.
 * - Settings must be stored and retrieved from the backend/database.
 * - Frontend values must be validated again on the server.
 * - Sensitive payment configuration must never be exposed
 *   through unsafe frontend environment variables.
 */

export interface SettingsResponse {
  restaurant: RestaurantSettings;
  orders: OrderSettings;
  notifications: NotificationSettings;
  businessHours: BusinessHours;
}

/**
 * Get all restaurant settings.
 */
export async function getSettings(): Promise<SettingsResponse> {
  return apiGet<SettingsResponse>("/api/settings");
}

/**
 * Update restaurant information.
 */
export async function updateRestaurantSettings(
  payload: Partial<RestaurantSettings>,
): Promise<RestaurantSettings> {
  return apiPatch<RestaurantSettings>(
    "/api/settings/restaurant",
    payload,
  );
}

/**
 * Update order settings.
 */
export async function updateOrderSettings(
  payload: Partial<OrderSettings>,
): Promise<OrderSettings> {
  return apiPatch<OrderSettings>(
    "/api/settings/orders",
    payload,
  );
}

/**
 * Update notification settings.
 */
export async function updateNotificationSettings(
  payload: Partial<NotificationSettings>,
): Promise<NotificationSettings> {
  return apiPatch<NotificationSettings>(
    "/api/settings/notifications",
    payload,
  );
}

/**
 * Update business hours.
 */
export async function updateBusinessHours(
  payload: Partial<BusinessHours>,
): Promise<BusinessHours> {
  return apiPatch<BusinessHours>(
    "/api/settings/business-hours",
    payload,
  );
}