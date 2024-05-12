"use client";
import { City } from "~/server/api/routers/city";
import { Button } from "~/components/ui/button";
import StoreSelector from "./store/selector";
import { Store } from "~/server/api/routers/store";
import { Size } from "~/server/api/routers/sizes";
import SizeSelector from "./sizes/selector";
import { api } from "~/trpc/react";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import DateComponent from "./dates/dateComponent";
import UserForm from "./user/userForm";
import Booking from "./booking/booking";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import Success from "./success/success";
import { Client } from "~/server/api/routers/clients";
import { Badge } from "~/components/ui/badge";
import Payment from "./payment/page";
import { Coin } from "~/server/api/routers/coin";
import { useState } from "react";

export const Icons = {
  spinner: Loader2,
};

export default function HomePage(props: { cities: City[]; sizes: Size[] }) {
  const [store, setStore] = useState<Store | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [sizeSelected, setsizeSelected] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [checkoutNumber, setCheckoutNumber] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [reserva, setReserva] = useState<boolean>(false);
  const [pagoOk, setPagoOk] = useState<boolean>(false);
  const [days, setDays] = useState<number>(0);

  const storess = api.store.get.useQuery();
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [reserves1, setReserves1] = useState<Reserve[]>([]);
  const [loadingPay, setLoadingPay] = useState<boolean>(false);
  const [failedResponse, setFailedResponse] = useState<boolean>(false);

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
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleSubmit = () => {
    const newErrors = {
      name: client.name ? "" : "Nombre es obligatorio",
      surname: client.surname ? "" : "Apellido es obligatorio",
      email: isValidEmail(client.email!) ? "" : "Correo electrónico no válido",
      prefijo: client.prefijo ? "" : "Prefijo es obligatorio",
      telefono: client.telefono ? "" : "Telefono es obligatorio",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);

      return false;
    }
    return true;
  };

  function AlertFailedResponse() {
    return (
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hubo un error.</AlertDialogTitle>
            <AlertDialogDescription>
              Alguien reservó su locker mientras ud. operaba. Se reiniciará la
              selección.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                location.reload();
              }}
            >
              Aceptar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="container absolute">
      {failedResponse && <AlertFailedResponse />}
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
            setReserves1={setReserves1}
            startDate={startDate!}
            endDate={endDate!}
            coins={coins!}
            setFailedResponse={setFailedResponse}
            failedResponse={failedResponse}
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
                          const clientResponse = await createClient(client);
                          setNReserve(clientResponse.id);
                          setReserva(true);
                          let checkoutNumber = await test({
                            amount: total,
                            reference: clientResponse.id.toString(),
                            mail: client.email!,
                            name: client.name!,
                            identification: client.identifier!,
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
                reserves={reserves1}
                setPagoOk={setPagoOk}
                setReserves={setReserves1}
                sizes={props.sizes}
                store={store!}
                total={total}
              />
            )}
          </div>
        )}
        {pagoOk && (
          <div>
            <div>
              <Success
                reserves={reserves1}
                store={store!}
                nReserve={nReserve!}
                total={total}
                coin={coin!}
                checkoutNumber={checkoutNumber!}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
