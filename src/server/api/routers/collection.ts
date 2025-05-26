import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { env } from "~/env";

function getMinPrice(variants: { priceInCents: number }[]) {
  return Math.min(...variants.map((v) => v.priceInCents));
}

export const collectionRouter = createTRPCRouter({
  getNavigation: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const collections = await ctx.db.collection.findMany({
      where: { store: { slug: storeSlug }, status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return [
      ...collections,
      {
        id: "all-products",
        name: "All Products",
        slug: "all-products",
      },
    ];
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

    const collections = await ctx.db.collection.findMany({
      where: {
        store: { slug: storeSlug },
        status: "ACTIVE",
      },
      include: {
        products: { include: { variants: true } },
      },
    });

    //Tack on "All Products" to the collections

    const allProducts = await ctx.db.product.findMany({
      where: {
        store: { slug: storeSlug },
        status: "ACTIVE",
      },
      include: { variants: true },
    });

    const allProductsCollection = {
      id: "all-products",
      name: "All Products",
      slug: "all-products",
      products: allProducts,
      imageUrl:
        allProducts.length > 0
          ? `${env.NEXT_PUBLIC_STORAGE_URL}/products/${allProducts[Math.floor(Math.random() * allProducts.length)]?.featuredImage}`
          : "all-products.jpg",
    };

    return [...collections, allProductsCollection];
  }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        sortBy: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");

      if (input.slug === "featured-products") {
        const featuredProducts = await ctx.db.product.findMany({
          where: {
            store: { slug: storeSlug },
            status: "ACTIVE",
            isFeatured: true,
          },
          include: { variants: true },
        });

        const featuredProductsCollection = {
          id: "featured-products",
          name: "Featured Products",
          slug: "featured-products",
          products: featuredProducts,
          imageUrl:
            featuredProducts.length > 0
              ? `${env.NEXT_PUBLIC_STORAGE_URL}/products/${featuredProducts[Math.floor(Math.random() * featuredProducts.length)]?.featuredImage}`
              : "all-products.jpg",
        };

        return featuredProductsCollection;
      }

      if (input.slug === "new-arrivals") {
        const allProducts = await ctx.db.product.findMany({
          where: {
            store: { slug: storeSlug },
            status: "ACTIVE",
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          include: { variants: true },
        });

        const newArrivalsCollection = {
          id: "new-arrivals",
          name: "New Arrivals",
          slug: "new-arrivals",
          products: allProducts,
          imageUrl:
            allProducts.length > 0
              ? `${env.NEXT_PUBLIC_STORAGE_URL}/products/${allProducts[Math.floor(Math.random() * allProducts.length)]?.featuredImage}`
              : "all-products.jpg",
        };

        return newArrivalsCollection;
      }

      if (input.slug === "all-products" && !input.sortBy?.includes("price")) {
        const allProducts = await ctx.db.product.findMany({
          where: {
            store: { slug: storeSlug },
            status: "ACTIVE",
          },
          include: { variants: true },
          ...(input.sortBy &&
            (input.sortBy === "newest" || input.sortBy === "oldest") && {
              orderBy: {
                createdAt: input.sortBy === "newest" ? "desc" : "asc",
              },
            }),
        });

        const allProductsCollection = {
          id: "all-products",
          name: "All Products",
          slug: "all-products",
          products: allProducts,
          imageUrl:
            allProducts.length > 0
              ? `${env.NEXT_PUBLIC_STORAGE_URL}/products/${allProducts[Math.floor(Math.random() * allProducts.length)]?.featuredImage}`
              : "all-products.jpg",
        };

        return allProductsCollection;
      }
      if (input.slug === "all-products" && input.sortBy?.includes("price")) {
        const products = await ctx.db.product.findMany({
          where: {
            store: { slug: storeSlug },
            status: "ACTIVE",
          },
          include: { variants: true },
        });

        // Sort products by their lowest variant price if price sorting is requested
        // if (input.sortBy === "price-asc" || input.sortBy === "price-desc") {
        //   products.sort((a, b) => {
        //     const aMinPrice = Math.min(
        //       ...a.variants.map((v) => v.priceInCents),
        //     );
        //     const bMinPrice = Math.min(
        //       ...b.variants.map((v) => v.priceInCents),
        //     );
        //     return input.sortBy === "price-asc"
        //       ? aMinPrice - bMinPrice
        //       : bMinPrice - aMinPrice;
        //   });
        // }

        const sortedProducts = products.sort((a, b) => {
          const aMin = getMinPrice(a.variants);
          const bMin = getMinPrice(b.variants);

          if (input.sortBy === "price-low") return aMin - bMin;
          if (input.sortBy === "price-high") return bMin - aMin;

          return 0;
        });

        const allProductsCollection = {
          id: "all-products",
          name: "All Products",
          slug: "all-products",
          products: sortedProducts,
          imageUrl:
            products.length > 0
              ? `${env.NEXT_PUBLIC_STORAGE_URL}/products/${products[Math.floor(Math.random() * products.length)]?.featuredImage}`
              : "all-products.jpg",
        };

        return allProductsCollection;
      }

      if (input.slug === "sale-products") {
        const products = await ctx.db.product.findMany({
          where: {
            status: "ACTIVE",
            variants: { some: { compareAtPriceInCents: { not: null } } },
          },
          include: { variants: true },
        });

        const allProductsCollection = {
          id: "sale-products",
          name: "Sale Products",
          slug: "sale-products",
          products: products,
          imageUrl:
            products.length > 0
              ? `${env.NEXT_PUBLIC_STORAGE_URL}/products/${products[Math.floor(Math.random() * products.length)]?.featuredImage}`
              : "all-products.jpg",
        };
        return allProductsCollection;
      }

      const collection = await ctx.db.collection.findUnique({
        where: { slug: input.slug, store: { slug: storeSlug } },
        include: {
          products: {
            where: { status: "ACTIVE" },
            include: { variants: true },
          },
        },
      });

      return collection;
    }),
});
