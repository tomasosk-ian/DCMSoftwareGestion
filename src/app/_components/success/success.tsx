"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, DownloadIcon, XCircle } from "lucide-react";
import { useRef } from "react";
import { usePDF } from "react-to-pdf";
import ButtonCustomComponent from "~/components/buttonCustom";
import QRCode from "react-qr-code";

import { Coin } from "~/server/api/routers/coin";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Size } from "~/server/api/routers/sizes";
import { Store } from "~/server/api/routers/store";
import { api } from "~/trpc/react";

export default function Success(props: {
  reserves: Reserve[];
  store: Store;
  nReserve: number;
  total: number;
  coin?: Coin;
  checkoutNumber: string;
  sizes: Size[];
  endDate: string | undefined;
}) {
  const { toPDF, targetRef } = usePDF({
    filename: `comprobante${props.checkoutNumber ? props.checkoutNumber : ""}.pdf`,
  });
  function getSize(idSize: number) {
    const size = props.sizes!.find((s: Size) => s.id === idSize);
    return size!.nombre;
  }
  function formatDateToTextDate(dateString?: string): string {
    if (dateString) {
      const date = new Date(dateString);
      const formattedDate = format(date, "eee dd MMMM", { locale: es });
      return formattedDate;
    }
    return "";
  }
  return (
    <main className="flex justify-center px-4 pb-5">
      {props.reserves && (
        <div className="w-full max-w-xl">
          <div
            ref={targetRef}
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-md"
          >
            <div className="justify-between bg-[#e2f0e9] px-6 py-4">
              <div className="flex justify-center space-x-14 text-sm">
                <CheckCircle
                  color="#FF813A"
                  className="h-auto w-12 sm:w-16 md:w-20"
                />
              </div>
              <div className="flex justify-center pt-4 text-center text-sm font-bold text-[#848484]">
                <p>Tu pago se ha completado exitosamente.</p>
              </div>
              <div className="flex justify-center pt-4 text-center text-xs italic text-[#848484]">
                <p>Te enviaremos un código para que puedas abrir tu locker.</p>
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-4">
              <div>
                <div className="py-2">
                  <div className="flex justify-between text-sm">
                    <p>Número de reserva</p>
                    <p className="text-[#848484]">{props.nReserve}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Organización</p>
                    <p className="text-[#848484]">
                      {props.store.organizationName}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Local</p>
                    <p className="text-[#848484]">{props.store.name}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Dirección</p>
                    <p className="text-[#848484]">{props.store.address}</p>
                  </div>
                </div>
                <hr className="my-2 border-[#848484]" />
                <div className="py-2">
                  <div className="flex justify-between text-sm">
                    <p>Importe</p>
                    <p className="text-[#848484]">
                      {props.coin?.description} {props.total}
                    </p>
                  </div>
                </div>
                <hr className="my-2 border-[#848484]" />
                <div className="py-2">
                  <div className="flex justify-between text-sm">
                    <p>
                      <b>Período</b>
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Entrega</p>
                    <p className="text-[#848484]">
                      {formatDateToTextDate(props.reserves[0]?.FechaInicio!)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Retiro</p>
                    <p className="text-[#848484]">
                      {formatDateToTextDate(
                        props.endDate ?? props.reserves[0]?.FechaFin!,
                      )}
                    </p>
                  </div>
                </div>
                <hr className="my-2 border-[#848484]" />
                <div className="py-2">
                  <div className="flex justify-between text-sm">
                    <p>
                      <b>Tokens</b>
                    </p>
                  </div>
                  {props.reserves.map((r, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center justify-between gap-4 py-2 text-sm"
                    >
                      <div>
                        <p>Token ({getSize(r.IdSize!)})</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <QRCode
                          className="w-20 sm:w-28"
                          size={128}
                          style={{ height: "auto", width: "75%" }}
                          value={r.Token1?.toString() ?? ""}
                          viewBox={`0 0 128 128`}
                        />
                        <p className="mt-2 text-center text-[#848484]">
                          {r.Token1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 sm:flex-nowrap">
            <div className="max-w-[200px] flex-1">
              <ButtonCustomComponent
                onClick={async () => {
                  location.reload();
                }}
                text="Cerrar"
                icon={<XCircle className="h-4 w-4 space-x-4" />}
              />
            </div>
            <div className="max-w-[200px] flex-1">
              <ButtonCustomComponent
                onClick={() => toPDF()}
                text="Descargar"
                icon={<DownloadIcon className="h-4 w-4 space-x-4" />}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
