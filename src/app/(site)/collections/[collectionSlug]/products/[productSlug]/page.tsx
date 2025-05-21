import type { OutputData } from "@editorjs/editorjs";
import { Star } from "lucide-react";
import { MarkdownView } from "~/components/shared/markdown-view";
import { Separator } from "~/components/ui/separator";
import { env } from "~/env";
import { api } from "~/trpc/server";

import ReviewSection from "../_components/review-section";
import { VariantSelection } from "../_components/variant-selection";

type ProductImage = string;

type Props = { params: Promise<{ productSlug: string }> };

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params;
  const product = await api.product.getBySlug({
    slug: productSlug,
  });

  if (!product) {
    return <div>Product not found</div>;
  }

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
          {/* <div className="mt-3">
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
          </div> */}

          {/* Variant Selection */}
          <VariantSelection
            attributes={product.attributes}
            variants={product.variants}
          />

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

        {/* <ReviewSection
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
              acc[review.rating] = (acc[review.rating] ?? 0) + 1;
              return acc;
            },
            {} as Record<number, number>,
          )}
          reviews={[]}
        /> */}
      </div>
    </div>
  );
}
