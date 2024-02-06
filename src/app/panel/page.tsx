import AppLayout from "~/components/applayout";
import { getServerAuthSession } from "~/server/auth";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import AppSidenav from "~/components/app-sidenav";
import { api } from "~/trpc/server";
import LayoutContainer from "~/components/layout-container";
import { Size } from "~/server/api/routers/sizes";
import { AddCityDialog } from "./add-city-dialog";
import { AddStoreDialog } from "./add-store-dialog";

export default async function Home() {
  const cities = await api.city.get.query();
  const stores = await api.store.get.query();
  const lockers = await api.locker.get.query();
  const sizes = await api.size.get.query();
  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Ciudades</Title>
          <AddCityDialog />
        </div>
        <List>
          {cities.map((city) => {
            return (
              <ListTile
                href={`/panel/ciudades/${city.identifier}`}
                title={city.name}
              />
            );
          })}
        </List>
      </section>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Locales</Title>
          <AddStoreDialog cities={cities} lockers={lockers} />
        </div>
        <List>
          {stores.map((store) => {
            return (
              <ListTile
                href={`/panel/locales/${store.identifier}`}
                title={store.name}
              />
            );
          })}
        </List>
      </section>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Tamaños</Title>
        </div>
        <List>
          {sizes.map((size: Size) => {
            return (
              <ListTile
                href={`/dashboard/admin/global/companies/${size.id}`}
                title={size.nombre}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
  );
}
