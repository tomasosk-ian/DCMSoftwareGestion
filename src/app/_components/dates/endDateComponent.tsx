import { format } from "date-fns";
import { Title } from "~/components/title";
import { Calendar } from "~/components/ui/calendar";

export default function EndDateComponent(props: {
  endDate: String;
  setEndDate: (endDate: string) => void;
}) {
  return (
    <div>
      {!props.endDate && (
        <div>
          <Title>Fecha fin</Title>
          <Calendar
            mode="single"
            selected={props.endDate}
            onSelect={(e) => {
              const formattedDate = format(e!, "yyyy-MM-dd'T'HH:mm:ss");
              props.setEndDate(formattedDate);
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}
