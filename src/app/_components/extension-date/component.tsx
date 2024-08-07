import { Title } from "~/components/title";
import { Calendar } from "~/components/ui/calendar";
import { differenceInDays, format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import ButtonCustomComponent from "../../../components/buttonCustom";
import { ChevronRightIcon } from "lucide-react";
import { api } from "~/trpc/react";
import { Reserve } from "~/server/api/routers/reserves";
import { Client } from "~/server/api/routers/clients";
import { Store } from "~/server/api/routers/store";

export default function DateComponent(props: {
  startDate: string | undefined;
  setStartDate: (startDate: string) => void;
  endDate: string | undefined;
  setEndDate: (endDate: string) => void;
  days: number;
  setDays: (days: number) => void;
  token: number;
  email: string;
  setReserve: (reserve: Reserve) => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [date, setDate] = useState<Date>();

  const { data: reserve } = api.reserve.getByToken.useQuery({
    token: props.token,
    email: props.email,
  });
  useEffect(() => {
    if (reserve) {
      const today = new Date();
      today.setHours(23, 59, 0, 0);
      const fromDate = new Date(reserve.FechaFin!);
      // const days = differenceInDays(today, fromDate);
      // props.setDays(days + 1);
      setRange({ from: fromDate });
    }
  }, [reserve]);
  function getDays() {
    if (range) {
      const fromDate = range.from!;
      const toDate = range.to!;
      const differenceInTime = toDate?.getTime() - fromDate?.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      props.setDays(differenceInDays);
    }
  }
  function handleClick() {
    const today = Date.now();
    props.setEndDate(format(range!.to!, "yyyy-MM-dd'T'23:59:59"));
    props.setStartDate(format(range!.from!, "yyyy-MM-dd'T'23:00:00"));
    console.log("la reserva essss handleClick", reserve);
    // const updatedReserve = updateReserve({
    //   identifier: reserve?.identifier!,
    //   FechaFin: format(range!.to!, "yyyy-MM-dd'T'23:59:59"),
    //   FechaInicio: reserve?.FechaInicio!,
    // });
    props.setReserve(reserve!);

    getDays();
  }
  function onlyToday() {
    const today = Date.now();
    props.setEndDate(format(today, "yyyy-MM-dd'T'23:59:59"));
    props.setStartDate(format(range!.from!, "yyyy-MM-dd'T'23:00:00"));
    // const updatedReserve = updateReserve({
    //   identifier: reserve?.identifier!,
    //   FechaFin: format(today, "yyyy-MM-dd'T'23:59:59"),
    //   FechaInicio: reserve?.FechaInicio!,
    // });
    // updatedReserve.then(async (res) => {
    props.setReserve(reserve!);
    // });
    getDays();
  }
  if (!reserve) return <div>cargando...</div>;
  return (
    <div>
      {!props.endDate && (
        <div className="container flex flex-col items-center justify-center gap-6 ">
          <h2 className="text-3xl font-semibold">
            ¿Hasta cuándo querés extender tu reserva?
          </h2>
          <div className="justify-center">
            <div className="w-full">
              <Calendar
                mode="range"
                selected={range}
                onSelect={(e) => {
                  const toDate = e?.to!;
                  const days = differenceInDays(toDate, range?.from!);
                  props.setDays(days + 1);
                  setRange(e);
                }}
                numberOfMonths={2}
                disabled={(date) =>
                  date <
                  new Date(new Date(reserve.FechaFin!).setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </div>
            <div className="flex flex-col pt-1 md:flex-row-reverse md:justify-between">
              <div className="mb-2 px-1 md:mb-0 md:w-1/2 lg:w-1/4">
                <ButtonCustomComponent
                  onClick={handleClick}
                  disabled={range?.to == undefined}
                  text={`Aplicar ${props.days} días`}
                />
              </div>
              <div className="px-1 md:mb-0 md:w-1/2 lg:w-1/4">
                <ButtonCustomComponent
                  disabled={new Date() <= new Date(reserve.FechaFin!)}
                  onClick={onlyToday}
                  text={`Solo hoy`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
