import { Title } from "~/components/title";
import { AddCityDialog } from "../add-city-dialog";
import { List, ListTile } from "~/components/list";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Size } from "~/server/api/routers/sizes";

export default async function Home() {
  const activesReserves = await api.reserve.getActive.query();
  const allReserves = await api.reserve.get.query();
  const sizes = await api.size.get.query();
  return (
    <section className="space-y-2">
      <div className="flex justify-between">
        <Title>Reservas</Title>
      </div>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <List className="pt-5">
            {activesReserves.map((reserve) => {
              return (
                <ListTile
                  href={`/panel/reservas/${reserve.identifier}`}
                  title={
                    <>
                      {reserve.identifier}{" "}
                      <div className="px-2">
                        <Badge>{reserve.clients?.email}</Badge>
                      </div>
                      Tamaño:{" "}
                      {sizes.find((x: Size) => x.id == reserve.IdSize).nombre}
                    </>
                  }
                />
              );
            })}
          </List>
        </TabsContent>{" "}
        <TabsContent value="all">
          <List className="pt-5">
            {allReserves.map((reserve) => {
              return (
                <ListTile
                  href={`/panel/reservas/${reserve.identifier}`}
                  title={
                    <>
                      {reserve.identifier}{" "}
                      <div className="px-2">
                        <Badge>{reserve.clients?.email}</Badge>
                      </div>
                      Tamaño:{" "}
                      {sizes.find((x: Size) => x.id == reserve.IdSize).nombre}
                    </>
                  }
                />
              );
            })}
          </List>
        </TabsContent>
      </Tabs>
    </section>
  );
}
