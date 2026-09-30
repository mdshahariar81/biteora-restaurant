// src/lib/api/categories.ts

import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "./client";

export interface Category {
  id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  active?: boolean;
}

/**
 * Backend API Contract
 *
 * GET    /api/categories
 * POST   /api/categories
 * PATCH  /api/categories/:id
 * DELETE /api/categories/:id
 *
 * IMPORTANT:
 * - Backend must authenticate the current user.
 * - Only authorized dashboard users should manage categories.
 * - Backend must validate and sanitize category names.
 * - Category names should be unique.
 * - Backend must prevent deletion of categories
 *   that are still being used by products, or handle
 *   the reassignment/deactivation safely.
 * - Database operations must be handled by the backend.
 */

export async function getCategories(): Promise<Category[]> {
  return apiGet<Category[]>("/api/categories");
}

export async function createCategory(
  payload: CategoryPayload,
): Promise<Category> {
  return apiPost<Category>("/api/categories", payload);
}

export async function updateCategory(
  id: string,
  payload: CategoryPayload,
): Promise<Category> {
  return apiPatch<Category>(
    `/api/categories/${id}`,
    payload,
  );
}

export async function deleteCategory(
  id: string,
): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(
    `/api/categories/${id}`,
  );
}