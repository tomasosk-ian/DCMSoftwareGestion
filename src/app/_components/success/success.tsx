"use client";

import { Title } from "@radix-ui/react-toast";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Size } from "~/server/api/routers/sizes";
import { Store } from "~/server/api/routers/store";
import { api } from "~/trpc/react";

export default function Success(props: {
  reserves: Reserve[];
  store: Store;
  nReserve: number;
  total: number;
}) {
  const { data: sizes, isLoading } = api.size.get.useQuery();
  function getSize(idSize: number) {
    const size = sizes!.find((s: Size) => s.id === idSize);
    return size.nombre;
  }
  return (
    <main className="flex justify-center pb-5">
      {props.reserves && (
        <div>
          <div className="flex justify-center rounded-t-lg border border-black bg-green-200">
            <Title className="p-5 text-xl font-bold">
              Su pago se ha completado correctamente.
            </Title>
          </div>
          <div className="max-w-lg rounded-b-lg border border-black py-2">
            <div className="gap-4">
              <div className="flex justify-between gap-4 px-5 py-2">
                <div className="font-bold">Local</div>
                <div className="font-bold">{props.store.name}</div>
              </div>
              <div className="flex justify-between gap-4 px-5 py-2">
                <div className="font-bold">Número de orden</div>
                <div className="font-bold">{props.nReserve}</div>
              </div>
              <div className="flex justify-between gap-4 px-5 py-2">
                <div className="font-bold">Id organización</div>
                <div className="font-bold">Lockers Urbanos</div>
              </div>
              <div className="flex justify-between gap-4 px-5 py-2">
                <div className="font-bold">Número de factura</div>
                <div className="font-bold">123456</div>
              </div>
              <div className="flex justify-between gap-4 px-5 py-2">
                <div className="font-bold">Precio total</div>
                <div className="font-bold">{props.total}</div>
              </div>
              {props.reserves.map((r, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-4 px-5 py-2"
                >
                  <div className="">Token ({getSize(r.IdSize!)})</div>
                  <div className="">{r.Token1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
