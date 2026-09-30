// src/lib/api/orders.ts

import {
  apiGet,
  apiPatch,
} from "./client";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type OrderType =
  | "DINE_IN"
  | "TAKEAWAY";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: number;
  items: OrderItem[];
  subtotal: number;
  packagingFee: number;
  discount: number;
  total: number;
  couponCode?: string | null;
  paymentMethod: string;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Backend API Contract
 *
 * GET   /api/orders
 * PATCH /api/orders/:id
 *
 * Backend may expose a dedicated cancellation endpoint,
 * or handle cancellation through the PATCH operation.
 *
 * IMPORTANT:
 * - Frontend order data must never be trusted.
 * - Backend must verify authentication and authorization.
 * - Backend must verify product prices and availability.
 * - Backend must recalculate subtotal, discount,
 *   packaging fee and total server-side.
 * - Backend must validate order status transitions.
 * - Backend must protect customer information.
 */

/**
 * Get orders.
 */
export async function getOrders(): Promise<Order[]> {
  return apiGet<Order[]>("/api/orders");
}

/**
 * Update an order.
 *
 * Example:
 * updateOrder("ORD-001", { status: "PREPARING" })
 */
export async function updateOrder(
  id: string,
  payload: Partial<Pick<Order, "status">>,
): Promise<Order> {
  return apiPatch<Order>(`/api/orders/${id}`, payload);
}

/**
 * Cancel an order.
 *
 * Uses the same PATCH endpoint for now.
 * If the backend developer creates a dedicated
 * cancellation endpoint later, only this function
 * needs to be changed.
 */
export async function cancelOrder(
  id: string,
): Promise<Order> {
  return apiPatch<Order>(`/api/orders/${id}`, {
    status: "CANCELLED",
  });
}