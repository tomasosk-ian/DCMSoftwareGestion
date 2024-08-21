import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env";
import { createId } from "~/lib/utils";
import { db, schema } from "~/server/db";
import { eq } from "drizzle-orm";

export const getClientByEmail = async (email: string) => {
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
      const client = await db.query.clients.findFirst({
        where: eq(schema.clients.identifier, input.clientId!),
      });
      const reserves = await db.query.reservas.findMany({
        orderBy: (reserva, { desc }) => [desc(reserva.identifier)],
        where: eq(schema.reservas.client, client?.email!),
      });

      return reserves;
    }),

  reserveBox: publicProcedure
    .input(
      z.object({
        IdLocker: z.number().nullable().optional(),
        NroSerie: z.string().nullable(),
        IdSize: z.number().nullable(),
        IdBox: z.number().nullable(),
        Token1: z.number().nullable().optional(),
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
      console.log("JSON.stringify(input)", JSON.stringify(input));
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
      console.log(
        "ASDASDASDDSSADADSADSASDADSKSADJDSAJADSJASJSADJDSA",
        reservationResponse,
      );

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

      const client = await getClientByEmail(input.client!);
      const identifier = createId();
      await db.insert(schema.reservas).values({
        identifier,
        NroSerie: input.NroSerie,
        IdSize: input.IdSize,
        IdBox: input.IdBox,
        Token1: input.Token1 ?? null,
        FechaCreacion: input.FechaCreacion,
        FechaInicio: input.FechaInicio,
        FechaFin: input.FechaFin,
        Contador: input.Contador,
        Confirmado: input.Confirmado,
        Modo: input.Modo,
        Cantidad: input.Cantidad,
        IdTransaction: reservedBoxData,
        client: client?.email,
        nReserve: input.nReserve,
      });
      return reservedBoxData;
    }),

  confirmBox: publicProcedure
    .input(
      z.object({
        idToken: z.number(),
        nReserve: z.number(),
        // isExt: z.boolean(),
        // newEndDate: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("id transaction is", input.idToken);
      // if (!input.isExt) {
      const reservationResponse = await fetch(
        `${env.SERVER_URL}/api/token/confirmar`,
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
      await db
        .update(schema.reservas)
        .set({ Token1: reservedBoxData, nReserve: input.nReserve })
        .where(eq(schema.reservas.IdTransaction, input.idToken));
      console.log("reservedBoxData", reservedBoxData);
      return reservedBoxData;
      // }
      // else {
      //   console.log("ENTRA EN ISEXT");

      //   const reservationResponse = await fetch(
      //     `${env.SERVER_URL}/api/token/extender/${input.idToken}/${input.newEndDate}`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     },
      //   );

      //   if (!reservationResponse.ok) {
      //     const errorResponse = await reservationResponse.json();
      //     console.log(errorResponse);
      //     return errorResponse.message || "Unknown error";
      //   }

      //   const reservedBoxData = await reservationResponse.json();

      //   console.log("extendedBoxData", reservedBoxData);
      //   return reservedBoxData;
      // }
    }),
  assignClientToReserve: publicProcedure
    .input(
      z.object({
        idReserve: z.string(),
        idClient: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = ctx.db
        .update(schema.reservas)
        .set({ client: input.idClient })
        .where(eq(schema.reservas.identifier, input.idReserve));
      return response;
    }),
  reserveExtesion: publicProcedure
    .input(
      z.object({
        idToken: z.number(),
        newEndDate: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("ENTRA EN ISEXT");
      console.log("input.idToken", input.idToken);

      try {
        const reservationResponse = await fetch(
          `${env.SERVER_URL}/api/token/extender/${input.idToken}/${input.newEndDate || ""}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}), // Enviar un cuerpo vacío
          },
        );

        if (!reservationResponse.ok) {
          const errorResponse = await reservationResponse.json();
          console.error("Error en la respuesta del servidor:", errorResponse);
          return errorResponse.message || "Unknown error";
        }

        const reservedBoxData = await reservationResponse.json();

        console.log("reservedBoxData", reservedBoxData);
        return reservedBoxData;
      } catch (error) {
        console.error("Error en la solicitud de extensión:", error);
        return "Error inesperado en la solicitud";
      }
    }),
});

const reserveValidator = z.object({
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
});
export type Reserve = z.infer<typeof reserveValidator>;

const responseValidator = z.array(reserveValidator);
