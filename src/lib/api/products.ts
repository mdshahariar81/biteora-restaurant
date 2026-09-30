// src/lib/api/products.ts

import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "./client";

export type ProductCategory =
  | "Combos"
  | "Buckets"
  | "Burgers"
  | "Chicken"
  | "Sides"
  | "Drinks"
  | "Desserts";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  active: boolean;
}

export interface ProductPayload {
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
}

export interface UpdateProductPayload
  extends Partial<ProductPayload> {
  active?: boolean;
}

/**
 * Backend API Contract
 *
 * GET    /api/products
 * POST   /api/products
 * PATCH  /api/products/:id
 * DELETE /api/products/:id
 *
 * IMPORTANT:
 * - Frontend data must never be trusted.
 * - Backend must validate all input.
 * - Backend must sanitize user-provided data.
 * - Backend must verify authentication and authorization.
 * - Backend must perform all database operations.
 * - Backend must verify product prices and availability.
 */

export async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/api/products");
}

export async function createProduct(
  payload: ProductPayload,
): Promise<Product> {
  return apiPost<Product>("/api/products", payload);
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  return apiPatch<Product>(
    `/api/products/${id}`,
    payload,
  );
}

export async function deleteProduct(
  id: string,
): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(
    `/api/products/${id}`,
  );
}