import { eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { RouterOutputs } from "~/trpc/shared";

export const sizeRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const sizeResponse = await fetch(`${env.SERVER_URL}/api/size`);

    // Handle the response from the external API
    if (!sizeResponse.ok) {
      // Extract the error message from the response
      const errorResponse = await sizeResponse.json();
      // Throw an error or return the error message
      return errorResponse.message || "Unknown error";
    }

    const reservedBoxData = await sizeResponse.json();

    const validatedData = responseValidator.parse(reservedBoxData);
    console.log(validatedData);
    return validatedData;
  }),
  getAvailability: publicProcedure
    .input(
      z.object({
        nroSerieLocker: z.string().nullable(),
        inicio: z.string().nullable(),
        fin: z.string().nullable(),
      }),
    )
    .query(async ({ input }) => {
      console.log(
        `${env.SERVER_URL}/api/token/disponibilidadlocker/${input.nroSerieLocker}/${input.inicio}/${input.fin}`,
      );
      const sizeResponse = await fetch(
        `${env.SERVER_URL}/api/token/disponibilidadlocker/${input.nroSerieLocker}/${input.inicio}/${input.fin}`,
      );

      // Handle the response from the external API
      if (!sizeResponse.ok) {
        // Extract the error message from the response
        const errorResponse = await sizeResponse.json();
        // Throw an error or return the error message
        return errorResponse.message || "Unknown error";
      }

      const reservedBoxData = await sizeResponse.json();

      const validatedData = responseValidator.parse(reservedBoxData);
      console.log(validatedData);
      return validatedData;
    }),

  getById: publicProcedure
    .input(
      z.object({
        sizeId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const sizeResponse = await fetch(`${env.SERVER_URL}/api/size`);

      // Handle the response from the external API
      if (!sizeResponse.ok) {
        // Extract the error message from the response
        const errorResponse = await sizeResponse.json();
        // Throw an error or return the error message
        return errorResponse.message || "Unknown error";
      }

      const reservedBoxData = await sizeResponse.json();

      const validatedData = responseValidator.parse(reservedBoxData);

      const size = validatedData.find((item) => item.id === input.sizeId);
      // const store = await db.query.stores.findFirst({
      //   where: eq(schema.stores.identifier, input.storeId),
      //   with: {
      //     city: true,
      //   },
      // });

      return size;
    }),
});

const sizeValidator = z.object({
  id: z.number(),
  alto: z.number(),
  ancho: z.number().nullable(),
  profundidad: z.number().nullable(),
  nombre: z.string().nullable(),
  cantidad: z.number().nullable().optional(),
  cantidadSeleccionada: z.number().optional().default(0),
});
export type Size = z.infer<typeof sizeValidator>;

const responseValidator = z.array(sizeValidator);
