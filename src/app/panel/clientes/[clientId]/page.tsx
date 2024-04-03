import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import ClientPage from "./client-page";

export default async function Channel(props: { params: { clientId: number } }) {
  const client = await api.client.getById.query({
    identifier: props.params.clientId,
  });

  if (!client) {
    return <Title>No se encontró el cliente.</Title>;
  }

  return <ClientPage client={client} />;
}
