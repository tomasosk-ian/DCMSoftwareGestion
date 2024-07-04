import { eq, lt, gt } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { reservas } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export const reserveRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    ctx.db.select().from(reservas);
    const result = ctx.db.query.reservas.findMany({
      orderBy: (reservas, { desc }) => [desc(reservas.identifier)],
      with: { clients: true },
    });
    return result;
  }),
  getActive: publicProcedure.query(({ ctx }) => {
    const newLocal = 0;
    const result = db.query.reservas.findMany({
      where: gt(
        schema.reservas.FechaFin,
        new Date().toISOString().replace("T", " ").substring(newLocal, 19),
      ),
      with: { clients: true },
    });
    return result;
  }),

  getById: publicProcedure
    .input(
      z.object({
        reserveId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.reservas.findFirst({
        where: eq(schema.reservas.identifier, input.reserveId),
        with: { clients: true },
      });

      return channel;
    }),

  change: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        name: z.string(),
        image: z.string().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      //   return ctx.db
      //     .update(reservas)
      //     .set({ name: input.name, image: input.image })
      //     .where(eq(reservas.identifier, input.identifier));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.reservas)
        .where(eq(schema.reservas.identifier, input.id));
    }),
});

export type Reserves = RouterOutputs["reserve"]["get"][number];
