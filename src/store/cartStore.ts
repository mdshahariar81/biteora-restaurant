"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* =========================================================
   CART ITEM TYPE
   ========================================================= */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}


/* =========================================================
   CART STORE TYPE
   ========================================================= */

interface CartStore {
  items: CartItem[];

  addToCart: (
    item: Omit<CartItem, "quantity">,
  ) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;

  removeFromCart: (id: string) => void;

  clearCart: () => void;
}


/* =========================================================
   CART STORE
   ========================================================= */

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      /*
       * Initial cart state.
       */
      items: [],


      /* =====================================================
         ADD PRODUCT
         ===================================================== */

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id,
          );

          /*
           * If product already exists,
           * increase its quantity.
           */
          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      quantity:
                        cartItem.quantity + 1,
                    }
                  : cartItem,
              ),
            };
          }

          /*
           * If product does not exist,
           * add it with quantity = 1.
           */
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: 1,
              },
            ],
          };
        });
      },


      /* =====================================================
         INCREASE QUANTITY
         ===================================================== */

      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        }));
      },


      /* =====================================================
         DECREASE QUANTITY
         ===================================================== */

      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter(
              (item) => item.quantity > 0,
            ),
        }));
      },


      /* =====================================================
         REMOVE PRODUCT
         ===================================================== */

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== id,
          ),
        }));
      },


      /* =====================================================
         CLEAR CART
         ===================================================== */

      clearCart: () => {
        set({
          items: [],
        });
      },
    }),

    /*
     * Persist cart data in browser localStorage.
     *
     * This keeps the cart after page refresh.
     *
     * IMPORTANT:
     * Final order data must later be validated
     * again by the backend.
     */
    {
      name: "biteora-cart",
    },
  ),
);