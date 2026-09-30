// src/lib/api/reports.ts

import { apiGet } from "./client";

export type ReportRange =
  | "7days"
  | "30days"
  | "90days";

export interface ReportSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrder: number;
  completionRate: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface ProductSalesData {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface OrderStatusData {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  count: number;
}

export interface ReportsSummaryResponse {
  summary: ReportSummary;
}

export interface ReportsRevenueResponse {
  data: RevenueData[];
}

export interface ReportsProductsResponse {
  data: ProductSalesData[];
}

export interface ReportsOrdersResponse {
  data: OrderStatusData[];
}

/**
 * Backend API Contract
 *
 * GET /api/reports/summary?range=7days
 * GET /api/reports/revenue?range=7days
 * GET /api/reports/products?range=7days
 * GET /api/reports/orders?range=7days
 *
 * IMPORTANT:
 * - Backend must calculate all financial data.
 * - Revenue must come from authoritative order data.
 * - Cancelled orders must be handled correctly.
 * - Frontend must never calculate authoritative revenue.
 * - Backend must enforce authentication and authorization.
 */

/**
 * Get report summary.
 */
export async function getReportSummary(
  range: ReportRange = "7days",
): Promise<ReportsSummaryResponse> {
  return apiGet<ReportsSummaryResponse>(
    `/api/reports/summary?range=${range}`,
  );
}

/**
 * Get revenue data.
 */
export async function getRevenueReport(
  range: ReportRange = "7days",
): Promise<ReportsRevenueResponse> {
  return apiGet<ReportsRevenueResponse>(
    `/api/reports/revenue?range=${range}`,
  );
}

/**
 * Get top-selling products.
 */
export async function getProductSalesReport(
  range: ReportRange = "7days",
): Promise<ReportsProductsResponse> {
  return apiGet<ReportsProductsResponse>(
    `/api/reports/products?range=${range}`,
  );
}

/**
 * Get order status breakdown.
 */
export async function getOrderStatusReport(
  range: ReportRange = "7days",
): Promise<ReportsOrdersResponse> {
  return apiGet<ReportsOrdersResponse>(
    `/api/reports/orders?range=${range}`,
  );
}