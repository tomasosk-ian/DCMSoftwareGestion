"use client";

import { Title } from "@radix-ui/react-toast";
import { differenceInDays, format } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Store } from "~/server/api/routers/store";
import { es } from "date-fns/locale";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Size } from "~/server/api/routers/sizes";
import { api } from "~/trpc/react";
import { number } from "zod";
import { useEffect, useState } from "react";
import { Fee } from "~/server/api/routers/fee";
import { Coin } from "~/server/api/routers/coin";

export default function Booking(props: {
  store: Store;
  startDate: string;
  endDate: string;
  reserves: Reserve[];
}) {
  const { data: sizes, isLoading } = api.size.get.useQuery();
  const { data: fees } = api.fee.get.useQuery();
  const [total, setTotal] = useState<number>();
  const [subTotal, setSubTotal] = useState<number>(0);
  const [coin, setCoin] = useState<string>("");
  const [reserveGroupBySize, setReserveGroupBySize] = useState<
    Record<number, Reserve>
  >({});
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [count, setCount] = useState<Record<number, number>>({});
  const [discount, setDiscount] = useState<number>();
  const coins = api.coin.get.useQuery();
  useEffect(() => {
    const counts: Record<number, number> = {};

    props.reserves.forEach((reserve) => {
      if (reserve.IdSize !== undefined) {
        counts[reserve.IdSize!] = (counts[reserve.IdSize!] || 0) + 1;
      }
    });

    setCount(counts);
  }, [props.reserves]);
  useEffect(() => {
    const groupedReserves: Record<number, Reserve> = {};
    props.reserves.forEach((reserve) => {
      groupedReserves[reserve.IdSize!] = reserve;
    });
    setReserveGroupBySize(groupedReserves);
  }, [props.reserves]);

  useEffect(() => {
    if (fees) {
      let totalPrice = 0; // Variable local para llevar un seguimiento de la suma total

      const prices: Record<number, number> = {};
      props.reserves.forEach((reserve) => {
        const days = differenceInDays(
          reserve?.FechaFin!,
          reserve?.FechaCreacion!,
        );

        const price = fees?.find((s: Fee) => s.size === reserve.IdSize)?.value!;
        setDiscount(
          fees?.find((s: Fee) => s.size === reserve.IdSize)?.discount!,
        );
        const coinId = fees?.find((s: Fee) => s.size === reserve.IdSize)?.coin!;
        if (coins)
          setCoin(
            coins?.data?.find((s: Coin) => s.identifier === coinId)
              ?.description!,
          );
        prices[reserve.IdSize!] = price;

        totalPrice +=
          price + (price * reserve.Cantidad! * days * (100 - discount!)) / 100; // Sumar al total local
        totalPrice = parseFloat(totalPrice.toFixed(2));
      });
      setTotal(totalPrice);
      setSubTotal(totalPrice);

      setPrices(prices);
    }
  }, [fees, discount]);
  function formatDateToTextDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = format(date, "eee dd MMMM", { locale: es });
    return formattedDate;
  }

  function getSizeNameById(id: number) {
    if (sizes) {
      const size = sizes?.find((s: Size) => s.id === id);
      const reserve = props.reserves.find((reserve) => reserve.IdSize === id);
      if (reserve) {
        return size ? size.nombre : "Tamaño no encontrado";
      }
    }
  }

  function getDays(size: Size) {
    const reserve = props.reserves.find(
      (reserve) => reserve.IdSize === size.id,
    );
    const days = differenceInDays(reserve?.FechaFin!, reserve?.FechaCreacion!);
    return (
      <>
        <div className="flex justify-between">
          <div className="right-64 grid-cols-6">
            <div className="grid-cols-6">
              <Label>Primer día</Label>
            </div>

            {days >= 1 && (
              <div className="grid-cols-6 gap-8">
                <Label className="pr-5">Días adicionales: {days}</Label>
                <Label className="text-red-500">
                  -{fees?.find((s: Fee) => s.size === size.id)?.discount!}%
                  aplicado
                </Label>
              </div>
            )}
          </div>
          <div className="grid-cols-6 ">
            <div className="grid-cols-6">
              <Label>
                {prices[size.id]!}{" "}
                {
                  coins?.data?.find(
                    (s: Coin) =>
                      s.identifier ===
                      fees?.find((s: Fee) => s.size === size.id)?.coin!,
                  )?.description!
                }
              </Label>
            </div>
            {days >= 1 && (
              <div className="grid-cols-6">
                <Label>
                  {parseFloat(
                    (
                      (prices[size.id]! * days * (100 - discount!)) /
                      100
                    ).toFixed(2),
                  )}{" "}
                  {coin}
                </Label>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="w-4/5 grid-cols-12 gap-4 bg-green-200 px-8 pt-3" id="root">
      <Title className="text-2xl font-bold text-slate-400">Tu reserva</Title>
      <div className="rounded py-5">
        <Card className="rounded bg-gray-50 pl-5 pr-5 ">
          <CardHeader className="">
            <CardTitle className="text-2xl"> {props.store.name}</CardTitle>
            <CardDescription>
              <div className=" flex justify-between pb-3 pt-2">
                <div className="right-64 grid-cols-6">
                  <div className="grid-cols-6">
                    <Label>Entrega desde </Label>
                  </div>
                  <div className="grid-cols-6">
                    <Label>Recogida hasta </Label>
                  </div>
                </div>
                <div className="grid-cols-6  items-end">
                  <div className="grid-cols-6">
                    <Label>{formatDateToTextDate(props.startDate)}</Label>
                  </div>
                  <div className="grid-cols-6">
                    <Label>{formatDateToTextDate(props.endDate)}</Label>
                  </div>
                </div>
              </div>
              <hr className=" h-1 w-full rounded border-0 bg-gray-400 dark:bg-gray-700 md:my-1" />
              <div>
                {sizes?.map((size: Size) => {
                  if (getSizeNameById(size.id!)) {
                    return (
                      <div className="flex justify-between gap-10 pr-28 ">
                        <div className=" pt-2">
                          <Title className=" font-bold">
                            Taquilla {getSizeNameById(size.id!)}
                          </Title>
                        </div>
                        <div className="flex-col pt-2">
                          {props.reserves.find(
                            (reserve) => reserve.IdSize === size.id,
                          )?.Cantidad == 1
                            ? "1 unidad"
                            : `${props.reserves.find(
                                (reserve) => reserve.IdSize === size.id,
                              )?.Cantidad} unidades`}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div>
        {sizes?.map((size: Size) => {
          if (getSizeNameById(size.id!)) {
            return (
              <div className="pb-5">
                <Title className="pb-2 font-bold">
                  Taquilla {getSizeNameById(size.id!)}
                </Title>
                {getDays(size)}
              </div>
            );
          }
        })}
        <hr className=" h-1 w-full rounded border-0 bg-gray-400 dark:bg-gray-700 md:my-3" />
        <div className="grid-cols-12">
          <div className=" flex justify-between">
            <div className="right-64 grid-cols-6">
              <div className="grid-cols-6">
                <Label className="text-xl text-slate-400">Subtotal </Label>
              </div>
            </div>
            <div className="grid-cols-6  items-end">
              <div className="grid-cols-6">
                <Label>
                  {subTotal} {coin}
                </Label>
              </div>
            </div>
          </div>
        </div>
        <hr className=" h-1 w-full rounded border-0 bg-gray-400 dark:bg-gray-700 md:my-3" />
        <div className="grid-cols-12 pb-2">
          <div className=" flex justify-between">
            <div className="right-64 grid-cols-6">
              <div className="grid-cols-6">
                <Label className="text-xl font-bold">Total </Label>
              </div>
            </div>
            <div className="grid-cols-6  items-end">
              <div className="grid-cols-6">
                <Label>
                  {total} {coin}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="h-4 border-b-2 border-gray-400 bg-gray-300"></div>
      </div>
    </div>
  );
}
