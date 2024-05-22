import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { api } from "~/trpc/server";
import { AddPermissionDialog } from "../add-permission-dialog";

export default async function Home() {
  const permisos = await api.permissions.get.query();

  return (
    <section className="space-y-2">
      <div className="flex justify-between">
        <Title>Permisos</Title>
        <AddPermissionDialog />
      </div>
      <List>
        {permisos.map((p) => {
          return (
            <ListTile
              href={`/panel/permissions/${p.id}`}
              title={p.description}
            />
          );
        })}
      </List>
    </section>
  );
}
