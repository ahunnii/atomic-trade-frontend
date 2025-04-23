import { blogRouter } from "~/server/api/routers/blog";
import { collectionRouter } from "~/server/api/routers/collection";
import { productRouter } from "~/server/api/routers/product";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { cartRouter } from "./routers/cart";
import { storeRouter } from "./routers/store";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  blog: blogRouter,
  collection: collectionRouter,
  cart: cartRouter,
  store: storeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
