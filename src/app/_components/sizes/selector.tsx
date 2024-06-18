"use client";
import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Size } from "~/server/api/routers/sizes";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { differenceInDays, format } from "date-fns";
import { Fee } from "~/server/api/routers/fee";
import { Coin } from "~/server/api/routers/coin";
import SizeCard from "./size-card";
import ButtonCustomComponent from "~/components/buttonCustom";
import { ChevronRightIcon } from "lucide-react";

export default function SizeSelector(props: {
  size: Size | null;
  setSize: (size: Size) => void;
  nroSerieLocker: string | null;
  inicio: string | undefined;
  fin: string | undefined;
  setSizeSelected: (sizeSelected: boolean) => void;
  sizeSelected: boolean;
  reserves: Reserve[] | null;
  setReserves: (reserves: Reserve[]) => void;
  startDate: string;
  endDate: string;
  coins: Coin[];
  setFailedResponse: (failedResponse: boolean) => void;
  failedResponse: boolean;
  setTotal: (total: number) => void;
  total: number;
}) {
  const [values, setValues] = useState<Record<string, number>>({});
  const { data: fees } = api.fee.get.useQuery();
  const [coin, setCoin] = useState<Coin>();
  // const { mutateAsync: reservarBox } =
  //   api.lockerReserve.reserveBox.useMutation();
  const [updatedReserve, setUpdatedReserve] = useState<Reserve[]>([]);
  const [updatedReserveWithToken, setUpdatedReserveWithToken] = useState<
    Reserve[]
  >([]);
  const { data: sizes, isLoading } = api.size.getAvailability.useQuery({
    nroSerieLocker: props.nroSerieLocker!,
    inicio: props.inicio!,
    fin: props.fin!,
  });
  useEffect(() => {
    try {
      if (values) {
        const newReserves: Reserve[] = Object.entries(values).map(
          ([id, cantidad]) => ({
            IdLocker: null,
            NroSerie: props.nroSerieLocker,
            IdSize: parseInt(id),
            IdBox: null,
            Token1: null,
            FechaCreacion: format(Date.now(), "yyyy-MM-dd'T'00:00:00"),
            FechaInicio: props.startDate!,
            FechaFin: props.endDate!,
            Contador: -1,
            Confirmado: false,
            Modo: "Por fecha",
            Cantidad: cantidad,
            client: null,
          }),
        );

        if (fees) {
          let totalPrice = 0;
          setCoin(
            props.coins?.find((s: Coin) => s.identifier === fees![0]?.coin)!,
          );
          const prices: Record<number, number> = {};
          newReserves.forEach((reserve) => {
            const days = differenceInDays(
              reserve?.FechaFin!,
              reserve?.FechaCreacion!,
            );

            const price = fees?.find(
              (s: Fee) => s.size === reserve.IdSize,
            )?.value!;
            const discount = fees?.find(
              (s: Fee) => s.size === reserve.IdSize,
            )?.discount!;

            prices[reserve.IdSize!] = price;
            if (days >= 1) {
              totalPrice +=
                price * reserve.Cantidad! +
                (price * reserve.Cantidad! * days * (100 - discount)) / 100; // Sumar al total local
            } else {
              totalPrice += price * reserve.Cantidad!;
            }
          });
          totalPrice = parseFloat(totalPrice.toFixed(2));
          if (totalPrice != 0) {
            props.setTotal(totalPrice);
          }
        }
      }
    } catch (error) {
      // Manejar errores aquí
    }
  }, [fees, values]);
  function applyReserve() {
    try {
      if (values) {
        const newReserves: Reserve[] = Object.entries(values).flatMap(
          ([id, cantidad]) => {
            return Array.from({ length: cantidad }, () => ({
              IdLocker: null,
              NroSerie: props.nroSerieLocker,
              IdSize: parseInt(id),
              IdBox: null,
              Token1: null,
              FechaCreacion: format(Date.now(), "yyyy-MM-dd'T'00:00:00"),
              FechaInicio: props.startDate!,
              FechaFin: props.endDate!,
              Contador: -1,
              Confirmado: false,
              Modo: "Por fecha",
              Cantidad: 1,
              client: null,
            }));
          },
        );

        const updatedReserves = props.reserves
          ? [...props.reserves, ...newReserves]
          : [...newReserves];
        props.setReserves(updatedReserves);
        props.setSizeSelected(true);
      }
    } catch (error) {
      // Manejar errores aquí
    }
  }
  useEffect(() => {
    props.reserves?.map(async (reserve: Reserve) => {
      for (var i = 0; i < reserve.Cantidad!; i++) {
        try {
          const test = {
            ...reserve,
          };
          setUpdatedReserve((prevReserves) => [...prevReserves, test]);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }, [props.reserves]);

  useEffect(() => {
    const filteredValues: Record<string, number> = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value !== 0) {
        filteredValues[key] = value;
      }
    });

    if (JSON.stringify(filteredValues) !== JSON.stringify(values)) {
      setValues(filteredValues);
    }
  }, [values]);

  return (
    <main className="flex justify-center">
      {!props.sizeSelected && coin && (
        <div className="flex w-full flex-col items-center justify-center px-4 sm:px-0 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-semibold">
            Selecciona tamaño de tu Locker.
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {isLoading && (
              <div className="col-span-full text-center">Cargando...</div>
            )}
            {!isLoading && sizes?.length === 0 && (
              <div className="col-span-full text-center">No hay tamaños.</div>
            )}
            {!isLoading &&
              sizes.map((size: Size) => (
                <div key={size.id} className="h-full px-5 pb-5">
                  <SizeCard
                    coin={coin!}
                    size={size}
                    disabledMinus={(values[size.id] || 0) === 0}
                    onClickMinus={() =>
                      setValues({
                        ...values,
                        [size.id]: (values[size.id] || 0) - 1,
                      })
                    }
                    disabledPlus={(values[size.id] || 0) === size.cantidad!}
                    onClickPlus={() =>
                      setValues({
                        ...values,
                        [size.id]: (values[size.id] || 0) + 1,
                      })
                    }
                    value={`${values[size.id || 0] ? values[size.id]! : 0}`}
                  />
                </div>
              ))}
          </div>
          <div className="mt-4">
            {!isLoading && sizes?.length !== 0 && (
              <ButtonCustomComponent
                disabled={Object.keys(values).length === 0}
                onClick={applyReserve}
                text={`Finalizar ${coin?.description}${Object.keys(values).length === 0 ? 0 : props.total}`}
                after={true}
                icon={<ChevronRightIcon className="h-4 w-4 " />}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
