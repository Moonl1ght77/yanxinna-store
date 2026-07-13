"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import { CartItem } from "@/types/cart";

type AddCartInput = Omit<CartItem, "cartItemId" | "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (input: AddCartInput) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

const storageKey = "aurelle-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem: (input) => {
        setItems((current) => {
          const existing = current.find(
            (item) =>
              item.productId === input.productId &&
              item.color === input.color &&
              item.size === input.size
          );

          if (existing) {
            return current.map((item) =>
              item.cartItemId === existing.cartItemId
                ? { ...item, quantity: item.quantity + (input.quantity ?? 1) }
                : item
            );
          }

          return [
            ...current,
            {
              ...input,
              quantity: input.quantity ?? 1,
              cartItemId: `${input.productId}-${input.color}-${input.size}`
            }
          ];
        });
      },
      updateQuantity: (cartItemId, quantity) => {
        setItems((current) =>
          current
            .map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (cartItemId) => {
        setItems((current) => current.filter((item) => item.cartItemId !== cartItemId));
      },
      clearCart: () => setItems([])
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
