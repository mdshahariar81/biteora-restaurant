// src/lib/api/products.ts

export interface ProductPayload {
  name: string;
  category:
    | "Combos"
    | "Buckets"
    | "Burgers"
    | "Chicken"
    | "Sides"
    | "Drinks"
    | "Desserts";
  price: number;
  image: string;
  description: string;
  active: boolean;
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
 * Frontend data must never be trusted.
 * Backend must validate, sanitize, authorize,
 * and perform all database operations.
 */

// TODO: Backend integration
export async function getProducts() {
  // const response = await fetch("/api/products");
  // if (!response.ok) {
  //   throw new Error("Failed to fetch products");
  // }
  // return response.json();

  return null;
}

// TODO: Backend integration
export async function createProduct(payload: ProductPayload) {
  // const response = await fetch("/api/products", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(payload),
  // });
  //
  // if (!response.ok) {
  //   throw new Error("Failed to create product");
  // }
  //
  // return response.json();

  return null;
}

// TODO: Backend integration
export async function updateProduct(
  id: string,
  payload: Partial<ProductPayload>,
) {
  // const response = await fetch(`/api/products/${id}`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(payload),
  // });
  //
  // if (!response.ok) {
  //   throw new Error("Failed to update product");
  // }
  //
  // return response.json();

  return null;
}

// TODO: Backend integration
export async function deleteProduct(id: string) {
  // const response = await fetch(`/api/products/${id}`, {
  //   method: "DELETE",
  // });
  //
  // if (!response.ok) {
  //   throw new Error("Failed to delete product");
  // }
  //
  // return response.json();

  return null;
}