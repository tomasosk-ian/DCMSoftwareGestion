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
import Booking from "./booking/booking";

export default function HomePage(props: { cities: City[]; sizes: Size[] }) {
  const [city, setCity] = useState<City | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[] | undefined>();
  const [size, setSize] = useState<Size | null>(null);
  const [sizeSelected, setsizeSelected] = useState(false);
  const [creationDate, setCreationDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [idLocker, setIdLocker] = useState<number>(0);
  const [reserva, setReserva] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const { mutateAsync: reservarBox } = api.pokemon.reserveBox.useMutation();
  const { mutateAsync: confirmarBox } = api.pokemon.confirmBox.useMutation();
  const storess = api.store.get.useQuery();
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [reserves1, setReserves1] = useState<Reserve[]>([]);

  if (props.cities.length !== 0) {
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

            {size && (
              <Button
                onClick={() => {
                  setsizeSelected(false);
                  setReserves([]);
                }}
              >
                volver
              </Button>
            )}
          </Menubar>
        </div>
        <div className="flex flex-col items-center justify-center pt-2">
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
            <div>
              <DateComponent
                startDate={startDate!}
                setStartDate={setStartDate}
                endDate={endDate!}
                setEndDate={setEndDate}
                days={days}
                setDays={setDays}
              />
            </div>
          )}
          {endDate && (
            <SizeSelector
              nroSerieLocker={store?.serieLocker!}
              inicio={startDate}
              fin={endDate!}
              size={size}
              setSize={setSize}
              sizeSelected={sizeSelected}
              setSizeSelected={setsizeSelected}
              reserves={reserves}
              setReserves={setReserves}
              startDate={startDate!}
              endDate={endDate!}
            />
          )}
          {sizeSelected && !reserva && (
            <div>
              {/* <UserForm /> */}
              <div>
                <Button
                  type="submit"
                  onClick={async () => {
                    reserves.map(async (reserve) => {
                      const response = await reservarBox(reserve);
                      setIdToken(response);
                      setReserva(true);
                    });
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
                  toast.success("Confirmación exitosa");
                } else {
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
            {store && !endDate && !sizeSelected && !reserva && (
              <Button onClick={() => setStore(null)}>volver</Button>
            )}
            {endDate && !sizeSelected && !reserva && (
              <Button onClick={() => setEndDate(undefined)}>volver</Button>
            )}

            {sizeSelected && !reserva && (
              <Button onClick={() => setsizeSelected(false)}>volver</Button>
            )}
            {reserva && (
              <Button onClick={() => setReserva(false)}>volver</Button>
            )}
          </Menubar>
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
                days={days}
                setDays={setDays}
              />
            </div>
          )}
          {endDate && (
            <SizeSelector
              nroSerieLocker={store?.serieLocker!}
              inicio={startDate}
              fin={endDate!}
              size={size}
              setSize={setSize}
              sizeSelected={sizeSelected}
              setSizeSelected={setsizeSelected}
              reserves={reserves}
              setReserves={setReserves}
              startDate={startDate!}
              endDate={endDate!}
            />
          )}
          {sizeSelected && !reserva && (
            <div>
              <div className="grid grid-cols-2 gap-8 p-8">
                <UserForm />
                <Booking
                  store={store!}
                  startDate={startDate!}
                  endDate={endDate!}
                  reserves={reserves!}
                />
              </div>
              <div className="flex flex-row-reverse px-8">
                <Button
                  type="submit"
                  onClick={async () => {
                    reserves.map(async (reserve) => {
                      for (var i = 0; i < reserve.Cantidad!; i++) {
                        const response = await reservarBox(reserve);
                        const updatedReserve = {
                          ...reserve,
                          IdTransaction: response,
                        };

                        setReserves1((prevReserves) => [
                          ...prevReserves,
                          updatedReserve,
                        ]);
                      }
                    });
                    setReserva(true);
                  }}
                >
                  Continuar al pago
                </Button>
              </div>
            </div>
          )}
          {reserva && (
            <div className="flex flex-row-reverse">
              <Button
                type="submit"
                onClick={async () => {
                  reserves1.map(async (reserve) => {
                    if (reserve.IdTransaction) {
                      const response = await confirmarBox({
                        idToken: reserve.IdTransaction!,
                      });
                    }
                  });

                  setCity(null);
                  setEndDate(undefined);
                  setStore(null);
                  setsizeSelected(false);
                  setReserva(false);
                  setReserves([]);
                  setReserves1([]);
                }}
              >
                Confirmar locker
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
