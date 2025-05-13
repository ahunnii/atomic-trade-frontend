import type { OutputData } from "@editorjs/editorjs";
import { Minus, Plus, Star } from "lucide-react";
import { MarkdownView } from "~/components/shared/markdown-view";
import { Separator } from "~/components/ui/separator";
import { env } from "~/env";
import { api } from "~/trpc/server";

import { formatCurrency } from "~/utils/format-currency";
import ReviewSection from "../_components/review-section";

type ProductImage = string;
type ProductAttribute = {
  id: string;
  name: string;
  values: string[];
};

export default async function ProductPage({
  params,
}: {
  params: { productSlug: string };
}) {
  const product = await api.product.getBySlug({
    slug: params.productSlug,
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  console.log(product);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Image Gallery */}
        <div className="aspect-square w-full">
          <div className="sticky top-0 aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={
                product.featuredImage?.startsWith("https://")
                  ? product.featuredImage
                  : `${env.NEXT_PUBLIC_STORAGE_URL}/products/${product.featuredImage}`
              }
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Thumbnail Grid */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            {product?.images?.map((image: ProductImage, idx: number) => (
              <button
                key={idx}
                className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  src={
                    image.startsWith("https://")
                      ? image
                      : `${env.NEXT_PUBLIC_STORAGE_URL}/products/${image}`
                  }
                  alt={`Product image ${idx + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

          {/* Reviews */}
          <div className="mt-3">
            <div className="flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 ${
                      rating < 4 ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="ml-3 text-sm text-gray-500">
                {product.reviews.length} reviews
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {formatCurrency(product.variants[0]?.priceInCents ?? 0)}
            </p>
          </div>

          {/* Variants */}
          {product?.attributes?.map((attribute: ProductAttribute) => (
            <div key={attribute.id} className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">
                {attribute.name}
              </h3>
              <div className="mt-2">
                <div className="grid grid-cols-4 gap-2">
                  {attribute.values.map((value: string) => (
                    <button
                      key={value}
                      className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium hover:border-gray-300"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center rounded-md border border-gray-200">
              <button
                className="p-2 hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="w-16 border-0 text-center focus:ring-0"
                aria-label="Product quantity"
                title="Product quantity"
              />
              <button
                className="p-2 hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-8">
            <button className="w-full rounded-md bg-black px-8 py-3 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none">
              Add to Cart
            </button>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <div
              className="prose prose-sm mt-4 text-gray-500"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <Separator className="mt-8" />
          {/* Additional Info */}
          {product?.additionalInfo && (
            <div className="py-4">
              <MarkdownView
                defaultContent={
                  product?.additionalInfo as unknown as OutputData
                }
              />
            </div>
          )}
        </div>

        <ReviewSection
          overallRating={
            product.reviews?.length > 0
              ? product.reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0,
                ) / product.reviews.length
              : 0
          }
          totalReviews={product.reviews.length ?? 0}
          ratingDistribution={product.reviews.reduce(
            (acc, review) => {
              acc[review.rating] = (acc[review.rating] || 0) + 1;
              return acc;
            },
            {} as Record<number, number>,
          )}
          reviews={[]}
        />
      </div>
    </div>
  );
}
