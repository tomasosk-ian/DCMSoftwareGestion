import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";
import { transactions } from "~/server/db/schema";

export const transactionRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const result = ctx.db.query.transactions.findMany({
      orderBy: (client, { desc }) => [desc(client.id)],
    });
    return result;
  }),
  create: publicProcedure
    .input(
      z.object({
        confirm: z.boolean().nullable().optional(),
        client: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos

      const identifier = createId();

      await db.insert(schema.transactions).values({
        confirm: input.confirm,
        client: input.client,
      });

      return { identifier };
    }),
  getById: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.transactions.findFirst({
        where: eq(schema.transactions.id, input.Id),
      });

      return channel;
    }),
  change: publicProcedure
    .input(
      z.object({
        id: z.number(),
        confirm: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(transactions)
        .set(input)
        .where(eq(transactions.id, input.id));
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.cities)
        .where(eq(schema.cities.identifier, input.id));
    }),
});

export type Transaction = RouterOutputs["transaction"]["get"][number];
