"use client";

import type { Product, Variation } from "@prisma/client";

import { cn } from "~/lib/utils";
import { ProductCard } from "./product-card";
type Props = {
  products: (Product & { variants: Variation[] })[];
  className?: string;
};
export function ProductGrid({ products, className }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {products?.map((product) => {
        const lowestPrice = Math.min(
          ...product.variants.map((v) => v.priceInCents ?? 0),
        );
        const lowestCompareAtPrice = Math.min(
          ...product.variants.map((v) => v.compareAtPriceInCents ?? 0),
        );

        // Check if there are different prices among variants
        const hasSale = product.variants.some(
          (v) =>
            v.compareAtPriceInCents && v.compareAtPriceInCents > v.priceInCents,
        );

        // Check if there are multiple different prices
        const uniquePrices = new Set(
          product.variants.map((v) => v.priceInCents),
        );
        const hasDifferentPrices = uniquePrices.size > 1;
        return (
          <ProductCard
            key={product.id}
            product={product}
            lowestPrice={lowestPrice}
            lowestCompareAtPrice={lowestCompareAtPrice}
            hasSale={hasSale}
            hasDifferentPrices={hasDifferentPrices}
          />
        );
      })}
    </div>
  );
}
