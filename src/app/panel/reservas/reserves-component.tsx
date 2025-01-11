import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Reserves } from "~/server/api/routers/reserves";
import { api } from "~/trpc/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function ReservesComponent({
  activesReserves,
  allReserves,
}: {
  activesReserves: Record<number, Reserves[]>;
  allReserves: Record<number, Reserves[]>;
}) {
  // Obtener las tiendas (stores) del servidor
  const stores = await api.store.get.query();

  // Función para formatear las reservas
  const formatReserves = React.useCallback(
    (reserves: Record<number, Reserves[]>) => {
      const seenReserves = new Set<number>();
      return Object.values(reserves)
        .flat()
        .filter((reserve) => {
          const reserveId = reserve.nReserve ?? 0;
          if (seenReserves.has(reserveId)) return false;
          seenReserves.add(reserveId);
          return true;
        })
        .map((reserve) => ({
          nReserve: reserve.nReserve,
          storeName:
            stores.find((store) => store.serieLocker === reserve.NroSerie)
              ?.name || "-",
          client: reserve.client || "-",
        }));
    },
    [stores],
  );

  // Formatear los datos
  const activeReservesData = formatReserves(activesReserves);
  const allReservesData = formatReserves(allReserves);

  return (
    <section className="space-y-2">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <DataTable columns={columns} data={activeReservesData} />
        </TabsContent>
        <TabsContent value="all">
          <DataTable columns={columns} data={allReservesData} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
