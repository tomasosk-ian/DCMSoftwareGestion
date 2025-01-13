import { Title } from "~/components/title";

import { api } from "~/trpc/server";

import ReservesComponent from "./reserves-component";

export default async function Home() {
  const activesReserves = await api.reserve.getActive.query();
  const allReserves = await api.reserve.get.query();
  return (
    <section className="space-y-2">
      <div className="flex justify-between">
        <Title>Reservas</Title>
      </div>
      <ReservesComponent
        activesReserves={activesReserves}
        allReserves={allReserves}
      />
    </section>
  );
}
