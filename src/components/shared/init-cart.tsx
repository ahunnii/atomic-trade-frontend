"use client";
import { useEffect } from "react";

export function InitCart() {
  useEffect(() => {
    const ensureCart = async () => {
      const cartId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("cartId="));

      if (!cartId) {
        await fetch("/api/cart/init");
      }
    };

    void ensureCart();
  }, []);

  return null;
}
