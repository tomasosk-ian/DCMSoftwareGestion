import { Title } from "~/components/title";
import { Calendar } from "~/components/ui/calendar";
import { format, parseISO } from "date-fns";

export default function StartDateComponent(props: {
  startDate: String;
  setStartDate: (startDate: string) => void;
}) {
  return (
    <div>
      {!props.startDate && (
        <div>
          <Title>Fecha inicio</Title>
          <Calendar
            mode="single"
            selected={props.startDate}
            onSelect={(e) => {
              const formattedDate = format(e!, "yyyy-MM-dd'T'HH:mm:ss");
              props.setStartDate(formattedDate);
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}
