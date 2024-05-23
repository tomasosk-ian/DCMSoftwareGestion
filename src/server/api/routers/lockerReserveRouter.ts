import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env";
import { createId } from "~/lib/utils";
import { db, schema } from "~/server/db";
import { eq } from "drizzle-orm";

const pokeApiUrl = "https://pokeapi.co";

const getClientByEmail = async (email: string) => {
  const client = await db.query.clients.findFirst({
    where: eq(schema.clients.email, email),
  });
  return client;
};

export const lockerReserveRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        clientId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const reserves = await db.query.reservas.findMany({
        orderBy: (reserva, { desc }) => [desc(reserva.identifier)],
        where: eq(schema.reservas.client, input.clientId!),
      });

      return reserves;
    }),

  reserveBox: publicProcedure
    .input(
      z.object({
        IdLocker: z.number().nullable(),
        NroSerie: z.string().nullable(),
        IdSize: z.number().nullable(),
        IdBox: z.number().nullable(),
        Token1: z.number().nullable(),
        FechaCreacion: z.string().nullable(),
        FechaInicio: z.string().nullable(),
        FechaFin: z.string().nullable(),
        Contador: z.number().nullable(),
        Confirmado: z.boolean().nullable(),
        Modo: z.string().nullable(),
        Cantidad: z.number().optional(),
        IdTransaction: z.number().optional(),
        client: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const reservationResponse = await fetch(
        `${env.SERVER_URL}/api/token/reservar/${input.NroSerie}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers needed for authentication or other purposes
          },
          body: JSON.stringify(input),
        },
      );

      const client = await getClientByEmail(input.client!);
      const identifier = createId();
      await db.insert(schema.reservas).values({
        identifier,
        NroSerie: input.NroSerie,
        IdSize: input.IdSize,
        IdBox: input.IdBox,
        Token1: input.Token1,
        FechaCreacion: input.FechaCreacion,
        FechaInicio: input.FechaInicio,
        FechaFin: input.FechaFin,
        Contador: input.Contador,
        Confirmado: input.Confirmado,
        Modo: input.Modo,
        Cantidad: input.Cantidad,
        IdTransaction: input.IdTransaction,
        client: client?.identifier,
      });

      // Handle the response from the external API
      if (!reservationResponse.ok) {
        // Extract the error message from the response
        const errorResponse = await reservationResponse.json();
        console.log(errorResponse);
        // Throw an error or return the error message
        return errorResponse.message || "Unknown error";
      } else {
      }

      const reservedBoxData = await reservationResponse.json();

      return reservedBoxData;
    }),

  confirmBox: publicProcedure
    .input(
      z.object({
        idToken: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const reservationResponse = await fetch(
        `http://168.205.92.83:8000/api/token/confirmar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: `${input.idToken}`,
        },
      );

      // Handle the response from the external API
      if (!reservationResponse.ok) {
        // Extract the error message from the response
        const errorResponse = await reservationResponse.json();
        console.log(errorResponse);
        // Throw an error or return the error message
        return errorResponse.message || "Unknown error";
      }
      const reservedBoxData = await reservationResponse.json();
      return reservedBoxData;
    }),
});

const reserveValidator = z.object({
  IdLocker: z.number().nullable(),
  NroSerie: z.string().nullable(),
  IdSize: z.number().nullable(),
  IdBox: z.number().nullable(),
  Token1: z.number().nullable(),
  FechaCreacion: z.string().nullable(),
  FechaInicio: z.string().nullable(),
  FechaFin: z.string().nullable(),
  Contador: z.number().nullable(),
  Confirmado: z.boolean().nullable(),
  Modo: z.string().nullable(),
  Cantidad: z.number().optional(),
  IdTransaction: z.number().optional(),
  client: z.string().nullable().optional(),
  identifier: z.string().nullable().optional(),
});
export type Reserve = z.infer<typeof reserveValidator>;

const responseValidator = z.array(reserveValidator);
