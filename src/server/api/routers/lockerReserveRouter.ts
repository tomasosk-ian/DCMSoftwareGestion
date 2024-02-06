import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const pokeApiUrl = "https://pokeapi.co";

export const pokemonRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ input }) => {
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/ability/`);
    const abilityData = await pokeRes.json();
    const pokemonList = abilityData.results;

    // // Imprimir la lista de Pokémon en la consola
    // console.log("Lista de Pokémon asociados a la habilidad:");
    // console.log(pokemonList);
    // shold prob validate the shape with Zod
    // const pokemonList = abilityData.results.map((pokemon: Pokemon) => {
    //   console.log("HOLA");
    //   // console.log(pokemon.name);
    //   console.log(validated);
    // });
    const validated = responseValidator.parse(pokemonList);
    return validated;
  }),
  reserveBox: publicProcedure
    .input(
      z.object({
        NroSerie: z.string(),
        IdLocker: z.number().nullable(),
        IdSize: z.number().nullable(),
        IdBox: z.number().nullable(),
        Token1: z.number().nullable(),
        FechaCreacion: z.string().nullable(),
        FechaInicio: z.string(),
        FechaFin: z.string(),
        Contador: z.number().nullable(),
        Confirmado: z.boolean().nullable(),
        Modo: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const reservationResponse = await fetch(
        `http://192.168.88.191:8000/api/token/reservar/${input.NroSerie}`,
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
      console.log(reservedBoxData);

      return reservationResponse;
    }),
});

const reserveValidator = z.object({
  IdLocker: z.number(),
  IdSize: z.number(),
  IdBox: z.number().nullable(),
  Token1: z.number().nullable(),
  FechaCreacion: z.string().nullable(),
  FechaInicio: z.string().nullable(),
  FechaFin: z.string().nullable(),
  Contador: z.number().nullable(),
  Confirmado: z.boolean().nullable(),
  Modo: z.string().nullable(),
});
export type Reserve = z.infer<typeof reserveValidator>;

const responseValidator = z.array(reserveValidator);
