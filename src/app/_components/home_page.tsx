"use client";

import { MutableRefObject, useEffect, useState } from "react";
import { City } from "~/server/api/routers/city";
import { Transaction } from "~/server/api/routers/transactions";
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
import { Title } from "@radix-ui/react-toast";
import UserForm from "./user/userForm";
import Booking from "./booking/booking";
import { usePDF } from "react-to-pdf";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import Success from "./success/success";
import { Client } from "~/server/api/routers/clients";

export const Icons = {
  spinner: Loader2,
};

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
  const [pagoOk, setPagoOk] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const { mutateAsync: reservarBox } =
    api.lockerReserve.reserveBox.useMutation();
  const { mutateAsync: confirmarBox } =
    api.lockerReserve.confirmBox.useMutation();
  const storess = api.store.get.useQuery();
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [reserves1, setReserves1] = useState<Reserve[]>([]);
  const [loadingPay, setLoadingPay] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction>();
  const [client, setClient] = useState<Client>({
    identifier: null,
    name: "",
    surname: "",
    email: "",
    prefijo: 0,
    telefono: 0,
  });
  const { mutateAsync: createTransaction } =
    api.transaction.create.useMutation();
  const { mutateAsync: createClient } = api.client.create.useMutation();
  const { mutateAsync: sendEmail } = api.email.sendEmail.useMutation();
  const [pdf, setPDF] = useState<MutableRefObject<any>>();
  // if (props.cities.length !== 0) {
  //   return (
  //     <div className="container">
  //       <div className="grid grid-cols-3 justify-items-center gap-4	">
  //         <Menubar className="border-0 shadow-none ">
  //           {city && !store && !size && !endDate && (
  //             <Button onClick={() => setCity(null)}>volver</Button>
  //           )}
  //           {endDate && !store && !size && (
  //             <Button onClick={() => setEndDate(undefined)}>volver</Button>
  //           )}
  //           {store && !size && (
  //             <Button onClick={() => setStore(null)}>volver</Button>
  //           )}
  //           {size && (
  //             <Button
  //               onClick={() => {
  //                 setsizeSelected(false);
  //                 setReserves([]);
  //               }}
  //             >
  //               volver
  //             </Button>
  //           )}
  //         </Menubar>
  //       </div>
  //       <div className="flex flex-col items-center justify-center pt-2">
  //         <CitySelector
  //           cities={props.cities}
  //           city={city}
  //           setCity={setCity}
  //           setStores={setStores}
  //         />
  //         {city && (
  //           <StoreSelector stores={stores} store={store} setStore={setStore} />
  //         )}
  //         {store && (
  //           <div>
  //             <DateComponent
  //               startDate={startDate!}
  //               setStartDate={setStartDate}
  //               endDate={endDate!}
  //               setEndDate={setEndDate}
  //               days={days}
  //               setDays={setDays}
  //             />
  //           </div>
  //         )}
  //         {endDate && (
  //           <SizeSelector
  //             nroSerieLocker={store?.serieLocker!}
  //             inicio={startDate}
  //             fin={endDate!}
  //             size={size}
  //             setSize={setSize}
  //             sizeSelected={sizeSelected}
  //             setSizeSelected={setsizeSelected}
  //             reserves={reserves}
  //             setReserves={setReserves}
  //             startDate={startDate!}
  //             endDate={endDate!}
  //           />
  //         )}
  //         {sizeSelected && !reserva && (
  //           <div>
  //             <div className="grid grid-cols-2 gap-8 p-8">
  //               <UserForm client={client} setClient={setClient} />
  //               <Booking
  //                 store={store!}
  //                 startDate={startDate!}
  //                 endDate={endDate!}
  //                 reserves={reserves!}
  //               />
  //             </div>
  //             <div className="flex flex-row-reverse px-8">
  //               <Button
  //                 type="submit"
  //                 onClick={async () => {
  //                   reserves.map(async (reserve) => {
  //                     const response = await reservarBox(reserve);
  //                     setIdToken(response);
  //                   });
  //                   setReserva(true);
  //                 }}
  //               >
  //                 Continuar al pago
  //               </Button>
  //             </div>
  //           </div>
  //         )}
  //         {reserva && (
  //           <Button
  //             type="submit"
  //             onClick={async () => {
  //               const response = await confirmarBox({ idToken });
  //               if (response.ok) {
  //                 const jsonResponse = await response.json();
  //                 toast.success("Confirmación exitosa");
  //               } else {
  //                 toast.error("Confirmación errónea");
  //               }
  //               setCity(null);
  //               setSize(null);
  //               setStore(null);
  //               setStartDate(undefined);
  //               setEndDate(undefined);
  //               setStores(undefined);
  //               setReserva(false);
  //             }}
  //           >
  //             Confirmar locker
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // } else {
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
            <Button
              onClick={() => {
                setsizeSelected(false);
                setReserves([]);
                setReserves1([]);
              }}
            >
              volver
            </Button>
          )}
          {reserva && (
            <Button
              onClick={() => {
                setReserva(false);
              }}
            >
              volver
            </Button>
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
        {loadingPay && <Icons.spinner className="h-4 w-4 animate-spin" />}
        {sizeSelected && !reserva && !loadingPay && (
          <div>
            <div className="grid grid-cols-2 gap-8 p-8">
              <UserForm client={client} setClient={setClient} />
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
                  setReserves1([]);
                  setReserves([]);
                  reserves.map(async (reserve) => {
                    console.log(reserve.client);
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
                  setLoadingPay(true);
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                  setLoadingPay(false);
                  const clientResponse = await createClient(client);
                  setReserva(true);
                }}
              >
                Continuar al pago
              </Button>
            </div>
          </div>
        )}
        {reserva && !pagoOk && !loadingPay && (
          <div className="flex flex-row-reverse">
            {!loadingPay && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button>Confirmar pago</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro? </AlertDialogTitle>
                    <AlertDialogDescription>
                      Va a confirmar el pago de la reserva.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>
                      <Button
                        type="submit"
                        onClick={async () => {
                          setLoadingPay(true);
                          const updatedReserves1 = await Promise.all(
                            reserves1.map(async (reserve) => {
                              if (reserve.IdTransaction) {
                                const response = await confirmarBox({
                                  idToken: reserve.IdTransaction!,
                                });
                                if (response) {
                                  await createTransaction({
                                    ...transaction,
                                    client: reserve.client,
                                  });
                                  console.log(
                                    "*--------------------------------------*",
                                  );
                                  console.log(pdf);
                                  sendEmail({
                                    to: client.email!,
                                    token: response,
                                  });
                                }
                                return {
                                  ...reserve,
                                  Token1: response,
                                };
                              }
                              return reserve;
                            }),
                          );
                          setReserves1(updatedReserves1);
                          setLoadingPay(false);
                          setPagoOk(true);
                        }}
                      >
                        Confirmar pago
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
        {pagoOk && (
          <div>
            <Success reserves={reserves1} store={store!} />
            <Button
              onClick={async () => {
                setCity(null);
                setStore(null);
                setStores(undefined);
                setSize(null);
                setsizeSelected(false);
                setCreationDate("");
                setStartDate("");
                setEndDate("");
                setIdLocker(0);
                setReserva(false);
                setIdToken(0);
                setDays(0);
                setReserves([]);
                setReserves1([]);
                setLoadingPay(false);
                setPagoOk(false);
              }}
            >
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  // }
}
