"use client";
import { useState, useMemo } from "react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function LockerOcupationPage() {
  const router = useRouter();

  const [tempStartDate, setTempStartDate] = useState("2024-01-01");
  const [tempEndDate, setTempEndDate] = useState("2024-12-31");

  const [startDate, setStartDate] = useState(tempStartDate);
  const [endDate, setEndDate] = useState(tempEndDate);

  const { data: averageDurationData } =
    api.reports.getAverageReservationDuration.useQuery({
      startDate: "2024-01-01", // Puedes reemplazar esto con las fechas deseadas
      endDate: "2024-12-31",
    });
  const { data: ocupationData } = api.reports.getOcupattion.useQuery({
    startDate,
    endDate,
  });
  const { data: sizes } = api.reports.getSizes.useQuery();
  const { data: transactionsData } =
    api.transaction.getTransactionsByDate.useQuery({
      startDate,
      endDate,
    });
  const { data: capacityBySize } =
    api.reports.getTotalBoxesAmountPerSize.useQuery();

  const applyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const totalBySize = useMemo(() => {
    if (!ocupationData || !sizes) return {};

    // Agrupar ocupación por tamaño único
    const groupedSizes = ocupationData.reduce(
      (acc, entry) => {
        Object.entries(entry.sizes).forEach(([sizeName, count]) => {
          // Sumar los valores de tamaños duplicados
          acc[sizeName] = (acc[sizeName] || 0) + count;
        });
        return acc;
      },
      {} as { [sizeName: string]: number },
    );

    return groupedSizes;
  }, [ocupationData]);

  const grandTotal = useMemo(() => {
    return Object.values(totalBySize).reduce((acc, count) => acc + count, 0);
  }, [totalBySize]);

  const totalReservationsFromDuration = useMemo(() => {
    return (
      averageDurationData?.data?.reduce(
        (acc, curr) => acc + (curr.reservations || 0),
        0,
      ) || 0
    );
  }, [averageDurationData]);

  const totalCapacity = useMemo(() => {
    if (!capacityBySize) return 0;
    return Object.values(capacityBySize).reduce((acc, value) => acc + value, 0);
  }, [capacityBySize]);

  const chartDataOccupation =
    ocupationData?.map((entry) => ({
      day: entry.day,
      percentage: ((entry.total / totalCapacity) * 100).toFixed(2),
    })) || [];

  const pieData = useMemo(() => {
    if (!sizes) return [];

    // Crear datos de torta consolidados
    return sizes
      .reduce(
        (acc, size) => {
          const sizeName = size.nombre!;
          const existingSize = acc.find((item) => item.name === sizeName);
          const value = totalBySize[sizeName] || 0;

          if (existingSize) {
            existingSize.value += value; // Sumar valores si ya existe
          } else {
            acc.push({ name: sizeName, value }); // Crear nuevo grupo
          }
          return acc;
        },
        [] as { name: string; value: number }[],
      )
      .filter((data) => data.value > 0); // Filtrar tamaños con valor 0
  }, [sizes, totalBySize]);

  const dailyReservationsData =
    ocupationData?.map((entry) => ({
      day: entry.day,
      reservations: entry.total,
    })) || [];

  const billingByDay = useMemo(() => {
    if (!transactionsData) return { data: [], total: 0 };

    const billingMap: { [day: string]: number } = {};
    let totalAmount = 0;

    transactionsData?.forEach((transaction) => {
      const date = new Date(transaction.confirmedAt!);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
      const amount = transaction.amount || 0;
      billingMap[formattedDate] = (billingMap[formattedDate] || 0) + amount;
      totalAmount += amount;
    });

    const result = Object.entries(billingMap)
      .map(([day, amount]) => ({
        day,
        amount,
        date: new Date(day.split("/").reverse().join("/")),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ day, amount }) => ({ day, amount }));

    return { data: result, total: totalAmount };
  }, [transactionsData]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  if (!ocupationData || !sizes) return <div>No hay datos disponibles</div>;

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Ocupación de Lockers</Title>
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
              <th className="border px-4 py-2">%</th>
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
                <td className="border px-4 py-2">
                  {((entry.total / totalCapacity) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2 font-bold">Totales</td>
              {sizes.map((size) => (
                <td key={size.id} className="border px-4 py-2 font-bold">
                  {totalBySize[size.nombre!] || 0}
                </td>
              ))}
              <td className="border px-4 py-2 font-bold">{grandTotal}</td>
              <td className="border px-4 py-2 font-bold">100%</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Capacidad</td>
              {sizes.map((size) => (
                <td key={size.id} className="border px-4 py-2 font-bold">
                  {capacityBySize ? capacityBySize[size.nombre!] || 0 : 0}
                </td>
              ))}
              <td className="border px-4 py-2 font-bold">{totalCapacity}</td>
              <td className="border px-4 py-2 font-bold">-</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 space-y-8">
          <div style={{ width: "100%", height: 400 }}>
            <Title>Porcentaje de Ocupación vs Días</Title>
            <ResponsiveContainer>
              <BarChart
                data={chartDataOccupation}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Días",
                    position: "insideBottom",
                    offset: -10,
                    fontSize: 14,
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Porcentaje de Ocupación",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 14,
                  }}
                />

                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="percentage"
                  fill="#8884d8"
                  name="Ocupación (%)"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <Title>Total de Ocupación</Title>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <Title>Reservas por Día</Title>
            <ResponsiveContainer>
              <BarChart data={dailyReservationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: "Reservas", angle: -90 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="reservations"
                  fill="#ffc658"
                  name="Reservas por Día"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <Title>Facturación por Día</Title>
            <p>
              <strong>Total Facturación:</strong> $
              {billingByDay.total.toFixed(2)}
            </p>
            <ResponsiveContainer>
              <BarChart data={billingByDay.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: "Facturación", angle: -90 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" name="Facturación" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <Title>Duración Promedio de Reserva</Title>
            <p className="mt-2 text-center text-gray-700">
              <strong>Total de reservas:</strong>{" "}
              {totalReservationsFromDuration}
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={averageDurationData?.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="days"
                  label={{
                    value: "Días",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Reservas",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservations" fill="#8884d8" name="Reservas" />
                <Bar
                  dataKey="averageDays"
                  fill="#82ca9d"
                  name="Promedio (días)"
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-4 text-center">
              <strong>Promedio de duración:</strong>{" "}
              {averageDurationData?.averageDuration.toFixed(2)} días
            </p>
          </div>
        </div>
      </section>
    </LayoutContainer>
  );
}
