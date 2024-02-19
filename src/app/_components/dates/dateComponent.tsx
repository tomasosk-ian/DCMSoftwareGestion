import { Title } from "~/components/title";
import { Calendar } from "~/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function DateComponent(props: {
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>();

  function handleClick() {
    props.setStartDate(format(range!.from!, "yyyy-MM-dd'T'00:00:00"));
    props.setEndDate(format(range!.to!, "yyyy-MM-dd'T'23:59:59"));
  }
  function onlyToday() {
    const today = Date.now();
    props.setStartDate(format(today, "yyyy-MM-dd'T'00:00:00"));
    props.setEndDate(format(today, "yyyy-MM-dd'T'23:59:59"));
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
                onSelect={setRange}
                numberOfMonths={2}
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
                  Confirmar
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
