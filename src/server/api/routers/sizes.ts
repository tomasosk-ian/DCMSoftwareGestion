import { eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { sizes } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";

export const sizeRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    console.log("sizeResponse", `${env.SERVER_URL}/api/size`);
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
    await Promise.all(
      validatedData.map(async (v) => {
        const fee = await db.query.feeData.findFirst({
          where: eq(schema.feeData.size, v.id),
        });
        v.tarifa = fee?.identifier;

        const existingSize = await db.query.sizes.findFirst({
          where: eq(schema.sizes.id, v.id), // Utiliza el nombre correcto del campo
        });

        if (existingSize) {
          // Si el tamaño ya existe, actualiza los datos
          await db
            .update(schema.sizes)
            .set({
              ...v,
            })
            .where(eq(schema.sizes.id, v.id));
        } else {
          // Si el tamaño no existe, insértalo
          await db.insert(schema.sizes).values({
            ...v,
          });
        }
      }),
    );

    // });
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
      try {
        console.log(
          "sizeResponse4",
          `${env.SERVER_URL}/api/token/disponibilidadlocker/${input.nroSerieLocker}/${input.inicio}/${input.fin}`,
        );
        const sizeResponse = await fetch(
          `${env.SERVER_URL}/api/token/disponibilidadlocker/${input.nroSerieLocker}/${input.inicio}/${input.fin}`,
        );

        // Handle the response from the external API
        if (!sizeResponse.ok) {
          const errorResponse = await sizeResponse.json();
          // Throw an error or return the error message
          return errorResponse.message || "Unknown error";
        }

        const reservedBoxData = await sizeResponse.json();

        const validatedData = responseValidator.parse(reservedBoxData);
        console.log("validatedData4", validatedData);
        await Promise.all(
          validatedData.map(async (v) => {
            const fee = await db.query.feeData.findFirst({
              where: eq(schema.feeData.size, v.id),
            });
            v.tarifa = fee?.identifier;

            const existingSize = await db.query.sizes.findFirst({
              where: eq(schema.sizes.id, v.id), // Utiliza el nombre correcto del campo
            });

            if (existingSize) {
              // Si el tamaño ya existe, actualiza los datos
              await db
                .update(schema.sizes)
                .set({
                  ...v,
                })
                .where(eq(schema.sizes.id, v.id));
              v.image = existingSize.image;
            } else {
              // Si el tamaño no existe, insértalo
              await db.insert(schema.sizes).values({
                ...v,
              });
            }
          }),
        );

        return validatedData.filter((s) => s.tarifa != null);
      } catch (e) {
        return e;
      }
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

  changeImage: publicProcedure
    .input(
      z.object({
        id: z.number(),
        image: z.string().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(sizes)
        .set({ image: input.image })
        .where(eq(sizes.id, input.id));
    }),
});

const sizeValidator = z.object({
  id: z.number(),
  nombre: z.string().nullable(),
  alto: z.number(),
  ancho: z.number().nullable(),
  profundidad: z.number().nullable(),
  cantidad: z.number().nullable().optional(),
  cantidadSeleccionada: z.number().nullable().optional().default(0),
  tarifa: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
});
export type Size = z.infer<typeof sizeValidator>;

const responseValidator = z.array(sizeValidator);
