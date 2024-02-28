"use client";
import { useState } from "react";
import { RouterOutputs } from "~/trpc/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Size } from "~/server/api/routers/sizes";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { format } from "date-fns";
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
}) {
  // const [reservas, setReservas] = useState<Reserve[]>();
  const [values, setValues] = useState<Record<string, number>>({});
  const { data: sizes, isLoading } = api.size.getAvailability.useQuery({
    nroSerieLocker: props.nroSerieLocker!,
    inicio: props.inicio!,
    fin: props.fin!,
  });

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
          }),
        );

        const updatedReserves = props.reserves
          ? [...props.reserves, ...newReserves]
          : [...newReserves];
        props.setReserves(updatedReserves);
      }
      props.setSizeSelected(true);
    } catch (error) {
      // Manejar errores aquí
    }
  }

  return (
    <main className="flex justify-center">
      {!props.sizeSelected && (
        <div className="container flex flex-col items-center justify-center gap-6 ">
          <h2 className="text-3xl font-semibold">
            Selecciona tamaño de tu taquilla.
          </h2>
          <div className="grid grid-cols-3 gap-4 ">
            {isLoading && <div>Cargando...</div>}
            {!isLoading && sizes?.length == 0 && <div>No hay tamaños.</div>}
            {!isLoading &&
              sizes.map((size: Size) => {
                return (
                  <div key={size.id}>
                    <Card
                      className="grid w-[45vh] overflow-hidden shadow-xl"
                      key={size.id}
                    >
                      <CardHeader>
                        <CardTitle> {size.nombre}</CardTitle>
                        <CardDescription>
                          Seleccione el tamaño de su locker.
                        </CardDescription>
                      </CardHeader>
                      <img
                        className="aspect-video object-cover"
                        src="/placeholder.svg"
                      ></img>
                      <CardFooter className="bg-green-100 backdrop-blur-sm">
                        <div className="flex pt-5">
                          <div className="">Número de taquillas</div>
                          <div className="float-end inline-flex">
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
                                (values[size.id] || 0) == size.cantidad! - 1
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
                          {/* <Button className="bg-orange-500	">+</Button> */}
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
          </div>
          <div className="">
            {!isLoading && sizes?.length != 0 && (
              <Button onClick={() => applyReserve()}>APLICAR</Button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
