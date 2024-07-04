import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import ReservePage from "./reserve-page";

export default async function Channel(props: { params: { clientId: string } }) {
  // const reserve = await api.reserve.getById.query({
  //   reserveId: props.params.reserveId,
  // });
  // const size = await api.size.getById.query({ sizeId: reserve?.IdSize! });
  return <Title>En construcción.</Title>;

  // if (!reserve) {
  //   return <Title>No se encontró el canal</Title>;
  // }

  // return <ReservePage reserve={reserve} size={size} />;
}
