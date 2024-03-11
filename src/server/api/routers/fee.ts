import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cities, feeData } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export const feeRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const result = ctx.db.query.feeData.findMany({
      orderBy: (feeData, { desc }) => [desc(feeData.identifier)],
    });
    return result;
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.feeData.findFirst({
        where: eq(schema.feeData.identifier, input.id),
      });

      return channel;
    }),
  getBySize: publicProcedure
    .input(
      z.object({
        idSize: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.feeData.findFirst({
        where: eq(schema.feeData.size, input.idSize),
      });

      return channel;
    }),
  create: publicProcedure
    .input(
      z.object({
        description: z.string().min(0).max(1023).nullable(),
        value: z.number().nullable(),
        coin: z.string().nullable(),
        size: z.number().nullable(),
        fee: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos

      const identifier = createId();

      await db.insert(schema.feeData).values({
        identifier,
        description: input.description,
        coin: input.coin,
        value: input.value,
        size: input.size,
      });

      return { identifier };
    }),
  change: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        description: z.string().min(0).max(1023).nullable(),
        value: z.number().nullable(),
        coin: z.string().nullable(),
        size: z.number().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(feeData)
        .set({
          description: input.description,
          value: input.value,
          coin: input.coin,
          size: input.size,
        })
        .where(eq(feeData.identifier, input.identifier));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.feeData)
        .where(eq(schema.feeData.identifier, input.id));
    }),
});

export type Fee = RouterOutputs["fee"]["get"][number];
