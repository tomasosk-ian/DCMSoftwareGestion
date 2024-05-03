// "use client";

// import Script from "next/script";
// import { api } from "~/trpc/react";
// declare global {
//   interface Window {
//     MobbexJS: any; // Aquí deberías utilizar el tipo correcto si está disponible
//   }
// }
// export default function Payment(props: { checkoutNumber: string }) {
//   console.log(props.checkoutNumber);
//   return (
//     <>
//       <Script
//         src="https://res.mobbex.com/js/sdk/mobbex@1.1.0.js"
//         integrity="sha384-7CIQ1hldcQc/91ZpdRclg9KVlvtXBldQmZJRD1plEIrieHNcYvlQa2s2Bj+dlLzQ"
//         crossOrigin="anonymous"
//       ></Script>
//       {props.checkoutNumber && (
//         <Script id="show-banner">
//           {`
//         var options = {
//           id: "${props.checkoutNumber!}",
//           type: "checkout",
//           onResult: (data) => {
//               // OnResult es llamado cuando se toca el Botón Cerrar
//               window.MobbexEmbed.close();
//           },
//           onPayment: (data) => {
//               console.info("Payment: ", data);
//           },
//           onOpen: () => {
//               console.info("Pago iniciado.");
//           },

//           onError: (error) => {
//               console.error("ERROR: ", error);
//           },
//       };
//       function renderMobbexButton() {
//         window.MobbexEmbed.render(options, "#mbbx-button");
//     }
//     function initMobbexPayment() {
//       var mbbxButton = window.MobbexEmbed.init(options);

//       mbbxButton.open();
//   }
//       var script = document.createElement("script");
//             script.src = "https://res.mobbex.com/js/embed/mobbex.embed@1.0.23.js?t=${Date.now()}";
//             console.log("https://res.mobbex.com/js/embed/mobbex.embed@1.0.23.js?t=${Date.now()}");
//             script.async = true;
//             script.crossorigin = "anonymous";
//             script.addEventListener("load", () => {

//                 initMobbexPayment(); // Abre inmediatamente el modal de pago
//             });
//             document.body.appendChild(script);`}
//         </Script>
//       )}
//       {/* <button onClick={handleClick}>test</button> */}
//       <h1>HOLA</h1>
//       <div id="mbbx-container"></div>
//     </>
//   );
// }

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
  reserves1: Reserve[];
  sizes: Size[];
  client: Client;
  coin: string;
  total: number;
  nReserve: number;
  store: Store;
  startDate: string;
  endDate: string;
  setReserves1: (reserves1: Reserve[]) => void;
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
    if (props.checkoutNumber) {
      const options = {
        id: props.checkoutNumber,
        type: "checkout",
        onResult: (data: any) => {
          // OnResult es llamado cuando se toca el Botón Cerrar
          window.MobbexEmbed.close();
        },
        onPayment: async (data: any) => {
          try {
            props.setLoadingPay(true);
            let token: [number, string][] = [];
            const updatedReserves1 = await Promise.all(
              props.reserves1.map(async (reserve) => {
                if (reserve.IdTransaction) {
                  const response = await confirmarBox({
                    idToken: reserve.IdTransaction!,
                  });

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
                }
                return reserve;
              }),
            );
            await sendEmail({
              to: props.client.email!,
              token,
              client: props.client.name!,
              price: props.total,
              coin: props.coin!,
              local: props.store!.name!,
              nReserve: props.nReserve,
              from: formatDateToTextDate(props.startDate!),
              until: formatDateToTextDate(props.endDate!),
            });
            props.setReserves1(updatedReserves1);
            props.setLoadingPay(false);
            props.setPagoOk(true);
          } catch (error) {
            console.log(error);
          }
        },
        onOpen: () => {
          console.info("Pago iniciado.");
        },
        onError: (error: any) => {
          console.error("ERROR: ", error);
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
