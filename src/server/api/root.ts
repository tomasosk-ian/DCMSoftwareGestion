import { postRouter } from "~/server/api/routers/post";
import { cityRouter } from "~/server/api/routers/city";
import { globalConfigRouter } from "~/server/api/routers/globalConfig";
import { storeRouter } from "~/server/api/routers/store";
import { createTRPCRouter } from "~/server/api/trpc";
import { sizeRouter } from "./routers/sizes";
import { pokemonRouter } from "./routers/lockerReserveRouter";
import { lockerRouter } from "./routers/lockers";
import { feeRouter } from "./routers/fee";
import { coinRouter } from "./routers/coin";
import { clientsRouter } from "./routers/clients";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  city: cityRouter,
  store: storeRouter,
  size: sizeRouter,
  pokemon: pokemonRouter,
  locker: lockerRouter,
  globalConfig: globalConfigRouter,
  fee: feeRouter,
  coin: coinRouter,
  clients: clientsRouter,
  // lockerReserve: lockerReserveRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
