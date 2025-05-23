import type { OutputData } from "@editorjs/editorjs";

import { MarkdownView } from "~/components/shared/markdown-view";
import { Separator } from "~/components/ui/separator";
import { env } from "~/env";
import { api } from "~/trpc/server";

import Image from "next/image";

import { ProductGrid } from "~/app/_components/product-grid";

import { VariantSelection } from "../../../_components/variant-selection";

type ProductImage = string;

type Props = { params: Promise<{ productSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const slug = (await params).productSlug;
  const product = await api.product.getBySlug({
    slug: slug,
  });
  return { title: product?.name };
}

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params;
  const product = await api.product.getBySlug({
    slug: productSlug,
  });
  const products = await api.product.getAll();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Image Gallery */}
        <div className="aspect-square w-full lg:sticky lg:top-25">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={
                product.featuredImage?.startsWith("https://")
                  ? product.featuredImage
                  : `${env.NEXT_PUBLIC_STORAGE_URL}/products/${product.featuredImage}`
              }
              alt={product.name}
              className="h-full w-full object-cover object-center"
              fill
            />
          </div>
          {/* Thumbnail Grid */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            {product?.images?.map((image: ProductImage, idx: number) => (
              <button
                key={idx}
                className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={
                    image.startsWith("https://")
                      ? image
                      : `${env.NEXT_PUBLIC_STORAGE_URL}/products/${image}`
                  }
                  alt={`Product image ${idx + 1}`}
                  className="h-full w-full object-cover object-center"
                  fill
                />
                <span className="sr-only">{`Product image ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

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
      </div>
      <div className="mx-auto my-12 w-full max-w-7xl px-4 py-8">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-wide">
          YOU MAY ALSO LIKE
        </h2>
        <ProductGrid products={products ?? []} />
      </div>
    </div>
  );
}
