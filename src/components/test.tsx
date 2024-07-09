"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Boxes, Locker } from "~/server/api/routers/lockers";
import {
  AlertCircle,
  BriefcaseIcon,
  LockIcon,
  MessageCircleWarningIcon,
  UnlockIcon,
} from "lucide-react";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Reserves } from "~/server/api/routers/reserves";
import { api } from "~/trpc/react";
import { Size } from "~/server/api/routers/sizes";

interface Token {
  id: number;
  idLocker: number;
  idSize: number;
  idBox: number;
  token1: string;
  fechaCreacion: string;
  fechaInicio: string;
  fechaFin: string;
  contador: number;
  confirmado: boolean;
  modo: string;
  idBoxNavigation: null;
  idLockerNavigation: null;
  idSizeNavigation: null;
}

function getDaysFromDateUntilToday(startDate: string): number {
  // Convertimos la fecha de inicio a un objeto Date
  const start = new Date(startDate);
  // Obtenemos la fecha actual
  const today = new Date();

  // Calculamos la diferencia en milisegundos
  const diffInMs = today.getTime() - start.getTime();

  // Convertimos la diferencia de milisegundos a días
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

export function DataTableDemo(props: {
  data: Locker;
  reservas: Reserves[] | null;
  sizes: Size[];
}) {
  const { sizes, reservas } = props;
  const columns: ColumnDef<Boxes>[] = [
    {
      accessorKey: "idSize",
      header: "Size",
      cell: ({ row }) => (
        <div className="capitalize">
          {sizes &&
            sizes.find((x: Size) => x.id == row.getValue("idSize"))?.nombre}
        </div>
      ),
    },
    {
      accessorKey: "ocupacion",
      header:
        // ({ column }) => {
        //   return (
        //     <Button
        //       variant="ghost"
        //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //     >
        //       Email
        //       <CaretSortIcon className="ml-2 h-4 w-4" />
        //     </Button>
        //   );}
        "Ocupación",
      cell: ({ row }) => (
        <div className="lowercase">
          {" "}
          {row.getValue("ocupacion") ? <BriefcaseIcon /> : ""}
        </div>
      ),
    },
    {
      accessorKey: "puerta",
      header:
        // ({ column }) => {
        //   return (
        //     <Button
        //       variant="ghost"
        //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //     >
        //       Email
        //       <CaretSortIcon className="ml-2 h-4 w-4" />
        //     </Button>
        //   );}
        "Puerta",
      cell: ({ row }) => (
        <div className="lowercase">
          {" "}
          {row.getValue("puerta") ? <LockIcon /> : <UnlockIcon />}
        </div>
      ),
    },
    {
      accessorKey: "id",
      header:
        // ({ column }) => {
        //   return (
        //     <Button
        //       variant="ghost"
        //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //     >
        //       Email
        //       <CaretSortIcon className="ml-2 h-4 w-4" />
        //     </Button>
        //   );}
        "",
      cell: ({ row }) => {
        console.log("el token es", row.getValue("id"));
        console.log("el puerta es", row.getValue("puerta"));
        return (
          <div className="animate-pulse lowercase">
            {
              props.data.tokens?.find((x) => x.idBox == row.getValue("id"))
                ?.token1
            }
            {row.getValue("ocupacion") &&
            (new Date(
              reservas?.find((r) => {
                r.Token1?.toString() ==
                  props.data.tokens?.find((x) => x.idBox == row.getValue("id"))
                    ?.token1;
              })?.FechaFin ?? "",
            ) < new Date() ||
              !reservas?.find((r) => {
                r.Token1?.toString() ==
                  props.data.tokens?.find((x) => x.idBox == row.getValue("id"))
                    ?.token1;
              })?.FechaFin) ? (
              <AlertCircle color="red" />
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver locker</DropdownMenuItem>
              <DropdownMenuItem>Ver última reserva</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const data = props.data.boxes;
  console.log("props.data.boxes", props.data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full rounded-md border ">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
