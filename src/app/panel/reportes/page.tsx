"use client";

import { useState, useMemo } from "react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Size } from "~/server/api/routers/sizes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LockerOcupationPage() {
  const router = useRouter();

  // Estados para las fechas visibles en el input
  const [tempStartDate, setTempStartDate] = useState("2024-01-01");
  const [tempEndDate, setTempEndDate] = useState("2024-12-31");

  // Estados para las fechas efectivas de consulta
  const [startDate, setStartDate] = useState(tempStartDate);
  const [endDate, setEndDate] = useState(tempEndDate);

  // Consulta de datos con fechas seleccionadas
  const { data: ocupationData } = api.reports.getOcupattion.useQuery({
    startDate,
    endDate,
  });
  const { data: sizes } = api.size.get.useQuery() as { data: Size[] };

  // Función para aplicar las fechas seleccionadas
  const applyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  // Calcular los totales por tamaño
  const totalBySize = useMemo(() => {
    if (!ocupationData || !sizes) return {};

    return ocupationData.reduce(
      (acc, entry) => {
        sizes.forEach((size) => {
          const sizeName = size.nombre || "Unknown";
          acc[sizeName] = (acc[sizeName] || 0) + (entry.sizes[sizeName] || 0);
        });
        return acc;
      },
      {} as { [sizeName: string]: number },
    );
  }, [ocupationData, sizes]);

  // Calcular el total general
  const grandTotal = useMemo(() => {
    return Object.values(totalBySize).reduce((acc, count) => acc + count, 0);
  }, [totalBySize]);

  // Preparar datos para el gráfico
  const chartData =
    ocupationData?.map((entry) => ({
      day: entry.day,
      total: entry.total,
    })) || [];

  if (!ocupationData || !sizes) return <div>No hay datos disponibles</div>;

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Ocupación de Lockers</Title>
          <Button onClick={() => router.refresh()}>Refrescar</Button>
        </div>

        <div className="my-4 flex gap-4">
          <label>
            Fecha de Inicio:
            <input
              type="date"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              className="rounded border p-2"
            />
          </label>
          <label>
            Fecha de Fin:
            <input
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              className="rounded border p-2"
            />
          </label>
          <Button onClick={applyDateFilter}>Aplicar</Button>
        </div>

        {/* Tabla de Ocupación */}
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">Día/Mes</th>
              {sizes.map((size) => (
                <th key={size.id} className="border px-4 py-2">
                  {size.nombre}
                </th>
              ))}
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {ocupationData.map((entry) => (
              <tr key={entry.day}>
                <td className="border px-4 py-2">{entry.day}</td>
                {sizes.map((size) => (
                  <td key={size.id} className="border px-4 py-2">
                    {entry.sizes[size.nombre!] || 0}
                  </td>
                ))}
                <td className="border px-4 py-2">{entry.total}</td>
              </tr>
            ))}
            {/* Fila de Totales */}
            <tr>
              <td className="border px-4 py-2 font-bold">Totales</td>
              {sizes.map((size) => (
                <td key={size.id} className="border px-4 py-2 font-bold">
                  {totalBySize[size.nombre!] || 0}
                </td>
              ))}
              <td className="border px-4 py-2 font-bold">{grandTotal}</td>
            </tr>
          </tbody>
        </table>

        {/* Gráfico de Barras */}
        <div style={{ width: "100%", height: 400, marginTop: "20px" }}>
          <Title>Total de Ocupación</Title>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                label={{
                  value: "Día/Mes",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Total de Ocupación",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" name="Ocupación" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </LayoutContainer>
  );
}
