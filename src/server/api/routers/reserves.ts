import { eq, lt, gt, isNotNull, and } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { reservas, transactions } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export type Reserve = {
  identifier: string;
  NroSerie: string;
  IdSize: number;
  IdBox: string | null;
  Token1: string | null;
  FechaCreacion: string;
  FechaInicio: string;
  FechaFin: string;
  Contador: number;
  clients: any; // Ajusta esto según la estructura de tu cliente
};

// Definir el tipo del resultado agrupado
export type GroupedReserves = {
  [nReserve: number]: Reserve[];
};

export const reserveRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.reservas.findMany({
      with: { clients: true },
      where: (reservas) => isNotNull(reservas.Token1),
    });
    const groupedByNReserve = result.reduce((acc: any, reserva) => {
      const nReserve = reserva.nReserve!;
      if (!acc[nReserve]) {
        acc[nReserve] = [];
      }
      acc[nReserve].push(reserva);
      return acc;
    }, {});
    return groupedByNReserve;
  }),
  getActive: publicProcedure.query(async ({ ctx }) => {
    const result = await db.query.reservas.findMany({
      where: (reservas) => isNotNull(reservas.Token1),
      with: { clients: true },
    });

    const actives = result.filter(
      (x) => new Date(x.FechaFin!).getTime() >= new Date().getTime(),
    );

    const groupedByNReserve = actives.reduce((acc: any, reserva) => {
      const nReserve = reserva.nReserve!;
      if (!acc[nReserve]) {
        acc[nReserve] = [];
      }
      acc[nReserve].push(reserva);
      return acc;
    }, {});

    return groupedByNReserve;
  }),

  getBynReserve: publicProcedure
    .input(
      z.object({
        nReserve: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const reserve = await db.query.reservas.findMany({
        where: eq(schema.reservas.nReserve, input.nReserve),
        with: { clients: true },
      });

      return reserve;
    }),
  list: publicProcedure.query(({ ctx }) => {
    ctx.db.select().from(reservas);
    const result = ctx.db.query.reservas.findMany({
      orderBy: (reservas, { desc }) => [desc(reservas.identifier)],
      with: { clients: true },
    });
    return result;
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
        nReserve: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.reservas)
        .where(eq(schema.reservas.nReserve, input.nReserve));
    }),
});

export type Reserves = RouterOutputs["reserve"]["getBynReserve"][number];
