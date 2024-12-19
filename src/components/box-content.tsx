import { api } from "~/trpc/server";
import { MonitorDatatable } from "~/components/monitor-table";
import { Locker } from "~/server/api/routers/lockers";
import { Reserves } from "~/server/api/routers/reserves";

export default async function BoxContent(props: {
  locker: Locker;
  reservas: Reserves[];
}) {
  const sizes = await api.size.get.query();

  return (
    <MonitorDatatable
      data={props.locker}
      reservas={props.reservas}
      sizes={sizes}
    />
  );
}
