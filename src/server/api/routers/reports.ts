import { and, gte, lte, isNotNull, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { sizes } from "~/server/db/schema";
import { Reserves } from "./reserves";

export type DailyOccupation = {
  day: string; // Formato "día/mes"
  sizes: { [sizeName: string]: number }; // Un tamaño por columna con su cantidad
  total: number; // Total de reservas del día
};

export const reportsRouter = createTRPCRouter({
  getOcupattion: publicProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { startDate, endDate } = input;

      // Obtener reservas en el rango de fechas con lockers asignados
      const reserves = await db.query.reservas.findMany({
        where: (reserva) =>
          and(
            gte(reserva.FechaInicio, startDate),
            lte(reserva.FechaFin, endDate),
            isNotNull(reserva.nReserve),
            isNotNull(reserva.IdBox),
          ),
      });

      // Obtener los nombres de tamaño para cada IdSize en las reservas
      const sizeMap: { [id: number]: string | null } = {};
      const uniqueSizeIds = Array.from(new Set(reserves.map((r) => r.IdSize)));

      const sizesData = await db.query.sizes.findMany({
        where: (size) => eq(schema.sizes.id, size.id),
      });

      sizesData.forEach((size) => {
        sizeMap[size.id] = size.nombre;
      });

      // Agrupar reservas por día y tamaño
      const occupationData: DailyOccupation[] = [];

      reserves.forEach((reserve) => {
        const date = new Date(reserve.FechaInicio!);
        const dayKey = `${date.getDate()}/${date.getMonth() + 1}`; // Formato "día/mes"
        const sizeName = sizeMap[reserve.IdSize!] || "Unknown";

        // Busca o crea una entrada para el día actual
        let dayEntry = occupationData.find((entry) => entry.day === dayKey);
        if (!dayEntry) {
          dayEntry = { day: dayKey, sizes: {}, total: 0 };
          occupationData.push(dayEntry);
        }

        // Incrementa la cantidad para el tamaño específico y el total del día
        dayEntry.sizes[sizeName] = (dayEntry.sizes[sizeName] || 0) + 1;
        dayEntry.total += 1;
      });
      console.log("occupationData", occupationData);
      return occupationData;
    }),
});
