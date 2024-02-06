import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import StorePage from "./store-page";

export default async function Channel(props: { params: { storeId: string } }) {
  const store = await api.store.getById.query({
    storeId: props.params.storeId,
  });
  const cities = await api.city.get.query();
  const lockers = await api.locker.get.query();
  if (!store) {
    return <Title>No se encontró el canal</Title>;
  }

  return <StorePage store={store} cities={cities} lockers={lockers} />;
}
