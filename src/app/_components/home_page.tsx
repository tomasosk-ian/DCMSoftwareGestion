"use client";

import { MutableRefObject, useEffect, useState } from "react";
import { useRef } from "react";

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
import dynamic from "next/dynamic";

import { renderToString } from "@react-pdf/renderer";

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
import ReactDOM from "react-dom";
import ReactPDF from "@react-pdf/renderer";
import { Badge } from "~/components/ui/badge";
import { es } from "date-fns/locale";
import Payment from "./payment/page";
import { Coin } from "~/server/api/routers/coin";

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
  const [checkoutNumber, setCheckoutNumber] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [idLocker, setIdLocker] = useState<number>(0);
  const [reserva, setReserva] = useState<boolean>(false);
  const [pagoOk, setPagoOk] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const { mutateAsync: reservarBox } =
    api.lockerReserve.reserveBox.useMutation();

  const storess = api.store.get.useQuery();
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [reserves1, setReserves1] = useState<Reserve[]>([]);
  const [loadingPay, setLoadingPay] = useState<boolean>(false);
  const [nReserve, setNReserve] = useState<number>(0);
  // const [token, setToken] = useState<number[]>([]);
  const [client, setClient] = useState<Client>({
    identifier: 0,
    name: "",
    surname: "",
    email: "",
    prefijo: 0,
    telefono: 0,
  });

  const { mutateAsync: createClient } = api.client.create.useMutation();
  const [total, setTotal] = useState<number>(0);
  const [coin, setCoin] = useState<Coin>();
  const { mutateAsync: test } = api.mobbex.test.useMutation();
  const { data: coins } = api.coin.get.useQuery();

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    prefijo: "",
    telefono: "",
  });
  const isValidEmail = (email: string) => {
    // Regular expression for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleSubmit = () => {
    // Check if any field is empty and set error message accordingly
    const newErrors = {
      name: client.name ? "" : "Nombre es obligatorio",
      surname: client.surname ? "" : "Apellido es obligatorio",
      email: isValidEmail(client.email!) ? "" : "Correo electrónico no válido",
      prefijo: client.prefijo ? "" : "Prefijo es obligatorio",
      telefono: client.telefono ? "" : "Telefono es obligatorio",
    };

    // If there are any errors, prevent form submission and display them
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);

      return false;
    }
    return true;
  };

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
    <div className="container absolute">
      <Badge>DEVELOPMENT</Badge>
      <div className="grid grid-cols-3 justify-items-center gap-4	"></div>
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
              <div>
                <UserForm
                  client={client}
                  setClient={setClient}
                  errors={errors}
                  setErrors={setErrors}
                />
              </div>
              <div>
                <Booking
                  store={store!}
                  startDate={startDate!}
                  endDate={endDate!}
                  reserves={reserves!}
                  total={total}
                  setTotal={setTotal}
                  coin={coin!}
                  setCoin={setCoin}
                  coins={coins!}
                />

                <div className="flex flex-row-reverse py-2">
                  <Button
                    type="submit"
                    onClick={async () => {
                      try {
                        if (handleSubmit()) {
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
                          const clientResponse = await createClient(client);
                          setNReserve(clientResponse.id);
                          setReserva(true);
                          let checkoutNumber = await test({
                            amount: total,
                            reference: clientResponse.id.toString(),
                          });
                          setCheckoutNumber(checkoutNumber);
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    Continuar al pago
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {reserva && !pagoOk && !loadingPay && (
          <div className="flex flex-row-reverse">
            {!loadingPay && (
              <Payment
                checkoutNumber={checkoutNumber!}
                setLoadingPay={setLoadingPay}
                client={client}
                coin={coin!}
                endDate={endDate!}
                startDate={startDate!}
                nReserve={nReserve}
                reserves1={reserves1}
                setPagoOk={setPagoOk}
                setReserves1={setReserves1}
                sizes={props.sizes}
                store={store!}
                total={total}
              />
            )}
          </div>
        )}
        {pagoOk && (
          <div>
            <Success
              reserves={reserves1}
              store={store!}
              nReserve={nReserve!}
              total={total}
            />
            <Button
              onClick={async () => {
                location.reload();
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
