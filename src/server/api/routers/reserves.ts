import { eq, lt, gt, isNotNull, and } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { reservas, reservasToClients, transactions } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";
import { env } from "~/env";
import { lockerValidator } from "./lockers";
import { Input } from "~/components/ui/input";

export type Reserve = {
  identifier: string;
  NroSerie: string;
  IdSize: number;
  IdBox: string | null;
  IdFisico: string | null;
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
    await checkBoxAssigned();
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
    await checkBoxAssigned();

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
      await checkBoxAssigned();

      const reserve = await db.query.reservas.findMany({
        where: eq(schema.reservas.nReserve, input.nReserve),
        with: { clients: true },
      });

      return reserve;
    }),
  getByClient: publicProcedure
    .input(
      z.object({
        clientId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      await checkBoxAssigned();
      const result = await ctx.db.query.reservas.findMany({
        with: { clients: true },
        where: (reservas) => isNotNull(reservas.Token1),
      });
      const groupedByNReserve = result.reduce((acc: any, reserva) => {
        const nReserve = reserva.nReserve!;
        if (!acc[nReserve]) {
          acc[nReserve] = [];
        }
        if (reserva.client == input.clientId) {
          acc[nReserve].push(reserva);
        }
        return acc;
      }, {});
      return groupedByNReserve;
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    await checkBoxAssigned();

    ctx.db.select().from(reservas);
    const result = ctx.db.query.reservas.findMany({
      orderBy: (reservas, { desc }) => [desc(reservas.identifier)],
      with: { clients: true },
    });
    return result;
  }),
  reservesToClients: publicProcedure
    .input(
      z.object({
        clientId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(schema.reservasToClients)
        .values({
          clientId: input.clientId,
        })
        .returning();

      return result[0]?.identifier;
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

export async function checkBoxAssigned() {
  // check if a token has a new box assigned

  const locerResponse = await fetch(
    `${env.SERVER_URL}/api/locker/byTokenEmpresa/${env.TOKEN_EMPRESA}`,
  );
  if (!locerResponse.ok) {
    const errorResponse = await locerResponse.json();
    return { error: errorResponse.message || "Unknown error" };
  }

  const reservedBoxData = await locerResponse.json();
  // Validate the response data against the lockerValidator schema
  const validatedData = z.array(lockerValidator).safeParse(reservedBoxData);
  if (!validatedData.success) {
    // If the data is not an array, wrap it in an array

    throw null;
  }
  validatedData.data.map(async (locker) => {
    locker.tokens?.map(async (token) => {
      if (token.idBox != null) {
        const idFisico = locker.boxes.find(
          (box) => box.id == token.idBox,
        )?.idFisico;
        await db
          .update(schema.reservas)
          .set({ IdFisico: idFisico, IdBox: token.idBox })
          .where(eq(schema.reservas.Token1!, parseInt(token.token1 ?? "0")));
      }
    });
  });

  //fin check
}
