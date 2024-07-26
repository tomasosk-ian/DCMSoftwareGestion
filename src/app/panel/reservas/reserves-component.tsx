import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Reserves } from "~/server/api/routers/reserves";

import ReservesTable from "~/components/reserves-table";
import { api } from "~/trpc/server";

export default async function ReservesComponent(props: {
  activesReserves: Record<number, Reserves[]>;
  allReserves: Record<number, Reserves[]>;
}) {
  const stores = await api.store.get.query();

  return (
    <section className="space-y-2">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <ReservesTable reserves={props.activesReserves} stores={stores} />
        </TabsContent>{" "}
        <TabsContent value="all">
          {" "}
          <ReservesTable reserves={props.allReserves} stores={stores} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
