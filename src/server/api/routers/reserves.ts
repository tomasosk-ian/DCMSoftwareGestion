import { eq, isNotNull, and } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";
import { startOfDay, endOfDay, isAfter } from "date-fns";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { db, schema } from "~/server/db";
import { lockerValidator } from "./lockers";

export type Reserve = {
  identifier: string | null;
  NroSerie: string | null;
  IdSize: number | null;
  IdBox: number | null;
  IdFisico: number | null;
  Token1: number | null;
  FechaCreacion: string | null;
  FechaInicio: string | null;
  FechaFin: string | null;
  Contador: number | null;
  client: string | null;
};

// Definir el tipo del resultado agrupado
export type GroupedReserves = {
  [nReserve: number]: Reserve[];
};

export const reserveRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    await checkBoxAssigned();
    const result = await ctx.db.query.reservas.findMany({
      with: { clients: true },
      where: (reservas) =>
        and(isNotNull(reservas.nReserve), isNotNull(reservas.Token1)),
    });

    return groupByField(result, "nReserve");
  }),

  getActive: publicProcedure.query(async ({ ctx }) => {
    await checkBoxAssigned();

    const result = await db.query.reservas.findMany({
      where: (reservas) =>
        and(isNotNull(reservas.nReserve), isNotNull(reservas.Token1)),
      with: { clients: true },
    });

    const now = new Date();
    const startOfDayLocale = startOfDay(now);
    const endOfDayLocale = endOfDay(now);

    const actives = result.filter((x) => {
      const fechaFin = new Date(x.FechaFin!);
      return (
        isAfter(fechaFin, startOfDayLocale) && isAfter(endOfDayLocale, fechaFin)
      );
    });

    return groupByField(actives, "nReserve");
  }),

  getBynReserve: publicProcedure
    .input(
      z.object({
        nReserve: z.number(),
      }),
    )
    .query(async ({ input }) => {
      await checkBoxAssigned();

      const reserve = await db.query.reservas.findMany({
        where: (reservas) =>
          and(
            isNotNull(reservas.nReserve),
            isNotNull(reservas.Token1),
            eq(schema.reservas.nReserve, input.nReserve),
          ),
        with: { clients: true },
      });

      return reserve;
    }),

  create: publicProcedure
    .input(
      z.object({
        IdLocker: z.number().nullable().optional(),
        NroSerie: z.string().nullable(),
        IdSize: z.number().nullable(),
        IdBox: z.number().nullable(),
        Token1: z.number().nullable(),
        FechaCreacion: z.string().nullable(),
        FechaInicio: z.string().nullable(),
        FechaFin: z.string().nullable(),
        Contador: z.number().nullable(),
        Confirmado: z.boolean().nullable().optional(),
        Modo: z.string().nullable().optional(),
        Cantidad: z.number().optional(),
        IdTransaction: z.number().optional(),
        client: z.string().nullable().optional(),
        identifier: z.string().nullable().optional(),
        nReserve: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const identifier = createId();

      await db.insert(schema.reservas).values({
        identifier,
        NroSerie: input.NroSerie,
        IdSize: input.IdSize,
        IdBox: input.IdBox,
        Token1: input.Token1,
        FechaCreacion: new Date().toISOString(),
        FechaInicio: input.FechaInicio,
        FechaFin: input.FechaFin,
        Contador: input.Contador,
        Confirmado: input.Confirmado,
        Modo: input.Modo,
        Cantidad: input.Cantidad,
        IdTransaction: input.IdTransaction,
        client: input.client,
        nReserve: input.nReserve,
      });
    }),

  updateReserve: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        FechaFin: z.string(),
        FechaInicio: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await db
        .update(schema.reservas)
        .set({ FechaFin: input.FechaFin, FechaInicio: input.FechaInicio })
        .where(eq(schema.reservas.identifier, input.identifier))
        .returning();
      return response[0] as Reserve;
    }),

  delete: publicProcedure
    .input(
      z.object({
        nReserve: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(schema.reservas)
        .where(eq(schema.reservas.nReserve, input.nReserve));
    }),

  getLastReserveByBox: publicProcedure.query(async ({ ctx }) => {
    const reservas = await ctx.db.query.reservas.findMany({
      with: { clients: true },
      where: (reservas) => isNotNull(reservas.IdBox),
      orderBy: (reservas, { desc }) => [desc(reservas.FechaFin)],
    });

    const lastReservesByBox = reservas.reduce(
      (acc, reserva) => {
        if (!acc[reserva.IdBox!]) {
          acc[reserva.IdBox!] = reserva;
        }
        return acc;
      },
      {} as Record<number, (typeof reservas)[number]>,
    );

    return Object.values(lastReservesByBox);
  }),
});

// Helper: Agrupar reservas por un campo específico
function groupByField<T>(
  data: T[],
  field: keyof T,
): Record<string | number, T[]> {
  return data.reduce(
    (acc, item) => {
      const key = item[field] as unknown as string | number;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string | number, T[]>,
  );
}

// Helper: Validar lockers y tokens
export async function checkBoxAssigned() {
  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/api/locker/byTokenEmpresa/${process.env.TOKEN_EMPRESA}`,
    );
    if (!response.ok) throw new Error("Error fetching lockers");

    const lockersData = await response.json();
    const validatedData = z.array(lockerValidator).parse(lockersData);

    for (const locker of validatedData) {
      for (const token of locker.tokens || []) {
        if (token.idBox != null) {
          const idFisico = locker.boxes.find(
            (box) => box.id === token.idBox,
          )?.idFisico;
          await db
            .update(schema.reservas)
            .set({ IdFisico: idFisico, IdBox: token.idBox })
            .where(eq(schema.reservas.Token1!, parseInt(token.token1 ?? "0")));
        }
      }
    }
  } catch (error) {
    console.error("Error in checkBoxAssigned:", error);
    throw new Error("Failed to process lockers");
  }
}
