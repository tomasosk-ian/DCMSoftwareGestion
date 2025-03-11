"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, DownloadIcon, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import ButtonCustomComponent from "~/components/buttonCustom";
import QRCode from "react-qr-code";

import { Coin } from "~/server/api/routers/coin";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Size } from "~/server/api/routers/sizes";
import { Store } from "~/server/api/routers/store";

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
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({
      top: 110,
      behavior: "smooth",
    });
  }, []);

  function getSize(idSize: number) {
    const size = props.sizes!.find((s: Size) => s.id === idSize);
    return size?.nombre ?? "";
  }

  function formatDateToTextDate(dateString?: string): string {
    if (dateString) {
      const date = new Date(dateString);
      return format(date, "eee dd MMMM", { locale: es });
    }
    return "";
  }

  const downloadImage = async () => {
    if (!targetRef.current) return;

    const canvas = await html2canvas(targetRef.current, { scale: 2 });
    const image = canvas.toDataURL("image/jpeg");

    const link = document.createElement("a");
    link.href = image;
    link.download = `comprobante_${props.checkoutNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex max-h-screen justify-center px-1 pb-1">
      {props.reserves && (
        <div className="w-full max-w-md">
          <div
            ref={targetRef}
            className="w-full overflow-hidden rounded-lg bg-white shadow-sm"
          >
            <div className="bg-[#e2f0e9] px-1 py-2">
              <div className="flex justify-center text-sm">
                <CheckCircle color="#FF813A" className="w-10" />
              </div>
              <div className="flex justify-center pt-1 text-center text-sm font-bold text-[#848484]">
                <p>Tu pago se ha completado exitosamente.</p>
              </div>
              <div className="flex justify-center pt-1 text-center text-xs italic text-[#848484]">
                <p>Descarga tu token para que puedas abrir el locker.</p>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-3">
              <div className="text-xs">
                <div className="flex justify-between">
                  <p>
                    <b>Número de reserva</b>
                  </p>
                  <p>{props.nReserve}</p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <b>Organización</b>
                  </p>
                  <p>{props.store.organizationName}</p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <b>Local</b>
                  </p>
                  <p>{props.store.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <b>Dirección</b>
                  </p>
                  <p>{props.store.address}</p>
                </div>
              </div>
              <hr className="my-2 border-[#848484]" />
              <div className="text-xs">
                <div className="flex justify-between">
                  <p>
                    <b>Importe</b>
                  </p>
                  <p>
                    {props.coin?.description} {props.total}
                  </p>
                </div>
              </div>
              <hr className="my-2 border-[#848484]" />
              <div className="text-xs">
                <div className="flex justify-between">
                  <p>
                    <b>Período</b>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Entrega</p>
                  <p>{formatDateToTextDate(props.reserves[0]?.FechaFin!)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Retiro</p>
                  <p>
                    {formatDateToTextDate(
                      props.endDate ?? props.reserves[0]?.FechaFin!,
                    )}
                  </p>
                </div>
              </div>
              <hr className="my-2 border-[#848484]" />
              <div className="text-xs">
                <p>
                  <b>Tokens</b>
                </p>
                {props.reserves.map((r, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2"
                  >
                    <div>
                      <p>Token ({getSize(r.IdSize!)})</p>
                    </div>
                    <div>
                      <QRCode
                        size={75}
                        value={r.Token1?.toString() ?? ""}
                        viewBox="0 0 128 128"
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
          <div className="flex items-center justify-between gap-2 pt-2">
            <ButtonCustomComponent
              onClick={() => location.reload()}
              text="Cerrar"
              icon={<XCircle className="h-4 w-4" />}
            />
            <ButtonCustomComponent
              onClick={downloadImage}
              text="Descargar"
              icon={<DownloadIcon className="h-4 w-4" />}
            />
          </div>
        </div>
      )}
    </main>
  );
}
