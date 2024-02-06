"use client";

import { useState } from "react";
import { City } from "~/server/api/routers/city";
import { Button } from "~/components/ui/button";
import CitySelector from "./city/selector";
import StoreSelector from "./store/selector";
import { Store } from "~/server/api/routers/store";
import { Size } from "~/server/api/routers/sizes";
import SizeSelector from "./sizes/selector";
import { Menubar } from "~/components/ui/menubar";
import { api } from "~/trpc/react";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { stores } from "~/server/db/schema";
import StartDateComponent from "./dates/startDateComponent";
import EndDateComponent from "./dates/endDateComponent";
import { ZodNull, nullable } from "zod";
import { toast } from "sonner";

export default function HomePage(props: { cities: City[]; sizes: Size[] }) {
  const [city, setCity] = useState<City | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[] | undefined>();
  const [size, setSize] = useState<Size | null>(null);
  const [creationDate, setCreationDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [idLocker, setIdLocker] = useState<number>(0);
  const [reserva, setReserva] = useState<Reserve | undefined>(undefined);
  const { mutateAsync: reservarBox } = api.pokemon.reserveBox.useMutation();

  if (city != null) {
  }

  return (
    <div className="container">
      <Menubar className="border-0 shadow-none">
        {city && !store && !size && !startDate && !endDate && (
          <Button onClick={() => setCity(null)}>volver</Button>
        )}
        {store && !size && !startDate && !endDate && (
          <Button onClick={() => setStore(null)}>volver</Button>
        )}
        {size && !startDate && !endDate && (
          <Button onClick={() => setSize(null)}>volver</Button>
        )}
        {startDate && !endDate && (
          <Button onClick={() => setStartDate(undefined)}>volver</Button>
        )}
        {endDate && (
          <Button onClick={() => setEndDate(undefined)}>volver</Button>
        )}
      </Menubar>
      <div className="flex flex-col items-center justify-center">
        <CitySelector
          cities={props.cities}
          city={city}
          setCity={setCity}
          setStores={setStores}
        />
        {city && (
          <StoreSelector stores={stores} store={store} setStore={setStore} />
        )}

        {store && (
          <StartDateComponent
            startDate={startDate!}
            setStartDate={setStartDate}
          />
        )}
        {startDate && (
          <EndDateComponent endDate={endDate!} setEndDate={setEndDate} />
        )}
        {endDate && (
          <SizeSelector sizes={props.sizes} size={size} setSize={setSize} />
        )}
        {size && (
          <Button
            type="submit"
            onClick={async () => {
              console.log(startDate);
              console.log(endDate);
              const response = await reservarBox({
                NroSerie: store!.serieLocker!,
                IdLocker: null,
                IdSize: size!.id,
                IdBox: null,
                Token1: null,
                FechaCreacion: "2024-01-31T08:00:00",
                FechaInicio: startDate!,
                FechaFin: endDate!,
                Contador: -1,
                Confirmado: false,
                Modo: "Por fecha",
              });
              if (response.ok) {
                // const fecha =         `http://192.168.88.191:8000/api/token/reservar/${startDate.}`;
                const jsonResponse = await response.json();
                console.log(response);
                toast.success("Reserva exitosa");
              } else {
                console.log(response);
                toast.error("Reserva errónea");
              }
              setCity(null);
              setSize(null);
              setStore(null);
              setStartDate(undefined);
              setEndDate(undefined);
              setStores(undefined);
            }}
          >
            Reservar locker
          </Button>
        )}
      </div>
    </div>
  );
}
