"use client"

import { Button } from "~/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { Reserve } from "~/server/api/routers/reserves";
import dayjs from "dayjs";

export function ReserveExcel({ allReservesData }: { allReservesData: {
  nReserve?: string,
  storeName?: string,
  client?: string,
  dataReserve?: Reserve,
}[] }) {
  async function downloadExcel() {
    const excelRows: (string | number)[][] = [[
      "N° Reserva",
      "Local",
      "Email",
      "Locker",
      "Fecha Creacion",
      "Fecha Inicio",
      "Fecha Fin",
    ]];

    for (const data of allReservesData) {
      excelRows.push([
        data.nReserve ?? "",
        data.storeName ?? "",
        data.client ?? "",
        data.dataReserve?.NroSerie ?? "",
        dayjs(data.dataReserve?.FechaCreacion).format("DD-MM-YYYY"),
        dayjs(data.dataReserve?.FechaInicio).format("DD-MM-YYYY"),
        dayjs(data.dataReserve?.FechaFin).format("DD-MM-YYYY"),
      ]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BD");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Clientes_${new Date().toISOString().split("T")[0]}.xlsx`);
  }

  return <Button onClick={downloadExcel}>Descargar Excel</Button>
}