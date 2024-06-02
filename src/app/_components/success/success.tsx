"use client";

import { CheckCircle, DownloadIcon, XCircle } from "lucide-react";
import { useRef } from "react";
import { usePDF } from "react-to-pdf";
import ButtonCustomComponent from "~/components/buttonCustom";

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
}) {
  const { toPDF, targetRef } = usePDF({
    filename: `comprobante${props.checkoutNumber ? props.checkoutNumber : ""}.pdf`,
  });
  const ref = useRef();
  function getSize(idSize: number) {
    console.log("--------------------------------------------");
    console.log(props.sizes);
    console.log(idSize);
    const size = props.sizes!.find((s: Size) => s.id === idSize);
    return size!.nombre;
  }
  return (
    <main className="flex justify-center pb-5">
      {props.reserves && (
        <div className="">
          <div
            ref={targetRef}
            className="w-96 overflow-hidden rounded-3xl bg-white shadow-md"
          >
            <div className="justify-between bg-[#e2f0e9] px-6  py-2">
              <div className="flex justify-center  space-x-14 text-sm ">
                <CheckCircle
                  color="#FF813A"
                  className="border-buttonPick h-auto w-1/2"
                />
              </div>
              <div className="flex justify-center space-x-14 pt-4 text-sm font-bold text-[#848484]">
                <p>Su pago se ha completado exitosamente.</p>
              </div>
            </div>
            <div className=" bg-gray-100 px-8 py-5 ">
              <div className=" space-y-1">
                <div className=" flex justify-between text-sm">
                  <p>Local</p>
                  <p className="text-[#848484]">{props.store.name}</p>
                </div>
                <hr className="border-[#848484]" />

                <div className=" flex justify-between text-sm">
                  <p>Número de orden</p>
                  <p className="text-[#848484]">{props.nReserve}</p>
                </div>
                <hr className="border-[#848484]" />

                <div className=" flex justify-between text-sm">
                  <p>Id. Organización</p>
                  <p className="text-[#848484]">
                    {" "}
                    {props.store.organizationName}
                  </p>
                </div>
                <hr className="border-[#848484]" />

                <div className=" flex justify-between text-sm">
                  <p>Número de factura</p>
                  <p className="text-[#848484]">123465</p>
                </div>
                <hr className="border-[#848484]" />

                <div className=" flex justify-between text-sm">
                  <p>Precio Total</p>
                  <p className="text-[#848484]">
                    {" "}
                    {props.coin!.description} {props.total}
                  </p>
                </div>
                <hr className="border-[#848484]" />

                {props.reserves.map((r, index) => (
                  <div>
                    <div className=" flex justify-between text-sm">
                      <p>Token ({getSize(r.IdSize!)})</p>
                      <p className="text-[#848484]">{r.Token1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between space-x-2 pt-4">
            <div className="w-full">
              <ButtonCustomComponent
                onClick={async () => {
                  location.reload();
                }}
                text="Cerrar"
                icon={<XCircle className="h-4 w-4 space-x-4" />}
              />
            </div>
            <div className="w-full">
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
