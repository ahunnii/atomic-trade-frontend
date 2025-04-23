"use client";

import type { Product, Variation } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
}: {
  products: (Product & { variants: Variation[] })[];
}) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h2 className="mb-8 text-center text-2xl font-bold">BEST SELLERS</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
              v.compareAtPriceInCents &&
              v.compareAtPriceInCents > v.priceInCents,
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
    </div>
  );
}
