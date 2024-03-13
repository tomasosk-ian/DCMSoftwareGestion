import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

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
        name: z.string().min(0).max(1023).optional(),
        surname: z.string().min(0).max(1023).optional(),
        email: z.string().min(0).max(1023).optional(),
        prefijo: z.number().optional(),
        telefono: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos

      const identifier = createId();

      await db.insert(schema.clients).values({
        identifier,
        name: input.name,
        surname: input.surname,
        email: input.email,
        prefijo: input.prefijo,
        telefono: input.telefono,
      });

      return { identifier };
    }),
  getById: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.clients.findFirst({
        where: eq(schema.clients.identifier, input.Id),
      });

      return channel;
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

export type City = RouterOutputs["clients"]["get"][number];
