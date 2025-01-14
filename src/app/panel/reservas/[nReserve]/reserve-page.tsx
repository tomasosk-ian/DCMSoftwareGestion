"use client";

import LayoutContainer from "~/components/layout-container";
import { useRouter } from "next/navigation";
import { Reserves } from "~/server/api/routers/reserves";
import { Title } from "~/components/title";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, MouseEventHandler } from "react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { DayPicker } from "react-day-picker";
import { cn } from "~/lib/utils";
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
import { Button, buttonVariants } from "~/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Edit,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { Size } from "~/server/api/routers/sizes";
import { formatDate } from "~/utils/server/utils";

export default function ReservePage({
  reserve,
  sizes,
  transaction,
  isAdmin,
}: {
  reserve: Reserves[];
  sizes: Size[];
  transaction: any;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(reserve[0]?.FechaInicio!),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(reserve[0]?.FechaFin!),
  );

  const { data: stores } = api.store.get.useQuery();
  const { data: store } = api.store.getByNroSerie.useQuery({
    nroSerie: reserve[0]?.NroSerie!,
  });
  const { mutateAsync: updateReserve } =
    api.reserve.updateReserve.useMutation();

  if (!reserve.length) return <Title>No se encontró la reserva</Title>;
  if (!transaction)
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  const formatDate = (date: string | undefined) =>
    date ? format(new Date(date), "eee dd MMMM", { locale: es }) : "";

  const handleSave = async () => {
    if (startDate && endDate) {
      await updateReserve({
        identifier: reserve[0]?.identifier!,
        FechaInicio: startDate.toISOString(),
        FechaFin: endDate.toISOString(),
      });
      setEdit(false);
    }
  };

  const handleCancel = () => {
    setStartDate(new Date(reserve[0]?.FechaInicio!));
    setEndDate(new Date(reserve[0]?.FechaFin!));
    setEdit(false);
  };

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="rounded-3xl bg-white shadow-md">
          <header className="flex items-center gap-5 bg-[#848484] px-6 py-3 text-white">
            <p className="text-lg font-bold">
              Reserva n° {reserve[0]?.nReserve}
            </p>
            <p className="text-lg font-bold">
              {
                stores?.find((x) => x.serieLocker === reserve[0]?.NroSerie)
                  ?.name
              }
            </p>
            {isAdmin && (
              <Button
                onClick={edit ? handleSave : () => setEdit(true)}
                variant="ghost"
                className="ml-auto"
              >
                {edit ? <Save /> : <Edit />}
              </Button>
            )}
          </header>
          <div className="grid grid-cols-3 gap-5 bg-gray-100 p-6">
            <ClientInfo reserve={reserve[0]!} />
            <LockerInfo store={store} reserve={reserve[0]!} />
            <Dates
              edit={edit}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          </div>
          <Tokens reserve={reserve} sizes={sizes} />
          <Footer total={transaction.amount} />
        </div>
      </section>
    </LayoutContainer>
  );
}

const ClientInfo = ({ reserve }: { reserve: Reserves }) => (
  <div>
    <Field
      label="Nombre y Apellido"
      value={`${reserve.clients?.name} ${reserve.clients?.surname}`}
    />
    <Field label="Email" value={reserve.clients?.email ?? ""} />
    <Field
      label="Teléfono"
      value={reserve.clients?.telefono?.toString() ?? ""}
    />
  </div>
);

const LockerInfo = ({ store, reserve }: { store: any; reserve: Reserves }) => (
  <div>
    <Field label="Locker" value={reserve.NroSerie ?? ""} />
    <Field label="Local" value={store?.name} />
    <Field label="Organización" value={store?.organizationName} />
  </div>
);

const Dates = ({
  edit,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  edit: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
}) => (
  <div>
    {edit ? (
      <>
        <DatePicker
          label="Fecha inicio"
          date={startDate}
          onChange={setStartDate}
        />
        <DatePicker label="Fecha fin" date={endDate} onChange={setEndDate} />
      </>
    ) : (
      <>
        <Field
          label="Fecha inicio"
          value={formatDate(startDate?.toISOString() ?? "")}
        />
        <Field
          label="Fecha fin"
          value={formatDate(endDate?.toISOString() ?? "")}
        />
      </>
    )}
  </div>
);

const Tokens = ({ reserve, sizes }: { reserve: Reserves[]; sizes: Size[] }) => (
  <div className="flex justify-center bg-[#e2f0e9] py-3">
    <div className="grid grid-cols-2 gap-6">
      {reserve.map((r) => (
        <div key={r.IdSize} className="text-sm">
          <QRCode size={128} value={r.Token1?.toString() || "0"} />
          <Field
            label={`Token (${sizes.find((s) => s.id === r.IdSize)?.nombre})`}
            value={r.Token1!.toString()}
          />
          <Field label="Box" value={r.IdFisico?.toString() || "Sin asignar"} />
        </div>
      ))}
    </div>
  </div>
);

const Footer = ({ total }: { total: number }) => (
  <footer className="flex justify-between bg-gray-100 px-6 py-3">
    <p className="font-bold text-black">Total</p>
    <p className="font-bold text-black">{`ARS ${total}`}</p>
  </footer>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xxs">{label}</p>
    <p className="text-base font-bold text-orange-500">{value}</p>
  </div>
);

const DatePicker = ({
  label,
  date,
  onChange,
}: {
  label: string;
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
}) => (
  <div>
    <p className="mb-1 text-xxs">{label}</p>
    {/* <DayPicker
      mode="single"
      selected={date}
      onSelect={onChange}
      className="p-3"
      components={{
        IconLeft: ChevronLeftIcon,
        IconRight: ChevronRightIcon,
      }}
    /> */}
  </div>
);
