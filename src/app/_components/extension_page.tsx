"use client";
import { Size } from "~/server/api/routers/sizes";
import { api } from "~/trpc/react";
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
import { ChevronLeftCircle, ChevronRightIcon, Loader2 } from "lucide-react";
import Success from "./success/success";
import { Client } from "~/server/api/routers/clients";
import Payment from "./payment/page";
import { Coin } from "~/server/api/routers/coin";
import { useState } from "react";
import UserForm from "./user/userForm";
import ButtonCustomComponent from "~/components/buttonCustom";
import SelectEmail from "./email-select/component";
import SelectToken from "./email-select copy/component";
import DateExtension from "./extension-date/component";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import ButtonIconCustomComponent from "~/components/button-icon-custom";
import type { Translations } from "~/translations";

export const Icons = {
  spinner: Loader2,
};

let paymentDisabledRef = false;
export default function Extension({ t, ...props }: {
  sizes: Size[],
  onBack: () => void;
  t: Translations;
}) {
  const [paymentDisabled, setPaymentDisabled] = useState(false);
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
  const [reserves, setReserves] = useState<Reserve[]>([]);

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    prefijo: "",
    telefono: "",
    terms: "",
    dni: "",
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
    dni: "0",
  });
  
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = () => {
    const newErrors = {
      name: client.name ? "" : t("mandatoryName"),
      surname: client.surname ? "" : t("mandatorySurname"),
      email: isValidEmail(client.email!) ? "" : t("invalidEmail"),
      prefijo: client.prefijo ? "" : t("mandatoryPrefix"),
      telefono: client.telefono ? "" : t("invalidPhone"),
      terms: terms ? "" : t("acceptTerms"),
      dni: client.dni ? "" : t("needsDni"),
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
            <AlertDialogTitle>{t("someError")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("reserveNotFound")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                location.reload();
              }}
            >
              {t("accept")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  async function onContinueToPayment() {
    if (!reserve) {
      throw new Error("!reserve onContinueToPayment");
    }

    try {
      let failed = false;
      if (handleSubmit()) {
        //creo una reserva para este cliente y seteo el numero de reserva
        const nreserve = await reserveToClient({
          clientId: client.identifier,
        });
        setNReserve(nreserve!);
        reserve.client = client.email;
        const response = parseInt(
          await reserveExtesion({
            idToken: reserve.IdTransaction!,
            newEndDate: endDate,
            Token1: reserve.Token1!,
            nReserve: nreserve!,
          }),
        );

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
            uid: client.identifier,
            phone: `${client.prefijo ?? 0}${client.telefono ?? 0}`,
            identification: client.dni ?? "",
            cantidad: 1,
          });
          setCheckoutNumber(checkoutNumber);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container absolute">
      {failed && <AlertFailedResponse />}

      <div className="flex flex-col items-center justify-center ">
        {!email && <>
          <ButtonIconCustomComponent className="mx-4" noWFull={true} icon={<ChevronLeftCircle />} onClick={props.onBack} />
          <SelectEmail t={t} email={email} setEmail={setEmail} />
        </>}
        {email && !token && <>
          <ButtonIconCustomComponent className="mx-4" noWFull={true} icon={<ChevronLeftCircle />} onClick={() => {
            setEmail("");
          }} />
          <SelectToken
            t={t}
            token={token}
            email={email}
            setToken={setToken}
            setClient={setClient}
            setFailed={setFailed}
          />
        </>}
        {token && !reserve && <>
          <ButtonIconCustomComponent className="mx-4" noWFull={true} icon={<ChevronLeftCircle />} onClick={() => {
            setToken(undefined);
          }} />
          <div className="flex flex-col items-center justify-center ">
            <DateExtension
              t={t}
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
          </>}{" "}
        {loadingPay && <Icons.spinner className="h-4 w-4 animate-spin" />}
        {stores && reserve && !loadingPay && !pagoOk && (
          <div>
            <ButtonIconCustomComponent className="mx-4" noWFull={true} icon={<ChevronLeftCircle />} onClick={() => {
              setReserve(undefined);
              setEndDate(undefined);
              setStartDate(undefined);
              setDays(0);
            }} />
            <div className="flex flex-col items-center lg:flex-row lg:space-x-10">
              <div className="w-full lg:w-auto">
                <UserForm
                  t={t}
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
                  t={t}
                  onEdit={undefined}
                  store={stores.find((s) => s.lockers.some(l => l.serieLocker == reserve.NroSerie))!}
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
                    text={t("continueToPayment")}
                    disabled={paymentDisabled}
                    onClick={() => {
                      if (paymentDisabledRef) {
                        return;
                      }

                      paymentDisabledRef = true;
                      setPaymentDisabled(true);
                      onContinueToPayment().then(v => {
                        console.log('to payment ok', v);
                        setPaymentDisabled(false);
                        paymentDisabledRef = false;
                      }).catch(e => {
                        console.error('to payment error', e);
                        setPaymentDisabled(false);
                        paymentDisabledRef = false;
                      });
                    }}
                    after={true}
                    icon={<ChevronRightIcon className="h-4 w-4 " />}
                  />
                </div>
              </div>
            </div>
            {reserve && !pagoOk && !loadingPay && <>
              <div className="flex flex-row-reverse">
                {!loadingPay && (
                  <Payment
                    t={t}
                    checkoutNumber={checkoutNumber!}
                    setLoadingPay={setLoadingPay}
                    client={client}
                    coin={coin!}
                    endDate={endDate!}
                    startDate={startDate!}
                    nReserve={nReserve}
                    reserves={[reserve]}
                    setPagoOk={setPagoOk}
                    setReserves={setReserves}
                    sizes={props.sizes}
                    store={
                      stores.find((s) => s.lockers.some(l => l.serieLocker == reserve.NroSerie))!
                    }
                    total={total}
                    cupon={null}
                    isExt={true}
                  />
                )}
              </div>
            </>}
          </div>
        )}
        {pagoOk && (
          <div>
            <div>
              <Success
                t={t}
                reserves={reserves}
                store={stores?.find((s) => s.lockers.some(l => l.serieLocker == reserve!.NroSerie))!}
                nReserve={nReserve!}
                total={total}
                coin={coin}
                checkoutNumber={checkoutNumber!}
                sizes={props.sizes}
                endDate={endDate}
                startDate={startDate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
