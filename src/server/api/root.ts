import { cityRouter } from "~/server/api/routers/city";
import { globalConfigRouter } from "~/server/api/routers/globalConfig";
import { storeRouter } from "~/server/api/routers/store";
import { createTRPCRouter } from "~/server/api/trpc";
import { sizeRouter } from "./routers/sizes";
import { lockerRouter } from "./routers/lockers";
import { feeRouter } from "./routers/fee";
import { coinRouter } from "./routers/coin";
import { transactionRouter } from "./routers/transactions";
import { clientsRouter } from "./routers/clients";
import { lockerReserveRouter } from "./routers/lockerReserveRouter";
import { emailRouter } from "./routers/email";
import { mobbexRouter } from "./routers/mobbex";
import { clerkRouter } from "./routers/clerk";
import { reserveRouter } from "./routers/reserves";
import { cuponesRouter } from "./routers/cupones";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  city: cityRouter,
  store: storeRouter,
  size: sizeRouter,
  locker: lockerRouter,
  globalConfig: globalConfigRouter,
  fee: feeRouter,
  coin: coinRouter,
  transaction: transactionRouter,
  client: clientsRouter,
  lockerReserve: lockerReserveRouter,
  email: emailRouter,
  mobbex: mobbexRouter,
  clerk: clerkRouter,
  reserve: reserveRouter,
  cupones: cuponesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
