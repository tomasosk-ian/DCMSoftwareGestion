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
  // const sizes = await api.size.get.query();
  return (
    <section className="space-y-2">
      <Title>Bienvenido.</Title>
    </section>
  );
}
