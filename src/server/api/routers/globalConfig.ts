import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cities } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export const globalConfigRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const result = ctx.db.query.globalconfig.findFirst({
      orderBy: (cities, { desc }) => [desc(cities.identifier)],
    });
    return result;
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(0).max(1023),
        token: z.string().min(0).max(1023),
        image: z.string().min(0).max(1023),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos

      const identifier = createId();

      await db.insert(schema.globalconfig).values({
        identifier,
        name: input.name,
        token: input.token,
        image: input.image,
      });

      return { identifier };
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
      return ctx.db
        .update(cities)
        .set({ name: input.name, image: input.image })
        .where(eq(cities.identifier, input.identifier));
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

export type City = RouterOutputs["city"]["get"][number];
