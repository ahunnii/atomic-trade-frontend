import type { Product, Variation } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { env } from "~/env";
import { getCartId } from "~/server/actions/cart";
import { api } from "~/trpc/react";
import { formatCurrency } from "~/utils/format-currency";
import { AddToCartButton } from "./add-to-cart-button";

type Props = {
  product: Product & { variants: Variation[] };
  hasSale?: boolean;
  lowestPrice?: number;
  lowestCompareAtPrice?: number;
  hasDifferentPrices?: boolean;
};

export function ProductCard({
  product,
  hasSale,
  hasDifferentPrices,
  lowestPrice,
  lowestCompareAtPrice,
}: Props) {
  // const apiUtils = api.useUtils();
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null,
  );

  // const updateCart = api.cart.update.useMutation({
  //   onSuccess: () => {
  //     void apiUtils.cart.invalidate();
  //   },
  // });

  // const addToCart = async () => {
  //   const cartId = await getCartId();
  //   await updateCart.mutateAsync({
  //     cartId,
  //     variantId: selectedVariant?.id ?? "",
  //     quantity: 1,
  //   });
  // };

  return (
    <div className="flex flex-col">
      <div className="relative mb-4 flex aspect-square items-center justify-center">
        <Image
          src={`${env.NEXT_PUBLIC_STORAGE_URL}/products/${product.featuredImage}`}
          alt={product.name}
          fill
          className="rounded-lg object-cover object-center"
        />
        {hasSale && (
          <div className="absolute top-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
            SALE
          </div>
        )}
      </div>

      <h3 className="text-lg font-medium">{product.name}</h3>
      <div className="mb-4">
        {selectedVariant ? (
          selectedVariant.compareAtPriceInCents ? (
            <div className="flex items-center gap-2">
              <p className="font-medium text-red-600">
                {formatCurrency(selectedVariant.priceInCents / 100)}
              </p>
              <p className="text-gray-500 line-through">
                {formatCurrency(selectedVariant.compareAtPriceInCents / 100)}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">
              {formatCurrency(selectedVariant.priceInCents / 100)}
            </p>
          )
        ) : lowestCompareAtPrice && lowestCompareAtPrice > 0 ? (
          <div className="flex items-center gap-2">
            <p className="font-medium text-red-600">
              {formatCurrency((lowestPrice ?? 0) / 100)}
            </p>
            <p className="text-gray-500 line-through">
              {formatCurrency(lowestCompareAtPrice / 100)}
            </p>
          </div>
        ) : hasDifferentPrices ? (
          <p className="text-gray-600">
            From {formatCurrency((lowestPrice ?? 0) / 100)}
          </p>
        ) : (
          <p className="text-gray-600">
            {formatCurrency((lowestPrice ?? 0) / 100)}
          </p>
        )}
      </div>

      <select
        value={selectedVariant?.id}
        onChange={(e) =>
          setSelectedVariant(
            product.variants.find((v) => v.id === e.target.value) ?? null,
          )
        }
        className="mb-4 rounded-md border bg-white p-2"
        aria-label={`Select variant for ${product.name}`}
      >
        <option value="">Select Variant</option>
        {product.variants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.name}
          </option>
        ))}
      </select>

      {/* <button
        className="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
        onClick={addToCart}
      >
        Add to Cart
      </button> */}

      <AddToCartButton variantId={selectedVariant?.id} quantity={1} />
    </div>
  );
}
