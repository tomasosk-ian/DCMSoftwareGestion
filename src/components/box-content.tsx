import { Boxes } from "~/server/api/routers/lockers";
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
  boxes: Boxes[];
  reservas: Reserves | null;
}) {
  const { reservas } = props;
  const sizes = await api.size.get.query();
  return (
    // <div>
    //   <Table>
    //     <TableCaption>Lista de sus boxes.</TableCaption>
    //     <TableHeader>
    //       <TableRow>
    //         <TableHead className="w-[100px]">Tamaño</TableHead>
    //         <TableHead>Status</TableHead>
    //         <TableHead>Method</TableHead>
    //         <TableHead className="text-right">Amount</TableHead>
    //       </TableRow>
    //     </TableHeader>
    //     <TableBody>
    //       {props.boxes.map((x) => (
    //         <TableRow key={x.id}>
    //           {" "}
    //           <TableCell className="font-medium">{sizes.find((s:Size)=>s.id == x.idSize)}</TableCell>
    //           <TableCell>{x.puerta}</TableCell>
    //           <TableCell>{x.status}</TableCell>
    //           <TableCell className="text-right">{x.ocupacion}</TableCell>{" "}
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </div>
    <div>
      <DataTableDemo data={props.boxes} reservas={reservas} />
    </div>
  );
}
