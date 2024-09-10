"use client";
import { City } from "~/server/api/routers/city";
import { Button } from "~/components/ui/button";
import StoreSelector from "./store/selector";
import { Store } from "~/server/api/routers/store";
import { Size } from "~/server/api/routers/sizes";
import SizeSelector from "./sizes/selector";
import { api } from "~/trpc/react";
import DateComponent from "./dates/dateComponent";
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
import { ChevronRightIcon, Loader2 } from "lucide-react";
import Success from "./success/success";
import { Client } from "~/server/api/routers/clients";
import { Badge } from "~/components/ui/badge";
import Payment from "./payment/page";
import { Coin } from "~/server/api/routers/coin";
import { useEffect, useState } from "react";
import UserForm from "./user/userForm";
import { env } from "process";
import ButtonCustomComponent from "~/components/buttonCustom";
import { Cupon } from "~/server/api/routers/cupones";
import { Input } from "~/components/ui/input";
import SelectEmail from "./email-select/component";
import SelectToken from "./email-select copy/component";
import DateExtension from "./extension-date/component";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";

export const Icons = {
  spinner: Loader2,
};

export default function Extension(props: { sizes: Size[] }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<number>();
  const [inputToken, setInputToken] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [days, setDays] = useState<number>(0);
  const [reserve, setReserve] = useState<Reserve>();
  const [clientId, setClientId] = useState<number>();
  const [total, setTotal] = useState<number>(100);
  const [coin, setCoin] = useState<Coin>();
  const [nReserve, setNReserve] = useState<number>(0);
  const [checkoutNumber, setCheckoutNumber] = useState<string>();
  const [pagoOk, setPagoOk] = useState<boolean>(false);
  const [loadingPay, setLoadingPay] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    prefijo: "",
    telefono: "",
    terms: "",
    dni:""
  });
  const { data: coins } = api.coin.get.useQuery();
  const { data: sizes } = api.store.get.useQuery();
  const { data: stores } = api.store.get.useQuery();
  const [terms, setTerms] = useState<boolean>(false);
  const { mutateAsync: reserveToClient } =
    api.reserve.reservesToClients.useMutation();
  const { mutateAsync: reserveExtesion } =
    api.lockerReserve.reserveExtesion.useMutation();
  const { mutateAsync: test } = api.mobbex.test.useMutation();

  const [client, setClient] = useState<Client>({
    identifier: 0,
    name: "",
    surname: "",
    email: "",
    prefijo: 0,
    telefono: 0,
    dni:0
  });
  const handleSubmit = () => {
    const newErrors = {
      name: client.name ? "" : "Nombre es obligatorio",
      surname: client.surname ? "" : "Apellido es obligatorio",
      email: client.email ? "" : "Apellido es obligatorio",
      prefijo: client.prefijo ? "" : "Prefijo es obligatorio",
      telefono: client.telefono ? "" : "Telefono es obligatorio",
      terms: terms ? "" : "Debe aceptar los términos y condiciones",
      dni:client.dni?"":"Debe ingresar un DNI/Pasaporte válido"
    };
    // Si hay errores, retorna false
    if (Object.values(newErrors).some((error) => error)) {
      if (setErrors) setErrors(newErrors);
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
              No se encuentra la reserva.
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
      {failed && <AlertFailedResponse />}

      <div className="flex flex-col items-center justify-center ">
        {!email && <SelectEmail email={email} setEmail={setEmail} />}
        {email && !token && (
          <SelectToken
            token={token}
            email={email}
            setToken={setToken}
            setClient={setClient}
            setFailed={setFailed}
          />
        )}
        {token && !reserve && (
          <div className="flex flex-col items-center justify-center ">
            <DateExtension
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              days={days}
              setDays={setDays}
              token={token}
              email={email}
              setReserve={setReserve}
              setFailed={setFailed}
            />
          </div>
        )}{" "}
        {loadingPay && <Icons.spinner className="h-4 w-4 animate-spin" />}
        {stores && reserve && !loadingPay && !pagoOk && (
          <div>
            <div className="flex flex-col items-center lg:flex-row lg:space-x-10">
              <div className="w-full lg:w-auto">
                <UserForm
                  client={client}
                  setClient={setClient}
                  errors={errors}
                  setErrors={setErrors}
                  terms={terms}
                  setTerms={setTerms}
                  setCupon={null}
                  editable={false}
                />
              </div>
              <div className="w-full lg:w-auto">
                <Booking
                  store={stores.find((s) => s.serieLocker == reserve.NroSerie)!}
                  startDate={startDate!}
                  endDate={endDate!}
                  reserves={[reserve]}
                  total={total}
                  setTotal={setTotal}
                  coin={coin!}
                  setCoin={setCoin}
                  coins={coins!}
                  sizes={props.sizes}
                  cupon={undefined}
                  isExt={true}
                />
                <div className="flex justify-end py-2">
                  <ButtonCustomComponent
                    text={"Continuar al pago"}
                    onClick={async () => {
                      try {
                        let failed = false;
                        if (handleSubmit()) {
                          //creo una reserva para este cliente y seteo el numero de reserva
                          const nreserve = await reserveToClient({
                            clientId: client.identifier,
                          });
                          setNReserve(nreserve!);

                          reserve.client = client.email;
                          console.log(
                            "RESERVE TOKEN IS",
                            reserve.IdTransaction,
                          );
                          const response = parseInt(
                            await reserveExtesion({
                              idToken: reserve.IdTransaction!,
                              newEndDate: endDate,
                            }),
                          );
                          console.log("response is", response);
                          if (!isNaN(response)) {
                            reserve.IdTransaction = response;
                          } else {
                            failed = true;
                            setFailed(true);
                          }
                          setReserve(reserve);
                          if (!failed) {
                            const checkoutNumber = await test({
                              amount: total,
                              reference: client.identifier.toString(),
                              mail: client.email!,
                              name: client.name!,
                              uid: client.identifier!,
                              phone: `${client.prefijo ?? 0}${client.telefono ?? 0}`,
                              identification: 43717944,
                              cantidad: 1,
                            });
                            setCheckoutNumber(checkoutNumber);
                          }
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    after={true}
                    icon={<ChevronRightIcon className="h-4 w-4 " />}
                  />
                </div>
              </div>
            </div>
            {reserve && !pagoOk && !loadingPay && (
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
                    reserves={[reserve]}
                    setPagoOk={setPagoOk}
                    setReserves={null}
                    sizes={props.sizes}
                    store={
                      stores.find((s) => s.serieLocker == reserve.NroSerie)!
                    }
                    total={total}
                    cupon={null}
                    isExt={true}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {pagoOk && (
          <div>
            <div>
              <Success
                reserves={[reserve!]}
                store={stores?.find((s) => s.serieLocker == reserve!.NroSerie)!}
                nReserve={nReserve!}
                total={total}
                coin={coin}
                checkoutNumber={checkoutNumber!}
                sizes={props.sizes}
                endDate={endDate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
