import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";
import { clients } from "~/server/db/schema";

export const clientsRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const result = ctx.db.query.clients.findMany({
      orderBy: (client, { asc }) => [asc(client.email)],
    });
    return result;
  }),
  getByEmail: publicProcedure.query(async ({ ctx }) => {
    const clients = await ctx.db.query.clients.findMany({
      orderBy: (client, { asc }) => [asc(client.email)],
    });

    // Group by email using JavaScript
    const groupedByEmail = clients.reduce(
      (acc, client) => {
        if (!acc[client.email!]) {
          acc[client.email!] = [];
        }
        acc[client.email!]!.push(client);
        return acc;
      },
      {} as Record<string, typeof clients>,
    );
    return groupedByEmail;
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
      const client = await ctx.db.query.clients.findFirst({
        where: eq(schema.clients.email, input.email!),
      });
      if (!client) {
        const result = await db.insert(schema.clients).values({
          name: input.name,
          surname: input.surname,
          email: input.email,
          prefijo: input.prefijo,
          telefono: input.telefono,
        });
        const id = parseInt(result.lastInsertRowid?.toString()!);
        return { id };
      } else {
        const id = parseInt(client.identifier?.toString()!);
        return { id };
      }
    }),
  getById: publicProcedure
    .input(
      z.object({
        identifier: z.number(),
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
        identifier: z.number(),
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
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.clients)
        .where(eq(schema.clients.identifier, input.id));
    }),
});

export type Client = RouterOutputs["client"]["get"][number];
