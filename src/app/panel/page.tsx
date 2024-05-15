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
  const session = await getServerAuthSession();

  // console.log("aaaaaaaaaaaaaaaaaaaaaaa");
  // console.log(session?.user.role);
  return (
    <section className="space-y-2">
      <Title>Bienvenido.</Title>
    </section>
  );
}
