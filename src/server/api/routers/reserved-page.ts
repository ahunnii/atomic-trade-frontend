import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { env } from "~/env";

const RESERVED_PAGES = [
  {
    slug: "contact-us",
    content: { title: "Contact Us" },
  },
  {
    slug: "special-requests",
    content: { title: "Special Requests" },
  },
  {
    slug: "about-us",
    content: { title: "About Us" },
  },
  {
    slug: "frequently-asked-questions",
    content: { title: "Frequently Asked Questions" },
  },
];
export const reservedPageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");
    const store = await ctx.db.store.findUnique({
      where: { slug: storeSlug },
      select: { reservedSitePages: true },
    });
    return store?.reservedSitePages;
  }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: pageSlug }) => {
      const findReservedPage = RESERVED_PAGES.find(
        (page) => page.slug === pageSlug,
      );
      if (!findReservedPage) {
        return null;
      }

      const storeSlug = env.STORE_NAME.toLowerCase().replace(/ /g, "-");
      const store = await ctx.db.store.findUnique({
        where: { slug: storeSlug },
        select: { reservedSitePages: true },
      });

      if (pageSlug === "contact-us") {
        return {
          title: "Contact Us",
          content: store?.reservedSitePages?.contactPage,
          isEnabled: store?.reservedSitePages?.enableContactPage,
        };
      }
      if (pageSlug === "special-requests") {
        return {
          title: "Special Requests",
          content: store?.reservedSitePages?.specialOrderPage,
          isEnabled: store?.reservedSitePages?.enableSpecialOrderPage,
        };
      }
      if (pageSlug === "about-us") {
        return {
          title: "About Us",
          content: store?.reservedSitePages?.aboutPage,
          isEnabled: store?.reservedSitePages?.enableAboutPage,
        };
      }
      if (pageSlug === "frequently-asked-questions") {
        return {
          title: "Frequently Asked Questions",
          content: store?.reservedSitePages?.faqPage,
          isEnabled: store?.reservedSitePages?.enableFaqPage,
        };
      }

      return null;
    }),
});
