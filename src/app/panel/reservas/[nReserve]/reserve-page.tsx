"use client";

import LayoutContainer from "~/components/layout-container";
import { useRouter } from "next/navigation";
import { Reserves } from "~/server/api/routers/reserves";
import { Title } from "~/components/title";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Size } from "~/server/api/routers/sizes";
import { Loader2, LoaderIcon } from "lucide-react";
import { MouseEventHandler } from "react";
import { toast } from "sonner";
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
import { asTRPCError } from "~/lib/errors";
import { Button } from "~/components/ui/button";
import QRCode from "react-qr-code";

export default function ReservePage(props: {
  reserve: Reserves[];
  sizes: Size[];
}) {
  const router = useRouter();

  const { reserve } = props;
  if (reserve.length <= 0) return <Title>No se encontró la reserva</Title>;
  const { data: store } = api.store.getByNroSerie.useQuery({
    nroSerie: reserve[0]!.NroSerie!,
  });
  const { data: transaction } = api.transaction.getBynroReserve.useQuery({
    nReserve: reserve[0]!.nReserve!,
  });
  function formatDateToTextDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = format(date, "eee dd MMMM", { locale: es });
    return formattedDate;
  }
  function getSize(idSize: number) {
    const size = props.sizes!.find((s: Size) => s.id === idSize);
    return size!.nombre;
  }
  if (reserve.length <= 0) return <Title>No se encontró la reserva</Title>;
  if (!transaction)
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="w-auto overflow-hidden rounded-3xl bg-white shadow-md ">
          <div className="flex gap-5 bg-[#848484] px-6 pb-2 pt-3">
            <p className="text-lg font-bold text-white">
              Reserva n° {reserve[0]!.nReserve}
            </p>
            <p className="text-lg font-bold text-white">
              {reserve[0]!.NroSerie}
            </p>
          </div>
          <div className="flex justify-between bg-gray-100 px-8 pb-2 pt-1">
            <div className="  ">
              <p className=" mb-0 text-xxs">Nombre y Apellido</p>

              <p className=" mt-0 text-base font-bold text-orange-500">
                {reserve[0]!.clients?.name} {reserve[0]!.clients?.surname}
              </p>
              <p className=" mb-0 mt-3 text-xxs">Email</p>

              <p className=" mt-0 text-base font-bold text-orange-500">
                {reserve[0]!.clients?.email}
              </p>
              <p className=" mt-3   text-xxs">Telefono</p>
              <p className=" mt-0 text-base font-bold text-orange-500">
                {reserve[0]!.clients?.telefono}
              </p>
            </div>

            <div className="">
              {" "}
              <p className=" mb-0 text-xxs">Locker </p>
              <p className=" mt-0 text-base font-bold text-orange-500">
                {reserve[0]!.NroSerie}
              </p>
              <p className=" mb-0 mt-3 text-xxs">Local </p>
              <p className=" mt-0 text-base font-bold text-orange-500">
                {store?.name}
              </p>{" "}
            </div>

            <div className="  ">
              <p className=" mb-0 text-xxs ">Organización </p>
              <p className=" mt-0 text-base font-bold text-orange-500">
                {store?.organizationName}
              </p>
              <p className=" mb-0 mt-3 text-xxs">Fecha inicio </p>
              <p className=" mt-0 text-base font-bold text-orange-500">
                {formatDateToTextDate(reserve[0]!.FechaInicio ?? "")}
              </p>{" "}
              <p className=" mb-0 mt-3 text-xxs">Fecha fin </p>
              <p className=" mt-0 text-base font-bold text-orange-500">
                {formatDateToTextDate(reserve[0]!.FechaFin ?? "")}
              </p>
            </div>
          </div>
          <div className="flex justify-center bg-[#e2f0e9] py-1">
            <div className=" pb-3 pt-3 text-sm">
              <div className="grid grid-cols-2 gap-x-28">
                {reserve.map((r) => {
                  return (
                    <div
                      key={r.IdSize}
                      className="flex flex-col items-start text-sm"
                    >
                      <div className="py-3 font-semibold">
                        <p>
                          <QRCode
                            className="w-full"
                            size={256}
                            style={{ height: "auto", width: "50%" }}
                            value={r.Token1?.toString() ?? "0"}
                            viewBox={`0 0 256 256`}
                          />
                        </p>
                        <div className="flex items-center text-sm">
                          <p>Token ({getSize(r.IdSize!)})</p>
                          <p className="px-4 text-[#848484]">{r.Token1}</p>
                        </div>{" "}
                        <div className="flex items-center text-sm">
                          <p>Box</p>
                          <p className="px-4 text-[#848484]">
                            {r.IdFisico ?? (
                              <div className="text-xs">Sin asignar</div>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between  bg-gray-100 px-6 py-3">
            <p className="font-bold text-black">Total</p>
            <div className="flex items-baseline">
              <p className="text-xs font-bold text-black"> ARS </p>
              <p className=" font-bold text-black">{transaction?.amount}</p>
            </div>
          </div>
        </div>
      </section>
      {/* <DeleteReserve nReserve={reserve[0]!.nReserve!}></DeleteReserve> */}
    </LayoutContainer>
  );
}

function DeleteReserve(props: { nReserve: number }) {
  const { mutateAsync: deleteReserve, isLoading } =
    api.reserve.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteReserve({ nReserve: props.nReserve })
      .then(() => {
        router.push("../");
        toast.success("Se ha eliminado la reserva");
      })
      .catch((e) => {
        const error = asTRPCError(e)!;
        toast.error(error.message);
      });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar reserva
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que querés eliminar la reserva?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminar reserva permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 active:bg-red-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
