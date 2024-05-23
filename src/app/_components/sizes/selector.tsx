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
  setReserves1: (reserves: Reserve[]) => void;
  startDate: string;
  endDate: string;
  coins: Coin[];
  setFailedResponse: (failedResponse: boolean) => void;
  failedResponse: boolean;
}) {
  const [values, setValues] = useState<Record<string, number>>({});
  const [price, setPrice] = useState<number>(0);
  const { data: fees } = api.fee.get.useQuery();
  const [coin, setCoin] = useState<Coin>();
  const { mutateAsync: reservarBox } =
    api.lockerReserve.reserveBox.useMutation();
  const [updatedReserve, setUpdatedReserve] = useState<Reserve[]>([]);
  const [updatedReserveWithToken, setUpdatedReserveWithToken] = useState<
    Reserve[]
  >([]);
  const { data: sizes, isLoading } = api.size.getAvailability.useQuery({
    nroSerieLocker: props.nroSerieLocker!,
    inicio: props.inicio!,
    fin: props.fin!,
  });
  const [reservesUpdate, setReservesUpdate] = useState<boolean>(false);

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
            client: "ansel",
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
            setPrice(totalPrice);
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
            client: "ansel",
          }),
        );

        const updatedReserves = props.reserves
          ? [...props.reserves, ...newReserves]
          : [...newReserves];
        props.setReserves(updatedReserves);
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
    updatedReserve.map(async (reserve: Reserve) => {
      const response = parseInt(await reservarBox(reserve));

      if (!isNaN(response)) {
        const test = {
          ...reserve,
          IdTransaction: response ? response : undefined,
        };
        setUpdatedReserveWithToken((prevReserves) => [...prevReserves, test]);
      } else {
        props.setFailedResponse(true);
      }
    });
  }, [updatedReserve]);

  useEffect(() => {
    if (updatedReserveWithToken.length > 0) {
      props.setReserves1(updatedReserveWithToken);
      props.setSizeSelected(true);
    }
  }, [updatedReserveWithToken]);
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
    <main className="flex  justify-center">
      {!props.sizeSelected && (
        <div className=" flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">
            Selecciona tamaño de tu Locker.
          </h2>
          <div className="grid grid-cols-3">
            {isLoading && <div>Cargando...</div>}
            {!isLoading && sizes?.length == 0 && <div>No hay tamaños.</div>}
            {!isLoading &&
              sizes.map((size: Size) => {
                return (
                  <div key={size.id} className="h-full px-5 pb-5">
                    <Card className="  h-96 w-72  overflow-hidden bg-emerald-100 backdrop-blur-sm">
                      <Card
                        style={{
                          clipPath: "polygon(29% 1%,1% 1%,1% 24%)",
                        }}
                        className="  absolute h-full w-full   bg-transparent"
                      >
                        <p className="absolute left-5 top-4 font-bold text-black">
                          {size.nombre}
                        </p>
                      </Card>
                      <Card
                        style={{
                          clipPath:
                            "polygon(1% 29%, 29% 1%, 99% 1%, 99% 99%, 1% 99%)",
                        }}
                        className="h-80 w-full overflow-hidden bg-white"
                      >
                        <img
                          style={{
                            clipPath:
                              "polygon(1% 29%, 29% 1%, 99% 1%, 99% 99%, 1% 99%)",
                            objectFit: "contain",
                            width: "100%",
                            height: "100%",
                          }}
                          className="aspect-radio"
                          src={size.image ? size.image! : "/placeholder.svg"}
                          alt="Image"
                        />
                      </Card>
                      <div className="flex gap-32 ">
                        <p className="px-1 text-slate-500">Primer día</p>
                        <p>
                          {fees?.find((s: Fee) => s.size === size.id)?.value!}{" "}
                          {coin?.description}
                        </p>
                      </div>
                      {size.cantidad != 0 && (
                        <div className="flex gap-4">
                          <div className="px-1 text-slate-500">
                            Número de Lockers
                          </div>
                          <div className=" inline-flex pb-5">
                            <button
                              disabled={(values[size.id] || 0) == 0}
                              onClick={() =>
                                setValues({
                                  ...values,
                                  [size.id]: (values[size.id] || 0) - 1,
                                })
                              }
                              className="w-10 rounded-l bg-orange-500 font-bold text-gray-800 hover:bg-gray-400"
                            >
                              -
                            </button>
                            <Input
                              className="flex w-10 rounded-l rounded-r bg-gray-300 text-black"
                              disabled={true}
                              value={`${
                                values[size.id || 0] ? values[size.id]! : 0
                              }`}
                            ></Input>
                            <button
                              disabled={
                                (values[size.id] || 0) == size.cantidad!
                              }
                              onClick={() =>
                                setValues({
                                  ...values,
                                  [size.id]: (values[size.id] || 0) + 1,
                                })
                              }
                              className="w-10 rounded-r bg-orange-500  font-bold text-gray-800 hover:bg-gray-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      {size.cantidad == 0 && (
                        <div className="flex gap-4 text-red-600">
                          No hay lockers disponibles
                        </div>
                      )}
                    </Card>
                  </div>
                );
              })}
          </div>
          <div>
            {!isLoading && sizes?.length != 0 && (
              <Button
                disabled={Object.keys(values).length === 0}
                onClick={applyReserve}
                className="bottom-0 w-full rounded-full border-black bg-emerald-100 pt-3 font-bold text-black hover:bg-emerald-400"
              >
                FINALIZAR: {Object.keys(values).length === 0 ? 0 : price}
                {coin?.description}
              </Button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
