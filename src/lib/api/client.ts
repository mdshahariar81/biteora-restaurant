/**
 * Biteora API Client
 *
 * Frontend-only API wrapper.
 *
 * IMPORTANT:
 * - Backend/database is handled by the backend developer.
 * - Do not put secrets/API keys in this file.
 * - Backend must always revalidate authentication,
 *   authorization, input, prices, totals, etc.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

interface ApiRequestOptions extends RequestInit {
  body?: BodyInit | null;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic API request helper.
 *
 * Usage:
 *   apiRequest<Product[]>("/api/products")
 *   apiRequest<Product>("/api/products/123", { method: "PATCH", ... })
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  /**
   * Only set JSON content type when a request body exists
   * and the body is not FormData.
   */
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  let data: unknown = null;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    throw new ApiError(
      errorData?.message ||
        errorData?.error ||
        `Request failed with status ${response.status}`,
      response.status,
      data,
    );
  }

  return data as T;
}

/**
 * GET request
 */
export function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "GET",
  });
}

/**
 * POST request
 */
export function apiPost<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/**
 * PATCH request
 */
export function apiPatch<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
  });
}