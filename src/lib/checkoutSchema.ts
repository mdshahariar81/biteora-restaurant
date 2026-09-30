import { z } from "zod";

/* =========================================================
   CHECKOUT VALIDATION
   =========================================================
   This validation improves frontend UX.

   IMPORTANT:
   Frontend validation is NOT a security boundary.

   Backend must validate the same information again.
   ========================================================= */

export const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(80, "Name must be 80 characters or less."),

    phone: z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number.")
      .max(20, "Phone number is too long.")
      .regex(
        /^[0-9+\-\s()]+$/,
        "Please enter a valid phone number.",
      ),

    email: z
      .string()
      .trim()
      .max(120, "Email is too long.")
      .refine(
        (value) =>
          value === "" ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Please enter a valid email address.",
      ),

    orderType: z.enum(["dine-in", "takeaway"]),

    tableNumber: z
      .string()
      .trim()
      .max(10, "Table number is too long.")
      .regex(
        /^\d*$/,
        "Table number must contain numbers only.",
      ),

    paymentMethod: z.enum(["cash", "online"]),

    notes: z
      .string()
      .trim()
      .max(300, "Notes must be 300 characters or less."),
  })
  .superRefine((data, context) => {
    /*
     * Table number is required only for dine-in orders.
     */

    if (
      data.orderType === "dine-in" &&
      data.tableNumber.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tableNumber"],
        message: "Please enter your table number.",
      });
    }
  });

export type CheckoutSchemaData = z.infer<
  typeof checkoutSchema
>;