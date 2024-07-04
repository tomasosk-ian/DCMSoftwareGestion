import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cuponesData } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export const cuponesRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    const result = ctx.db.query.cuponesData.findMany({
      orderBy: (cuponesData, { desc }) => [desc(cuponesData.identifier)],
    });
    return result;
  }),
  create: publicProcedure
    .input(
      z.object({
        codigo: z.string().min(0).max(1023),
        tipo_descuento: z.string().min(0).max(1023),
        valor_descuento: z.number(),
        fecha_desde: z.string().min(0).max(1023),
        fecha_hasta: z.string().min(0).max(1023),
        cantidad_usos: z.number(),
        usos: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: verificar permisos
      const cupon = await db.query.cuponesData.findFirst({
        where: eq(schema.cuponesData.codigo, input.codigo),
      });
      if (!cupon) {
        const identifier = createId();

        await db.insert(schema.cuponesData).values({
          identifier,
          codigo: input.codigo,
          tipo_descuento: input.tipo_descuento,
          valor_descuento: input.valor_descuento,
          fecha_desde: input.fecha_desde,
          fecha_hasta: input.fecha_hasta,
          cantidad_usos: input.cantidad_usos,
          usos: input.usos,
        });

        return { identifier };
      } else {
        return null;
      }
    }),
  getById: publicProcedure
    .input(
      z.object({
        cuponId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.cuponesData.findFirst({
        where: eq(schema.cuponesData.identifier, input.cuponId),
      });

      return channel;
    }),
  getByCode: publicProcedure
    .input(
      z.object({
        codigo: z.string().min(0).max(1023),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cupon = await db.query.cuponesData.findFirst({
        where: eq(schema.cuponesData.codigo, input.codigo),
      });
      if (cupon?.cantidad_usos == cupon?.usos) return null;
      const currentDate = new Date();
      const fechaDesde = new Date(cupon?.fecha_desde || "");
      const fechaHasta = new Date(cupon?.fecha_hasta || "");

      if (
        !cupon ||
        currentDate < fechaDesde ||
        currentDate > fechaHasta ||
        cupon.cantidad_usos == cupon.usos
      ) {
        return null;
      }

      return cupon;
    }),
  change: publicProcedure
    .input(
      z.object({
        identifier: z.string().min(0).max(1023),
        codigo: z.string().min(0).max(1023),
        tipo_descuento: z.string().min(0).max(1023),
        valor_descuento: z.number(),
        fecha_desde: z.string().min(0).max(1023),
        fecha_hasta: z.string().min(0).max(1023),
        cantidad_usos: z.number(),
        usos: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(cuponesData)
        .set({
          codigo: input.codigo,
          tipo_descuento: input.tipo_descuento,
          valor_descuento: input.valor_descuento,
          fecha_desde: input.fecha_desde,
          fecha_hasta: input.fecha_hasta,
          cantidad_usos: input.cantidad_usos,
          usos: input.cantidad_usos,
        })
        .where(eq(cuponesData.identifier, input.identifier));
    }),
  useCupon: publicProcedure
    .input(
      z.object({
        codigo: z.string().min(0).max(1023),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cupon = await db.query.cuponesData.findFirst({
        where: eq(schema.cuponesData.codigo, input.codigo),
      });
      const currentDate = new Date();
      const fechaDesde = new Date(cupon?.fecha_desde || "");
      const fechaHasta = new Date(cupon?.fecha_hasta || "");

      if (
        !cupon ||
        currentDate < fechaDesde ||
        currentDate > fechaHasta ||
        cupon.cantidad_usos == cupon.usos
      ) {
        return null;
      }
      if (cupon?.cantidad_usos == cupon?.usos) return null;
      const cuponNuevo = ctx.db
        .update(cuponesData)
        .set({
          usos: sql`${cuponesData.usos} + 1`,
        })
        .where(eq(cuponesData.codigo, input.codigo));
      const response = await db.query.cuponesData.findFirst({
        where: eq(schema.cuponesData.codigo, input.codigo),
      });
      return response;
    }),
  delete: publicProcedure
    .input(
      z.object({
        cuponId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(schema.cuponesData)
        .where(eq(schema.cuponesData.identifier, input.cuponId));
    }),
});

export type Cupon = RouterOutputs["cupones"]["get"][number];
