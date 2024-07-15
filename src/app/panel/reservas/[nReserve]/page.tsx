import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import ReservePage from "./reserve-page";

export default async function Reserve(props: { params: { nReserve: string } }) {
  const reserve = await api.reserve.getBynReserve.query({
    nReserve: parseInt(props.params.nReserve),
  });
  const sizes = await api.size.get.query();
  // const size = await api.size.getById.query({ sizeId: reserve?.IdSize! });

  if (!reserve) {
    return <Title>No se encontró la reserva</Title>;
  }

  return <ReservePage reserve={reserve} sizes={sizes} />;
}
