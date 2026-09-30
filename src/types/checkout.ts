/* =========================================================
   CHECKOUT TYPES
   =========================================================
   These types define the data structure used by the
   checkout form and future backend API.

   IMPORTANT:
   These types are frontend contracts only.
   The backend must validate everything again.
   ========================================================= */

export type OrderType = "dine-in" | "takeaway";

export type PaymentMethod = "cash" | "online";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  orderType: OrderType;
  tableNumber: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface CreateOrderPayload {
  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };

  orderType: OrderType;

  tableNumber?: string;

  paymentMethod: PaymentMethod;

  notes?: string;

  items: {
    productId: string;
    quantity: number;
  }[];

  /*
   * Frontend can send these values for display/integration,
   * but backend MUST NOT trust them.
   *
   * Backend should retrieve prices from its own database
   * and calculate the final amount server-side.
   */
  clientSubtotal: number;
  clientPackagingFee: number;
  clientTotal: number;
}