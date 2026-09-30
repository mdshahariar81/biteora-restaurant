// src/lib/api/staff.ts

import {
  apiDelete,
  apiGet,
  apiPost,
} from "./client";

export type StaffRole = "OWNER" | "ADMIN" | "WORKER";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  role: Exclude<StaffRole, "OWNER">;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
  };
}

/**
 * Backend API Contract
 *
 * Authentication:
 *
 * POST /api/auth/login
 * POST /api/auth/logout
 *
 * Staff management:
 *
 * GET    /api/staff
 * POST   /api/staff
 * DELETE /api/staff/:id
 *
 * IMPORTANT:
 * - Authentication must be handled by the backend.
 * - Passwords must NEVER be stored or processed as plain text
 *   by the frontend beyond submitting the login/create form.
 * - Backend must use secure password hashing.
 * - Backend must manage secure sessions/tokens.
 * - Backend must enforce role-based authorization.
 * - OWNER permissions must be enforced server-side.
 * - ADMIN/WORKER permissions must be enforced server-side.
 * - Frontend role checks are only for UI visibility.
 */

/**
 * Login.
 */
export async function login(
  payload: LoginPayload,
): Promise<LoginResponse> {
  return apiPost<LoginResponse>(
    "/api/auth/login",
    payload,
  );
}

/**
 * Logout.
 */
export async function logout(): Promise<{ success: boolean }> {
  return apiPost<{ success: boolean }>(
    "/api/auth/logout",
  );
}

/**
 * Get staff members.
 */
export async function getStaff(): Promise<StaffMember[]> {
  return apiGet<StaffMember[]>("/api/staff");
}

/**
 * Create an ADMIN or WORKER.
 *
 * OWNER should be the only role allowed to create staff.
 */
export async function createStaff(
  payload: CreateStaffPayload,
): Promise<StaffMember> {
  return apiPost<StaffMember>("/api/staff", payload);
}

/**
 * Revoke/remove staff access.
 */
export async function revokeStaff(
  id: string,
): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(
    `/api/staff/${id}`,
  );
}