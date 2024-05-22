import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { permissions } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export const permissionRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const result = ctx.db.query.permissions.findMany({
      orderBy: (permissions, { desc }) => [desc(permissions.id)],
    });
    return result;
  }),

  getPermission: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.permissions.findFirst({
      where: eq(permissions.id, input),
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        description: z.string().min(0).max(1023),
        type: z.string().min(0).max(1023),
        access: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos

      const id = createId();

      await db.insert(schema.permissions).values({
        id,
        description: input.description,
        access: input.access,
        type: input.type,
      });

      return { id };
    }),
  permissionToRole: publicProcedure
    .input(
      z.object({
        roleId: z.string().min(0).max(1023),
        permissions: z.array(z.string().min(0).max(1023)).nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { roleId, permissions } = input;

      const currentPermissions = await db.query.rolesToPermissions.findMany({
        where: eq(schema.rolesToPermissions.roleId, roleId),
      });
      const currentPermissionIds = currentPermissions.map(
        (row) => row.permissionId,
      );

      // Identificar permisos a agregar y eliminar
      const permissionsToAdd = permissions!.filter(
        (p) => !currentPermissionIds.includes(p),
      );
      const permissionsToRemove = currentPermissionIds.filter(
        (p) => !permissions!.includes(p!),
      );

      // Agregar nuevos permisos
      for (const permissionId of permissionsToAdd) {
        await db.insert(schema.rolesToPermissions).values(input);
      }
      for (const permissionId of permissionsToRemove) {
        await db
          .delete(schema.rolesToPermissions)
          .where(eq(schema.rolesToPermissions.permissionId, permissionId!));
      }
      return "";
    }),
  getById: publicProcedure
    .input(
      z.object({
        permissionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.permissions.findFirst({
        where: eq(schema.permissions.id, input.permissionId),
      });

      return channel;
    }),
  change: publicProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().min(0).max(1023),
        type: z.string().min(0).max(1023),
        access: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(permissions)
        .set(input)
        .where(eq(permissions.id, input.id));
      return result;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.permissions)
        .where(eq(schema.permissions.id, input.id));
    }),
});

export type Permission = RouterOutputs["permissions"]["get"][number];
