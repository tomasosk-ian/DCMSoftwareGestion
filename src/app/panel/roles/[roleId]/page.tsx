import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import RolePage from "./role-page";

export default async function Channel(props: { params: { roleId: string } }) {
  const role = await api.roles.getById.query({ roleId: props.params.roleId });
  console.log(role);
  if (!role) {
    return <Title>No se encontró el rol</Title>;
  }

  return <RolePage role={role} />;
}
