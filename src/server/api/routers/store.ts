import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { stores } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";

export const storeRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const stores = ctx.db.query.stores.findMany({
      with: {
        city: true,
      },
    });
    return stores;
  }),

  getById: publicProcedure
    .input(
      z.object({
        storeId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.identifier, input.storeId),
        with: {
          city: true,
        },
      });

      return store;
    }),

  getByCity: publicProcedure
    .input(
      z.object({
        cityId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const store = await db.query.stores.findMany({
        where: eq(schema.stores.cityId, input.cityId),
        with: {
          city: true,
        },
      });

      return store;
    }),
  getByNroSerie: publicProcedure
    .input(
      z.object({
        nroSerie: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.serieLocker, input.nroSerie),
        with: {
          city: true,
        },
      });

      return store;
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        image: z.string().min(0).max(1023),
        cityId: z.string().min(0).max(1023),
        address: z.string().min(0).max(1023),
        organizationName: z.string().min(0).max(1023),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const identifier = createId();
      await ctx.db.insert(schema.stores).values({
        identifier,
        name: input.name,
        image: input.image,
        cityId: input.cityId,
        address: input.address,
        organizationName: input.organizationName,
      });

      return { identifier };
    }),
  change: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        name: z.string(),
        image: z.string().nullable().optional(),
        cityId: z.string().min(0).max(1023),
        serieLocker: z.string().nullable(),
        address: z.string().min(0).max(1023).nullable(),
        organizationName: z.string().min(0).max(1023),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(stores)
        .set(input)
        .where(eq(stores.identifier, input.identifier));
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.stores)
        .where(eq(schema.stores.identifier, input.id));
    }),
});

export type Store = RouterOutputs["store"]["get"][number];
