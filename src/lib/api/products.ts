import { apiDelete, apiGet, apiPatch, apiPost } from "./client";

/**
 * Product categories are dynamic.
 *
 * Backend/database will control the available categories.
 */
export type ProductCategory = string;

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
 * GET /api/products
 */
export async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/api/products");
}

/**
 * POST /api/products
 */
export async function createProduct(
  payload: ProductPayload,
): Promise<Product> {
  return apiPost<Product>("/api/products", payload);
}

/**
 * PATCH /api/products/:id
 */
export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  return apiPatch<Product>(
    `/api/products/${id}`,
    payload,
  );
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(
  id: string,
): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(
    `/api/products/${id}`,
  );
}