import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { addressValidator } from "~/lib/validators/geocoding";

export const addressRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: addressId }) => {
      const address = await ctx.db.address.findUnique({
        where: { id: addressId },
      });

      return address;
    }),

  update: protectedProcedure
    .input(addressValidator)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      const customer = await ctx.db.customer.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!customer) throw new Error("Customer not found");

      const address = await ctx.db.address.update({
        where: { id },
        data: { ...rest },
      });

      if (input.isDefault) {
        await ctx.db.address.updateMany({
          where: { customerId: customer.id, NOT: { id: address.id } },
          data: { isDefault: false },
        });
      }
      return {
        data: address,
        message: "Address updated successfully",
      };
    }),

  create: protectedProcedure
    .input(addressValidator.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!customer) throw new Error("Customer not found");

      const address = await ctx.db.address.create({
        data: { ...input, customer: { connect: { id: customer.id } } },
      });

      if (input.isDefault) {
        await ctx.db.address.updateMany({
          where: { customerId: customer.id, NOT: { id: address.id } },
          data: { isDefault: false },
        });
      }

      return {
        data: address,
        message: "Address created successfully",
      };
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: addressId }) => {
      const customer = await ctx.db.customer.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!customer) throw new Error("Customer not found");

      const address = await ctx.db.address.delete({
        where: { id: addressId, customerId: customer.id },
      });

      if (address.isDefault) {
        const defaultAddress = await ctx.db.address.findFirst({
          where: { customerId: customer.id, NOT: { id: address.id } },
        });

        if (defaultAddress)
          await ctx.db.address.update({
            where: { id: defaultAddress.id },
            data: { isDefault: true },
          });
      }

      return {
        data: address,
        message: "Address deleted successfully",
      };
    }),
});
