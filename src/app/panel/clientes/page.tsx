import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import { DataTable } from "./data-table";
import { ClientTableRecord, columns } from "./columns";

export default async function Home() {
  const clientes = await api.client.getGroupedByEmail.query();

  const uniqueClientes = Object.values(clientes)
    .map((clientList) => clientList[0])
    .filter((client): client is ClientTableRecord => client !== undefined);

  return (
    <section className="">
      <div className="flex justify-between">
        <Title>Clientes</Title>
      </div>
      <DataTable columns={columns} data={uniqueClientes} />
    </section>
  );
}
