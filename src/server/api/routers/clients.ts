import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";
import { clients } from "~/server/db/schema";

export const clientsRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const result = ctx.db.query.clients.findMany({
      orderBy: (client, { desc }) => [desc(client.identifier)],
    });
    return result;
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(0).max(1023).nullable().optional(),
        surname: z.string().min(0).max(1023).nullable().optional(),
        email: z.string().min(0).max(1023).nullable().optional(),
        prefijo: z.number().nullable().optional(),
        telefono: z.number().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos
      const existingClient = await db.query.clients.findFirst({
        where: eq(schema.clients.email, input.email!),
      });

      const identifier = createId();
      if (!existingClient) {
        await db.insert(schema.clients).values({
          identifier,
          name: input.name,
          surname: input.surname,
          email: input.email,
          prefijo: input.prefijo,
          telefono: input.telefono,
        });

        return { identifier };
      } else {
        console.log("Ya existe un cliente con este correo electrónico.");
        return 0;
      }
    }),
  getById: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.clients.findFirst({
        where: eq(schema.clients.identifier, input.identifier),
      });

      return channel;
    }),
  change: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        name: z.string().min(0).max(1023).optional().nullable(),
        surname: z.string().min(0).max(1023).optional().nullable(),
        email: z.string().min(0).max(1023).optional().nullable(),
        prefijo: z.number().optional().nullable(),
        telefono: z.number().optional().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(clients)
        .set(input)
        .where(eq(clients.identifier, input.identifier));
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.cities)
        .where(eq(schema.cities.identifier, input.id));
    }),
});

export type Client = RouterOutputs["client"]["get"][number];
