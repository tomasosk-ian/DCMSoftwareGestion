import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { api } from "~/trpc/server";

export default async function Home() {
  const clientes = await api.client.get.query();

  return (
    <section className="space-y-2">
      <div className="flex justify-between">
        <Title>Clientes</Title>
      </div>
      <List>
        {clientes.map((cliente) => {
          return (
            <ListTile
              href={`/panel/clientes/${cliente.identifier}`}
              title={cliente.name}
            />
          );
        })}
      </List>
    </section>
  );
}
