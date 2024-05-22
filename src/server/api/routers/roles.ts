import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { permissions, roles } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export const roleRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    ctx.db.select().from(roles);
    const result = ctx.db.query.roles.findMany({
      orderBy: (roles, { desc }) => [desc(roles.id)],
      with: { rolesToPermissions: { with: { permissions: true } } },
    });
    return result;
  }),

  getRole: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.roles.findFirst({
      where: eq(roles.id, input),
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        description: z.string().min(0).max(1023).nullable().optional(),
        access: z.array(z.string()).min(0).max(1023),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos

      const id = createId();

      await db.insert(schema.roles).values({
        id,
        description: input.description,
      });

      return { id };
    }),
  getById: publicProcedure
    .input(
      z.object({
        roleId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.roles.findFirst({
        where: eq(schema.roles.id, input.roleId),
        with: { rolesToPermissions: { with: { permissions: true } } },
      });

      return channel;
    }),
  getAccess: publicProcedure
    .input(
      z.object({
        roleId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.roles.findFirst({
        where: eq(schema.roles.id, input.roleId),
        with: { rolesToPermissions: { with: { permissions: true } } },
      });

      return channel?.rolesToPermissions.values;
    }),
  change: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        description: z.string().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(roles)
        .set({ description: input.description, updatedAt: Date.now() })
        .where(eq(roles.id, input.identifier));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.delete(schema.roles).where(eq(schema.roles.id, input.id));
    }),
});

export type Role = RouterOutputs["roles"]["get"][number];
