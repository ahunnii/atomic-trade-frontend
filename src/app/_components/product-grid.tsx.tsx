"use client";

import type { Product, Variation } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";

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
        {products?.map((product) => (
          <div key={product.id} className="flex flex-col">
            <div className="relative mb-4 aspect-[3/4]">
              <Image
                src={`${env.NEXT_PUBLIC_STORAGE_URL}/products/${product.featuredImage}`}
                alt={product.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>

            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="mb-4 text-gray-600">
              $
              {product?.variants?.[0]?.priceInCents
                ? product.variants[0].priceInCents / 100
                : 0}
            </p>

            <select
              value={selectedSizes[product.id] ?? ""}
              onChange={(e) => handleSizeChange(product.id, e.target.value)}
              className="mb-4 rounded-md border bg-white p-2"
              aria-label={`Select size for ${product.name}`}
            >
              <option value="">Select Size</option>
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </select>

            <button className="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
