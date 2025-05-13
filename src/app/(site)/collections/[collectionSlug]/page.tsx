import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { env } from "~/env";

import { api } from "~/trpc/server";
import { formatCurrency } from "~/utils/format-currency";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collectionSlug: string }>;
}) {
  const slug = (await params).collectionSlug;
  const collections = await api.collection.getBySlug({
    slug: slug,
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Collection Header */}
      <h1 className="mb-8 text-center text-4xl font-bold tracking-wider uppercase">
        {collections?.name}
      </h1>

      {/* Filters and Sort */}
      <div className="mb-8 flex items-center justify-between">
        <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
          <SlidersHorizontal className="h-5 w-5" />
          <span>Filter</span>
        </button>

        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">
            Sort by
          </label>
          <select
            id="sort-select"
            className="appearance-none rounded-md border border-gray-300 bg-white py-2 pr-10 pl-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections?.products.map((product) => {
          const hasSamePrice = product.variants.every(
            (v) =>
              v.priceInCents === product.variants[0]?.priceInCents &&
              v.compareAtPriceInCents ===
                product.variants[0]?.compareAtPriceInCents,
          );

          const displayPrice = hasSamePrice
            ? product.variants[0]?.priceInCents
            : Math.min(...product.variants.map((v) => v.priceInCents));

          const displayComparePrice = hasSamePrice
            ? product.variants[0]?.compareAtPriceInCents
            : Math.min(
                ...product.variants.map(
                  (v) => v.compareAtPriceInCents ?? Infinity,
                ),
              );

          const isSale = product.variants.some(
            (variant) => variant.compareAtPriceInCents !== null,
          );

          return (
            <Link
              key={product.id}
              href={`/collections/${slug}/products/${product.slug}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={
                    product?.featuredImage?.startsWith("https://")
                      ? product?.featuredImage
                      : `${env.NEXT_PUBLIC_STORAGE_URL}/products/${product?.featuredImage}`
                  }
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-opacity group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  {isSale && (
                    <span className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white uppercase">
                      SALE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {product?.variants?.length > 1
                    ? "Multiple Variants"
                    : "Default"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(displayPrice ?? 0)}
                  </p>
                  {isSale && displayComparePrice !== Infinity && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatCurrency(displayComparePrice ?? 0)}
                    </p>
                  )}
                </div>
                {!hasSamePrice && (
                  <p className="text-xs text-gray-500">
                    {isSale ? "Sale prices" : "Prices"} vary by variant
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
