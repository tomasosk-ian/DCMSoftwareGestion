import { Title } from "~/components/title";
import { Calendar } from "~/components/ui/calendar";
import { differenceInDays, format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function DateComponent(props: {
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
  days: number;
  setDays: (days: number) => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [date, setDate] = useState<Date>();

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
    // props.setStartDate(format(range!.from!, "yyyy-MM-dd'T'00:00:00"));
    props.setStartDate(format(today, "yyyy-MM-dd'T'00:00:00"));
    props.setEndDate(format(range!.to!, "yyyy-MM-dd'T'23:59:59"));
    getDays();
  }
  function onlyToday() {
    const today = Date.now();
    props.setStartDate(format(today, "yyyy-MM-dd'T'00:00:00"));
    props.setEndDate(format(today, "yyyy-MM-dd'T'23:59:59"));
    getDays();
  }
  return (
    <div>
      {!props.endDate && (
        <div className="container flex flex-col items-center justify-center gap-6 ">
          <h2 className="text-3xl font-semibold">
            ¿Qué días necesitas tu taquilla?
          </h2>
          <div className="justify-center">
            <div>
              <Calendar
                mode="range"
                selected={range}
                onSelect={(e) => {
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);
                  const fromDate = currentDate;
                  const toDate = e?.to!;
                  const days = differenceInDays(toDate, fromDate);
                  props.setDays(days + 1);
                  setRange(e);
                }}
                numberOfMonths={2}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </div>
            <div className="flex flex-row-reverse pt-1">
              <div className="px-1">
                <Button
                  className="text-sm"
                  onClick={handleClick}
                  disabled={range?.to == undefined}
                >
                  APLICAR {props.days} DÍAS
                </Button>
              </div>
              <div className="px-1">
                <Button className="text-sm" onClick={onlyToday}>
                  Solo hoy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
