"use client";

import * as React from "react";
import QRCode from "react-qr-code";

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
import { Boxes, Locker, Token } from "~/server/api/routers/lockers";
import {
  AlertCircle,
  BriefcaseIcon,
  LockIcon,
  QrCode,
  UnlockIcon,
} from "lucide-react";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Reserves } from "~/server/api/routers/reserves";
import { api } from "~/trpc/react";
import { Size } from "~/server/api/routers/sizes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

function getDaysFromDateUntilToday(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();

  const diffInMs = today.getTime() - start.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

export function DataTableDemo(props: {
  data: Locker;
  reservas: Reserves[] | null;
  sizes: Size[];
}) {
  const { mutateAsync: postToken } = api.token.post.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [generatedTokens, setGeneratedTokens] = useState<Map<number, string>>(
    new Map(),
  );

  useEffect(() => {
    // Inicializar el estado de los tokens generados desde los datos recibidos
    const tokenMap = new Map<number, string>();
    props.data.tokens?.forEach((token) => {
      if (token.idBox) {
        tokenMap.set(token.idBox, token.token1);
      }
    });
    setGeneratedTokens(tokenMap);
  }, [props.data.tokens]);

  function GetQR(props: { idLocker: number; idSize: number; idBox: number }) {
    const { idLocker, idSize, idBox } = props;

    const handleQRClick = async () => {
      const fechaInicio = new Date();
      fechaInicio.setHours(0, 0, 0, 0);

      const fechaFin = new Date();
      fechaFin.setHours(23, 59, 59, 999);
      const existingToken = generatedTokens.get(idBox);
      if (!existingToken) {
        const newToken = {
          idLocker,
          idSize,
          idBox,
          token1: Math.floor(100000 + Math.random() * 900000).toString(),
          fechaCreacion: formatDate(new Date().toString()),
          fechaInicio: formatDate(fechaInicio.toString()),
          fechaFin: formatDate(fechaFin.toString()),
          contador: 0,
          confirmado: true,
          modo: "Por fecha",
          idBoxNavigation: null,
          idLockerNavigation: null,
          idSizeNavigation: null,
        };
        await postToken({ token: newToken });
        setGeneratedTokens(
          new Map(generatedTokens.set(idBox, newToken.token1)),
        );
        setCurrentToken(newToken.token1);
      } else {
        setCurrentToken(existingToken);
      }

      setIsOpen(true);
    };

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className="bg-transparent p-1 outline-none hover:bg-transparent"
            onClick={handleQRClick}
          >
            <QrCode color="black" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div
                style={{
                  height: "auto",
                  margin: "0 auto",
                  maxWidth: 128,
                  width: "100%",
                }}
              >
                <QRCode
                  className="w-full"
                  size={512}
                  style={{ height: "auto", width: "100%" }}
                  value={currentToken ?? ""}
                  viewBox={`0 0 512 512`}
                />
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="items-center justify-center text-5xl font-bold">
                {currentToken}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Aceptar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const router = useRouter();
  const { sizes, reservas } = props;

  const columns: ColumnDef<Boxes>[] = [
    {
      accessorKey: "idFisico",
      header: "ID BOX",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("idFisico")}</div>
      ),
    },
    {
      accessorKey: "idSize",
      header: "Size",
      cell: ({ row }) => (
        <div className="capitalize">
          {sizes.find((x) => x.id == row.getValue("idSize"))?.nombre}
        </div>
      ),
    },
    {
      accessorKey: "ocupacion",
      header: "Ocupación",
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue("ocupacion") ? <BriefcaseIcon /> : ""}
        </div>
      ),
    },
    {
      accessorKey: "puerta",
      header: "Puerta",
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue("puerta") ? <LockIcon /> : <UnlockIcon />}
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-center p-0">
          {row.getValue("ocupacion") &&
          (new Date(
            props.data.tokens?.find((x) => x.idBox == row.getValue("id"))
              ?.fechaFin ?? "",
          ).getTime() < new Date().getTime() ||
            !reservas?.find(
              (r) =>
                r.Token1?.toString() ==
                (props.data.tokens?.find((x) => x.idBox == row.getValue("id"))
                  ?.token1 ?? ""),
            )?.FechaFin) ? (
            <div className="flex items-center space-x-5">
              <div className="animate-pulse lowercase">
                <AlertCircle color="red" />
              </div>
              <GetQR
                idLocker={row.original.idLocker}
                idSize={row.getValue("idSize")}
                idBox={row.getValue("id")}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ),
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
              <DropdownMenuItem
                disabled={
                  reservas?.find(
                    (r) =>
                      r.Token1?.toString() ==
                      (props.data.tokens?.find(
                        (x) => x.idBox == row.getValue("id"),
                      )?.token1 ?? ""),
                  )?.identifier
                    ? false
                    : true
                }
                onClick={() => {
                  router.push(
                    `/panel/reservas/${reservas?.find((r) => r.Token1?.toString() == props.data.tokens?.find((x) => x.idBox == row.getValue("id"))?.token1)?.nReserve}`,
                  );
                }}
              >
                Ver última reserva
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const data = props.data.boxes;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
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
              .map((column) => (
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
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full rounded-md border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19);
}
