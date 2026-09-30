import { apiRequest } from "./client";

export interface ProductImageUploadResponse {
  url: string;
}

/**
 * Upload a product image.
 *
 * Backend API Contract:
 *
 * POST /api/uploads/products
 *
 * Request:
 * multipart/form-data
 * field: "file"
 *
 * Response:
 * {
 *   "url": "https://..."
 * }
 *
 * Backend responsibilities:
 * - Authentication
 * - Owner/Admin authorization
 * - File type validation
 * - File size validation
 * - Secure filename generation
 * - Image processing/storage
 * - Malware/security checks where applicable
 * - Return permanent public image URL
 */
export async function uploadProductImage(
  file: File,
): Promise<ProductImageUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest<ProductImageUploadResponse>(
    "/api/uploads/products",
    {
      method: "POST",
      body: formData,
    },
  );
}