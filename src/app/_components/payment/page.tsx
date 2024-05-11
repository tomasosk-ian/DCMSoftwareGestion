import { Transaction } from "@libsql/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Client } from "~/server/api/routers/clients";
import { Coin } from "~/server/api/routers/coin";
import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Size } from "~/server/api/routers/sizes";
import { Store } from "~/server/api/routers/store";
import { api } from "~/trpc/react";

declare global {
  interface Window {
    MobbexEmbed: any; // Aquí deberías utilizar el tipo correcto si está disponible
  }
}

export default function Payment(props: {
  checkoutNumber: string;
  setLoadingPay: (loadingPay: boolean) => void;
  reserves: Reserve[];
  sizes: Size[];
  client: Client;
  coin: Coin;
  total: number;
  nReserve: number;
  store: Store;
  startDate: string;
  endDate: string;
  setReserves: (reserves: Reserve[]) => void;
  setPagoOk: (pagoOk: boolean) => void;
}) {
  const { mutateAsync: confirmarBox } =
    api.lockerReserve.confirmBox.useMutation();
  const { mutateAsync: createTransaction } =
    api.transaction.create.useMutation();
  const [transaction, setTransaction] = useState<Transaction>();
  const { mutateAsync: sendEmail } = api.email.sendEmail.useMutation();
  function formatDateToTextDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = format(date, "eee dd MMMM HH:mm", { locale: es });
    return formattedDate;
  }
  useEffect(() => {
    let statusCode = 0;
    if (props.checkoutNumber) {
      const options = {
        id: props.checkoutNumber,
        type: "checkout",
        onResult: (data: any) => {
          // OnResult es llamado cuando se toca el Botón Cerrar

          window.MobbexEmbed.close();
        },
        onPayment: async (data: any) => {
          statusCode = parseInt(data.data.status.code);

          if (statusCode == 200) {
            try {
              props.setLoadingPay(true);
              let token: [number, string][] = [];
              console.log(props.reserves);

              const updatedReserves = await Promise.all(
                props.reserves.map(async (reserve) => {
                  console.log("aaa");
                  if (reserve.IdTransaction) {
                    console.log("bbb");

                    const response = await confirmarBox({
                      idToken: reserve.IdTransaction!,
                    });
                    console.log(response);
                    if (response) {
                      token.push([
                        response,
                        props.sizes.find((x) => x.id == reserve.IdSize)
                          ?.nombre! ?? "",
                      ]);
                      await createTransaction({
                        ...transaction,
                        client: reserve.client,
                      });
                    }

                    return {
                      ...reserve,
                      Token1: response,
                    };
                  } else {
                    return reserve;
                  }
                }),
              );
              props.setReserves(updatedReserves);
              await sendEmail({
                to: props.client.email!,
                token,
                client: props.client.name!,
                price: props.total,
                coin: props.coin.description!,
                local: props.store!.name!,
                nReserve: props.nReserve,
                from: formatDateToTextDate(props.startDate!),
                until: formatDateToTextDate(props.endDate!),
              });

              props.setLoadingPay(false);
              props.setPagoOk(true);
            } catch (error) {
              console.log(error);
            }
          } else {
            // location.reload();
          }
        },
        onOpen: () => {
          console.info("Pago iniciado.");
        },
        onError: (error: any) => {
          console.error("ERROR: ", error);
        },
        onClose: (error: any) => {
          if (statusCode != 200) {
            location.reload();
          }
        },
      };

      function renderMobbexButton() {
        window.MobbexEmbed.render(options, "#mbbx-button");
      }

      function initMobbexPayment() {
        const mbbxButton = window.MobbexEmbed.init(options);
        mbbxButton.open();
      }

      const script = document.createElement("script");
      script.src = `https://res.mobbex.com/js/embed/mobbex.embed@1.0.23.js?t=${Date.now()}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.addEventListener("load", () => {
        initMobbexPayment(); // Abre inmediatamente el modal de pago
      });
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [props.checkoutNumber]);

  return (
    <>
      <Script
        src="https://res.mobbex.com/js/sdk/mobbex@1.1.0.js"
        integrity="sha384-7CIQ1hldcQc/91ZpdRclg9KVlvtXBldQmZJRD1plEIrieHNcYvlQa2s2Bj+dlLzQ"
        crossOrigin="anonymous"
      />
      <div id="mbbx-container"></div>
    </>
  );
}
