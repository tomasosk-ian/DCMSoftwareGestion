import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { api } from "~/trpc/server";
import { AddRoleDialog } from "../add-role-dialog";

export default async function Home() {
  const roles = await api.roles.get.query();

  return (
    <section className="space-y-2">
      <div className="flex justify-between">
        <Title>Roles</Title>
        <AddRoleDialog />
      </div>
      <List>
        {roles.map((rol) => {
          return (
            <ListTile href={`/panel/roles/${rol.id}`} title={rol.description} />
          );
        })}
      </List>
    </section>
  );
}
