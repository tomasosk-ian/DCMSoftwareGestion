import { Title } from "~/components/title";
import { api } from "~/trpc/server";
import PermissionPage from "./permission-page";

export default async function Permission(props: {
  params: { permissionId: string };
}) {
  console.log("------------------------------------------------------");
  console.log(props.params.permissionId);
  const permission = await api.permissions.getById.query({
    permissionId: props.params.permissionId,
  });
  if (!permission) {
    return <Title>No se encontró el rol</Title>;
  }

  return <PermissionPage permission={permission} />;
}
