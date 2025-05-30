import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { env } from "~/env";

const POLICY_PAGES = [
  {
    slug: "refund-policy",
    content: {
      title: "Refund Policy",
    },
  },
  {
    slug: "privacy-policy",
    content: {
      title: "Privacy Policy",
    },
  },
  {
    slug: "terms-of-service",
    content: {
      title: "Terms of Service",
    },
  },
  {
    slug: "shipping-policy",
    content: {
      title: "Shipping Policy",
    },
  },
];
export const policiesRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: pageSlug }) => {
      const findReservedPage = POLICY_PAGES.find(
        (page) => page.slug === pageSlug,
      );
      if (!findReservedPage) {
        return null;
      }

      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");
      const store = await ctx.db.store.findUnique({
        where: { slug: storeSlug },
        select: { sitePolicies: true },
      });

      if (pageSlug === "privacy-policy") {
        return {
          title: "Privacy Policy",
          content: store?.sitePolicies?.privacyPolicy,
        };
      }
      if (pageSlug === "shipping-policy") {
        return {
          title: "Shipping Policy",
          content: store?.sitePolicies?.shippingPolicy,
        };
      }
      if (pageSlug === "terms-of-service") {
        return {
          title: "Terms of Service",
          content: store?.sitePolicies?.termsOfService,
        };
      }
      if (pageSlug === "refund-policy") {
        return {
          title: "Refund Policy",
          content: store?.sitePolicies?.refundPolicy,
        };
      }

      return null;
    }),
});
