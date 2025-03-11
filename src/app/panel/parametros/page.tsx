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

  // Consulta de datos con fechas seleccionadas
  const { data: timeOut } = api.params.getTimeOut.useQuery();

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div>TimeOut Mobbex: {timeOut}</div>
      </section>
    </LayoutContainer>
  );
}
