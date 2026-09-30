// src/lib/api/coupons.ts

import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "./client";

export type CouponType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  expiresAt: string;
  usageLimit: number | null;
  usageCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  expiresAt: string;
  usageLimit: number | null;
  active: boolean;
}

/**
 * Backend API Contract
 *
 * GET    /api/coupons
 * POST   /api/coupons
 * PATCH  /api/coupons/:id
 * DELETE /api/coupons/:id
 *
 * IMPORTANT:
 * - Backend must validate coupon data.
 * - Backend must normalize/validate coupon codes.
 * - Backend must prevent duplicate coupon codes.
 * - Backend must verify expiry dates.
 * - Backend must verify usage limits.
 * - Backend must validate discount values.
 * - Backend must verify minimum order requirements.
 * - Backend must verify customer eligibility when applicable.
 * - Backend must calculate the final discount server-side.
 * - Frontend coupon values must never be trusted.
 */

/**
 * Get all coupons.
 */
export async function getCoupons(): Promise<Coupon[]> {
  return apiGet<Coupon[]>("/api/coupons");
}

/**
 * Create a new coupon.
 */
export async function createCoupon(
  payload: CouponPayload,
): Promise<Coupon> {
  return apiPost<Coupon>("/api/coupons", payload);
}

/**
 * Update an existing coupon.
 */
export async function updateCoupon(
  id: string,
  payload: Partial<CouponPayload>,
): Promise<Coupon> {
  return apiPatch<Coupon>(`/api/coupons/${id}`, payload);
}

/**
 * Delete a coupon.
 */
export async function deleteCoupon(
  id: string,
): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(
    `/api/coupons/${id}`,
  );
}