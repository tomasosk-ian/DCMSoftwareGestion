import { z } from "zod";
import { createId } from "~/lib/utils";
import { and, gte, lte, isNotNull, eq, InferSelectModel } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";
import { transactions } from "~/server/db/schema";

export const transactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        confirm: z.boolean().nullable().optional(),
        client: z.string().nullable().optional(),
        nReserve: z.number().nullable().optional(),
        amount: z.number().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos

      const identifier = createId();

      await db.insert(schema.transactions).values({
        confirm: input.confirm,
        client: input.client,
        amount: input.amount,
        nReserve: input.nReserve,
      });

      return { identifier };
    }),
  getBynroReserve: protectedProcedure
    .input(
      z.object({
        nReserve: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.transactions.findFirst({
        where: eq(schema.transactions.nReserve, input.nReserve),
        orderBy: (transaction, { desc }) => [desc(transaction.confirmedAt)],
      });

      if (!channel) {
      }

      return channel;
    }),
  getTransactionsByDate: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { startDate, endDate } = input;

      const result = await db.query.transactions.findMany({
        where: (transaction) =>
          and(
            gte(transaction.confirmedAt, startDate),
            lte(transaction.confirmedAt, endDate),
          ),
        orderBy: (transaction, { asc }) => [asc(transaction.confirmedAt)],
      });

      return result;
    }),
});

export type Transaction = InferSelectModel<typeof schema.transactions>;
