import type { BlogPost, Collection } from "@prisma/client";
import { ProductGrid } from "~/app/_components/product-grid";

import { ImageHero } from "~/components/layout/image-hero";

import { api } from "~/trpc/server";
import BlogPreviewSection from "../_components/blog-preview-section";
import CallToActionSection from "../_components/call-to-action-section";
import CollectionSection from "../_components/collection-section";

export default async function Home() {
  const homePageSettings = await api.store.getHomePageSettings();

  const collections = await api.collection.getAll();
  const products = await api.product.getAll();
  const blogPreviews = await api.blog.getPreviews();

  return (
    <>
      <ImageHero
        heroImages={homePageSettings?.heroImages}
        heroTitle={homePageSettings?.heroTitle}
        heroSubtitle={homePageSettings?.heroSubtitle}
        heroButtonText={homePageSettings?.heroButtonText}
        heroButtonLink={homePageSettings?.heroButtonLink}
      />
      <>
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-wide">
            NEW ARRIVALS
          </h2>
          <ProductGrid products={products} />{" "}
        </div>
      </>
      {homePageSettings?.enableCallToAction && (
        <CallToActionSection
          callToActionTitle={homePageSettings?.callToActionTitle}
          callToActionSubtitle={homePageSettings?.callToActionSubtitle}
          callToActionButtonText={homePageSettings?.callToActionButtonText}
          callToActionButtonLink={homePageSettings?.callToActionButtonLink}
          callToActionImage={homePageSettings?.callToActionImage}
        />
      )}
      {homePageSettings?.enableCollectionsSection && (
        <CollectionSection items={collections as unknown as Collection[]} />
      )}
      {homePageSettings?.enableBlogSection && (
        <BlogPreviewSection
          blogPreviews={blogPreviews as (BlogPost & { content: string })[]}
        />
      )}
    </>
  );
}
