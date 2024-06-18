import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import ReservePage from "./reserve-page";

export default async function Channel(props: {
  params: { reserveId: string };
}) {
  const reserve = await api.reserve.getById.query({
    reserveId: props.params.reserveId,
  });
  const size = await api.size.getById.query({ sizeId: reserve?.IdSize! });
  const locker = await api.locker.get.query();

  if (!reserve) {
    return <Title>No se encontró el canal</Title>;
  }

  return (
    <ReservePage
      reserve={reserve}
      size={size}
      locker={locker.find((x: any) => x.NroSerie == reserve.NroSerie)}
    />
  );
}
