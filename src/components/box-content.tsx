import { Boxes, Locker } from "~/server/api/routers/lockers";
import { api } from "~/trpc/server";
import { Reserves } from "~/server/api/routers/reserves";
import { MonitorDatatable } from "./monitor-table";
export default async function BoxContent(props: {
  locker: Locker;
  reservas: Reserves[] | null;
}) {
  const { reservas } = props;
  const sizes = await api.size.get.query();

  return (
    <div>
      {/* <MonitorDatatable data={props.locker} reservas={reservas} sizes={sizes} /> */}
    </div>
  );
}
