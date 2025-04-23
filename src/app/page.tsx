import Link from "next/link";

import type { BlogPost, Collection } from "@prisma/client";
import { ProductGrid } from "~/app/_components/product-grid.tsx";
import Footer from "~/components/layout/footer";
import HeroSection from "~/components/layout/hero";
import { ImageHero } from "~/components/layout/image-hero";
import { NavBar } from "~/components/layout/navbar";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import BlogPreviewSection from "./_components/blog-preview-section";
import CollectionSection from "./_components/collection-section";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }

  const collections = await api.collection.getAll();
  const products = await api.product.getAll();
  const blogPreviews = await api.blog.getPreviews();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <NavBar />
        <ImageHero />
        {/* <HeroSection /> */}
        <ProductGrid products={products} />
        <CollectionSection items={collections as unknown as Collection[]} />
        <BlogPreviewSection
          blogPreviews={blogPreviews as (BlogPost & { content: string })[]}
        />
        <Footer />
      </main>
    </HydrateClient>
  );
}
