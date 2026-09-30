// src/lib/api/customers.ts

import {
  apiGet,
  apiPatch,
} from "./client";

export type CustomerStatus = "ACTIVE" | "INACTIVE";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStatusPayload {
  status: CustomerStatus;
}

/**
 * Backend API Contract
 *
 * GET   /api/customers
 * GET   /api/customers/:id
 * PATCH /api/customers/:id/status
 *
 * IMPORTANT:
 * - Backend must enforce authentication and authorization.
 * - Customer information must be protected server-side.
 * - Backend must handle pagination/filtering for large datasets.
 * - totalOrders and totalSpent must come from backend/database data.
 * - Frontend must never be treated as the source of truth.
 */

/**
 * Get customers.
 */
export async function getCustomers(): Promise<Customer[]> {
  return apiGet<Customer[]>("/api/customers");
}

/**
 * Get a single customer.
 */
export async function getCustomer(
  id: string,
): Promise<Customer> {
  return apiGet<Customer>(`/api/customers/${id}`);
}

/**
 * Update customer status.
 */
export async function updateCustomerStatus(
  id: string,
  payload: CustomerStatusPayload,
): Promise<Customer> {
  return apiPatch<Customer>(
    `/api/customers/${id}/status`,
    payload,
  );
}