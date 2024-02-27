import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env";

const pokeApiUrl = "https://pokeapi.co";

export const pokemonRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ input }) => {
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/ability/`);
    const abilityData = await pokeRes.json();
    const pokemonList = abilityData.results;

    const validated = responseValidator.parse(pokemonList);
    return validated;
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

      return reservationResponse;
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
});
export type Reserve = z.infer<typeof reserveValidator>;

const responseValidator = z.array(reserveValidator);
