import { postRouter } from "~/server/api/routers/post";
import { cityRouter } from "~/server/api/routers/city";
import { storeRouter } from "~/server/api/routers/store";
import { createTRPCRouter } from "~/server/api/trpc";
import { sizeRouter } from "./routers/sizes";
import { pokemonRouter } from "./routers/lockerReserveRouter";
import { lockerRouter } from "./routers/lockers";

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
  // lockerReserve: lockerReserveRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
