import { Boxes, Locker } from "~/server/api/routers/lockers";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { BriefcaseIcon } from "lucide-react";
import { api } from "~/trpc/server";
import { DataTableDemo } from "./test";
import { Reserves } from "~/server/api/routers/reserves";
export default async function BoxContent(props: {
  locker: Locker;
  reservas: Reserves[] | null;
}) {
  const { reservas } = props;
  const sizes = await api.size.get.query();

  return (
    <div>
      <DataTableDemo data={props.locker} reservas={reservas} sizes={sizes} />
    </div>
  );
}
