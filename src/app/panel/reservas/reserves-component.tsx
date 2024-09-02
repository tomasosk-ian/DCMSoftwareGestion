import * as React from "react";



import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Reserves } from "~/server/api/routers/reserves";
import { api } from "~/trpc/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function ReservesComponent(props: {
  activesReserves: Record<number, Reserves[]>;
  allReserves: Record<number, Reserves[]>;
}) {
  // Obtener las tiendas (stores) del servidor
  const stores = await api.store.get.query();

  // Función para formatear las reservas, agregando el nombre del local correspondiente
  const formatReserves = (reserves: Record<number, Reserves[]>) => {
    return Object.values(reserves)
      .flat()
      .map((reserve) => ({
        nReserve: reserve.nReserve,
        storeName: stores.find(store => store.serieLocker === reserve.NroSerie)?.name || "-",
        client: reserve.client || "-",
      }));
  };

  // Datos formateados de reservas activas y todas las reservas
  const activeReservesData = formatReserves(props.activesReserves);
  const allReservesData = formatReserves(props.allReserves);

  return (
    <section className="space-y-2">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {/* Reemplaza ReservesTable por DataTable */}
          <DataTable columns={columns} data={activeReservesData} />
        </TabsContent>
        <TabsContent value="all">
          {/* Reemplaza ReservesTable por DataTable */}
          <DataTable columns={columns} data={allReservesData} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
