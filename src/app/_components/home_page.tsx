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
import Payment from "./payment/page";
import { Coin } from "~/server/api/routers/coin";
import { useState } from "react";
import UserForm from "./user/userForm";
import ButtonCustomComponent from "~/components/buttonCustom";
import { Cupon } from "~/server/api/routers/cupones";
import { useRouter } from "next/navigation";
import Extension from "./extension_page";
import { env } from "process";

export const Icons = {
  spinner: Loader2,
};

export default function HomePage(props: {
  cities: City[];
  sizes: Size[];
  stores: Store[];
}) {
  const [store, setStore] = useState<Store | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [sizeSelected, setsizeSelected] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [checkoutNumber, setCheckoutNumber] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [reserva, setReserva] = useState<boolean>(false);
  const [pagoOk, setPagoOk] = useState<boolean>(false);
  const [days, setDays] = useState<number>(0);
  const [cupon, setCupon] = useState<Cupon>();
  const { mutateAsync: reservarBox } =
    api.lockerReserve.reserveBox.useMutation();
  const { mutateAsync: reserveToClient } =
    api.reserve.reservesToClients.useMutation();
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [loadingPay, setLoadingPay] = useState<boolean>(false);
  const [failedResponse, setFailedResponse] = useState<boolean>(false);
  const router = useRouter();
  const [responseError, setResponseError] = useState<string>();
  const [nReserve, setNReserve] = useState<number>(0);
  // const [token, setToken] = useState<number[]>([]);
  const [client, setClient] = useState<Client>({
    identifier: 0,
    name: "",
    surname: "",
    email: "",
    prefijo: 0,
    telefono: 0,
    dni: "",
  });

  const { mutateAsync: createClient } = api.client.create.useMutation();

  const [total, setTotal] = useState<number>(0);
  const [coin, setCoin] = useState<Coin>();
  const { mutateAsync: test } = api.mobbex.test.useMutation();
  const { data: coins } = api.coin.get.useQuery();
  const [terms, setTerms] = useState<boolean>();
  const [isExtension, setIsExtension] = useState<boolean>(false);
  const { mutateAsync: useCupon } = api.cupones.useCupon.useMutation();

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    prefijo: "",
    telefono: "",
    terms: "",
    dni: "",
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
      telefono: client.telefono ? "" : "Debe ingresar un telefono válido",
      terms: terms ? "" : "Debe aceptar los términos y condiciones",
      dni: client.dni ? "" : "Debe ingresar un DNI/Pasaporte válido",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);

      return false;
    }
    return true;
  };
  const envVariable = process.env.NEXT_PUBLIC_NODE_ENV;
  function AlertFailedResponse() {
    return (
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hubo un error.</AlertDialogTitle>
            <AlertDialogDescription>{responseError}</AlertDialogDescription>
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
    <>
      <div>GOLA JAJA {envVariable}</div>
      {!isExtension && (
        <div className="container absolute">
          {failedResponse && <AlertFailedResponse />}
          <div className="flex flex-col items-center justify-center ">
            {!store && (
              <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col items-center justify-center ">
                  <StoreSelector
                    stores={props.stores}
                    store={store}
                    setStore={setStore}
                  />{" "}
                </div>
                <div className="flex flex-col items-center justify-center ">
                  <Button
                    className="border-0 bg-transparent text-black shadow-transparent hover:bg-transparent"
                    onClick={() => setIsExtension(true)}
                  >
                    Extender reserva
                  </Button>
                </div>{" "}
              </div>
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
                coins={coins!}
                setFailedResponse={setFailedResponse}
                failedResponse={failedResponse}
                total={total}
                setTotal={setTotal}
              />
            )}
            {loadingPay && <Icons.spinner className="h-4 w-4 animate-spin" />}
            {sizeSelected && !reserva && !loadingPay && (
              <div>
                <div className="flex flex-col items-center lg:flex-row lg:space-x-10">
                  <div className="w-full lg:w-auto">
                    <UserForm
                      client={client}
                      setClient={setClient}
                      errors={errors}
                      setErrors={setErrors}
                      terms={terms!}
                      setTerms={setTerms}
                      setCupon={setCupon}
                      editable={true}
                    />
                  </div>
                  <div className="w-full lg:w-auto">
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
                      sizes={props.sizes}
                      cupon={cupon}
                      isExt={false}
                    />
                    <div className="flex justify-end py-2">
                      <ButtonCustomComponent
                        text={"Continuar al pago"}
                        onClick={async () => {
                          try {
                            let failed = false;
                            if (handleSubmit()) {
                              const clientResponse = await createClient(
                                client,
                              ).then(async (res: any) => {
                                //creo una reserva para este cliente y seteo el numero de reserva
                                const nreserve = await reserveToClient({
                                  clientId: res.id,
                                });
                                setNReserve(nreserve!);
                                await Promise.all(
                                  reserves.map(async (reserve: Reserve) => {
                                    //creo items para esta reserva
                                    reserve.client = client.email;
                                    const response = await reservarBox(
                                      reserve!,
                                    );
                                    const IdTransaction = parseInt(response);
                                    if (!isNaN(IdTransaction)) {
                                      reserve.IdTransaction = IdTransaction;
                                    } else {
                                      if (
                                        response ==
                                        "El locker está desconectado"
                                      )
                                        setResponseError(
                                          "El sistema de reservas se encuentra temporalmente fuera de servicio. Por favor, intente en unos minutos. Disculpe las molestias.",
                                        );
                                      else
                                        setResponseError(
                                          "Alguien reservó su locker mientras ud. operaba. Se reiniciará la selección.",
                                        );

                                      failed = true;
                                      setFailedResponse(true);
                                    }
                                  }),
                                );

                                return res;
                              });
                              if (!failed) {
                                setReserva(true);
                                const checkoutNumber = await test({
                                  amount: total,
                                  reference: clientResponse.id.toString(),
                                  mail: client.email!,
                                  name: client.name!,
                                  uid: client.identifier!,
                                  cantidad: reserves.length,
                                  phone: `${client.prefijo ?? 0}${client.telefono ?? 0}`,
                                  identification: client.dni ?? "0",
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
                    reserves={reserves}
                    setPagoOk={setPagoOk}
                    setReserves={setReserves}
                    sizes={props.sizes}
                    store={store!}
                    total={total}
                    cupon={cupon}
                    isExt={false}
                  />
                )}
              </div>
            )}
            {pagoOk && (
              <div>
                <div>
                  <Success
                    reserves={reserves}
                    store={store!}
                    nReserve={nReserve!}
                    total={total}
                    coin={coin}
                    checkoutNumber={checkoutNumber!}
                    sizes={props.sizes}
                    endDate={undefined}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isExtension && (
        <div className="container absolute">
          <Extension sizes={props.sizes} />
        </div>
      )}
    </>
  );
}
