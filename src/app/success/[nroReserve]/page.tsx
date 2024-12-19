import { Reserve } from "~/server/api/routers/lockerReserveRouter";
import { Store } from "~/server/api/routers/store";
import { Size } from "~/server/api/routers/sizes";
import { Coin } from "~/server/api/routers/coin";
import { api } from "~/trpc/server";
import { Inter } from "next/font/google";
import Success from "~/app/_components/success/success";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default async function SuccessPage(props: {
  params: { nroReserve: string };
}) {
  const envVariable = process.env.NEXT_PUBLIC_NODE_ENV || "Cargando...";
  const reserva1 = await api.reserve.getBynReserve.query({
    nReserve: parseInt(props.params.nroReserve),
  });
  const stores = await api.store.get.query();
  const coins = await api.coin.get.query();
  const sizes = await api.size.get.query();

  //   const [reserves, setReserves] = useState<Reserve[]>([]);
  //   const [store, setStore] = useState<Store>();
  //   const [nReserve, setNReserve] = useState<number>(0);
  //   const [total, setTotal] = useState<number>(0);
  //   const [coin, setCoin] = useState<Coin>();
  //   const [checkoutNumber, setCheckoutNumber] = useState<string>();

  return (
    <html>
      <body className={`font-sans ${inter.variable} bg-lockersUrbanos`}>
        <main>
          <Success
            reserves={reserva1 as Reserve[]}
            store={stores[0]!}
            nReserve={parseInt(props.params.nroReserve)}
            total={100}
            coin={coins[0]}
            sizes={sizes}
            endDate={undefined}
          />
        </main>
      </body>
    </html>
  );
}
