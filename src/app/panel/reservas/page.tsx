import { Title } from "~/components/title";

import { api } from "~/trpc/server";

import ReservesComponent from "./reserves-component";
import { Reserves } from "~/server/api/routers/reserves";

export default async function Home() {
  const activesReserves = (await api.reserve.getActive.query()).reduce(
    (acc, reserve) => {
      const { client } = reserve;
      if (!acc[client!]) {
        acc[client!] = [];
      }
      acc[client!]!.push(reserve);
      return acc;
    },
    {} as Record<number, Reserves[]>,
  );
  const allReserves = (await api.reserve.get.query()).reduce(
    (acc, reserve) => {
      const { client } = reserve;
      if (!acc[client!]) {
        acc[client!] = [];
      }
      acc[client!]!.push(reserve);
      return acc;
    },
    {} as Record<number, Reserves[]>,
  );
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
