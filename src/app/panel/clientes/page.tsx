import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { api } from "~/trpc/server";

export default async function Home() {
  const clientes = await api.client.getByEmail.query();
  console.log(clientes);
  return (
    <section className="space-y-2">
      <div className="flex justify-between">
        <Title>Clientes</Title>
      </div>
      <List>
        {Object.entries(clientes).map(([key, values]) => {
          return (
            <ListTile
              href={`/panel/clientes/${values[0]?.identifier}`}
              title={key}
            />
          );
        })}
      </List>
    </section>
  );
}
