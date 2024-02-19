"use client";

import { useEffect, useState } from "react";
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
import DateComponent from "./dates/dateComponent";
import { ZodNull, nullable } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Title } from "~/components/title";
import UserForm from "./user/userForm";

export default function HomePage(props: { cities: City[]; sizes: Size[] }) {
  const [city, setCity] = useState<City | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[] | undefined>();
  const [size, setSize] = useState<Size | null>(null);
  const [creationDate, setCreationDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [idLocker, setIdLocker] = useState<number>(0);
  const [reserva, setReserva] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<number>(0);

  const { mutateAsync: reservarBox } = api.pokemon.reserveBox.useMutation();
  const { mutateAsync: confirmarBox } = api.pokemon.confirmBox.useMutation();
  const storess = api.store.get.useQuery();

  if (props.cities.length > 0) {
    return (
      <div className="container">
        <div className="grid grid-cols-3 justify-items-center gap-4	">
          <Menubar className="border-0 shadow-none ">
            {city && !store && !size && !endDate && (
              <Button onClick={() => setCity(null)}>volver</Button>
            )}
            {endDate && !store && !size && (
              <Button onClick={() => setEndDate(undefined)}>volver</Button>
            )}
            {store && !size && (
              <Button onClick={() => setStore(null)}>volver</Button>
            )}

            {size && <Button onClick={() => setSize(null)}>volver</Button>}
          </Menubar>
          <div className="justify-center	">
            <h2 className="text-l mb-3 font-semibold">PERÍODO DE RESERVA</h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pt-2">
          <CitySelector
            cities={props.cities}
            city={city}
            setCity={setCity}
            setStores={setStores}
          />

          {city && (
            <div>
              <DateComponent
                startDate={startDate!}
                setStartDate={setStartDate}
                endDate={endDate!}
                setEndDate={setEndDate}
              />
            </div>
          )}

          {endDate && (
            <StoreSelector stores={stores} store={store} setStore={setStore} />
          )}
          {store && (
            <SizeSelector sizes={props.sizes} size={size} setSize={setSize} />
          )}
          {size && !reserva && (
            <div>
              {/* <UserForm /> */}
              <div>
                <Button
                  type="submit"
                  onClick={async () => {
                    const today = Date.now();
                    const response = await reservarBox({
                      NroSerie: store!.serieLocker!,
                      IdLocker: null,
                      IdSize: size!.id,
                      IdBox: null,
                      Token1: null,
                      FechaCreacion: format(today, "yyyy-MM-dd'T'HH:00:00"),
                      FechaInicio: startDate!,
                      FechaFin: endDate!,
                      Contador: -1,
                      Confirmado: false,
                      Modo: "Por fecha",
                    });
                    if (response != 0) {
                      setIdToken(response);
                      setReserva(true);
                      toast.success("Reserva exitosa");
                    } else {
                      console.log("error");
                      toast.error("Reserva errónea");
                    }
                  }}
                >
                  Continuar al pago
                </Button>
              </div>
            </div>
          )}
          {reserva && (
            <Button
              type="submit"
              onClick={async () => {
                const response = await confirmarBox({ idToken });
                if (response.ok) {
                  const jsonResponse = await response.json();
                  console.log(response);
                  toast.success("Confirmación exitosa");
                } else {
                  console.log(response);
                  toast.error("Confirmación errónea");
                }
                setCity(null);
                setSize(null);
                setStore(null);
                setStartDate(undefined);
                setEndDate(undefined);
                setStores(undefined);
                setReserva(false);
              }}
            >
              Confirmar locker
            </Button>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="grid grid-cols-3 justify-items-center gap-4	">
          <Menubar className="border-0 shadow-none ">
            {store && !endDate && !size && (
              <Button onClick={() => setStore(null)}>volver</Button>
            )}
            {store && !size && (
              <Button onClick={() => setEndDate(undefined)}>volver</Button>
            )}

            {size && <Button onClick={() => setSize(null)}>volver</Button>}
          </Menubar>
          <div className="justify-center	">
            <h2 className="text-l mb-3 font-semibold">PERÍODO DE RESERVA</h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pt-2">
          <StoreSelector
            stores={storess.data}
            store={store}
            setStore={setStore}
          />
          {store && (
            <div>
              <DateComponent
                startDate={startDate!}
                setStartDate={setStartDate}
                endDate={endDate!}
                setEndDate={setEndDate}
              />
            </div>
          )}
          {store && (
            <SizeSelector sizes={props.sizes} size={size} setSize={setSize} />
          )}
          {size && !reserva && (
            <div>
              {/* <UserForm /> */}
              <div>
                <Button
                  type="submit"
                  onClick={async () => {
                    const today = Date.now();
                    const response = await reservarBox({
                      NroSerie: store!.serieLocker!,
                      IdLocker: null,
                      IdSize: size!.id,
                      IdBox: null,
                      Token1: null,
                      FechaCreacion: format(today, "yyyy-MM-dd'T'HH:00:00"),
                      FechaInicio: startDate!,
                      FechaFin: endDate!,
                      Contador: -1,
                      Confirmado: false,
                      Modo: "Por fecha",
                    });
                    if (response != 0) {
                      setIdToken(response);
                      setReserva(true);
                      toast.success("Reserva exitosa");
                    } else {
                      console.log("error");
                      toast.error("Reserva errónea");
                    }
                  }}
                >
                  Continuar al pago
                </Button>
              </div>
            </div>
          )}
          {reserva && (
            <Button
              type="submit"
              onClick={async () => {
                const response = await confirmarBox({ idToken });
                if (response.ok) {
                  const jsonResponse = await response.json();
                  console.log(response);
                  toast.success("Confirmación exitosa");
                } else {
                  console.log(response);
                  toast.error("Confirmación errónea");
                }
                setCity(null);
                setSize(null);
                setStore(null);
                setStartDate(undefined);
                setEndDate(undefined);
                setStores(undefined);
                setReserva(false);
              }}
            >
              Confirmar locker
            </Button>
          )}
        </div>
      </div>
    );
  }
}
