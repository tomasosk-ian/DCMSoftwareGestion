import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cities } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";
import { format } from "date-fns";
import {
  confirmBoxHandler,
  Reserve,
  reserveValidator,
} from "./lockerReserveRouter";
import { getSizes } from "./sizes";
import { createTransaction } from "./transactions";
import { sendEmail } from "./email";
import { es } from "date-fns/locale";

const successInputValidator = z.object({
  reserves: z.array(reserveValidator), // Array del tipo Reserve
  nReserve: z.number(),
  isExt: z.boolean(),
});

export const paymentRouter = createTRPCRouter({
  success: publicProcedure
    .input(successInputValidator)
    .query(async ({ input }) => {
      await success(input.reserves, input.nReserve, input.isExt);
    }),
});

async function success(reserves: Reserve[], nReserve: number, isExt: boolean) {
  try {
    let token: [number, string][] = [];
    const updatedReserves = await Promise.all(
      reserves.map(async (reserve) => {
        if (!reserve.IdTransaction) {
          return reserve;
        }

        let response;
        //si no es extension, el idtransaction es con el que se confirma el box. si es extension, el idtransaction es el de mobbex
        response = await confirmBoxHandler(reserve.IdTransaction!, nReserve);
        const sizes = await getSizes();

        if (response) {
          if (isExt) {
            token.push([
              reserve.Token1!,
              sizes.find((x) => x.id === reserve.IdSize)?.nombre! ?? "",
            ]);
            //   const updatedReserve = await createReserve({
            //     Contador: reserve.Contador,
            //     FechaCreacion: reserve.FechaCreacion,
            //     FechaInicio: reserve?.FechaInicio!,
            //     FechaFin: format(props.endDate, "yyyy-MM-dd'T'23:59:59"),
            //     IdBox: reserve.IdBox,
            //     IdSize: reserve.IdSize,
            //     NroSerie: reserve.NroSerie,
            //     Token1: reserve.Token1,
            //     Cantidad: reserve.Cantidad,
            //     client: reserve.client,
            //     Confirmado: reserve.Confirmado,
            //     IdLocker: reserve.IdLocker,
            //     IdTransaction: reserve.IdTransaction!,
            //     Modo: reserve.Modo,
            //     nReserve: props.nReserve,
            //   });

            //   if (props.setReserves) {
            //     props.setReserves([updatedReserve!]);
            //   }
          } else {
            token.push([
              response,
              sizes.find((x) => x.id === reserve.IdSize)?.nombre! ?? "",
            ]);
          }

          await createTransaction(false, reserve.client!, 1500!, nReserve!);
        }

        return {
          ...reserve,
          Token1: response,
          idToken: reserve.IdTransaction!,
          nReserve: nReserve,
        };
      }),
    );

    //   if (props.setReserves) props.setReserves(updatedReserves);
    console.log("TOKENS", token);

    await sendEmail(
      // props.client.email!,
      "anselmo@prueba",
      token,
      1500,
      // coin: props.coin.description,
      "$",
      // props.client.name ?? "",
      "anselmo prueba",
      // local: props.store!.name!,
      "local prueba",
      // address: props.store!.address ?? "",
      "address prueba",
      nReserve,
      "12-05-2022",
      "19-05-2022",
      // from: formatDateToTextDate(props.startDate!),
      // until: formatDateToTextDate(props.endDate!),
    );
  } catch (error) {
    console.log(error);
  }
}
// export type City = RouterOutputs["city"]["get"][number];

function formatDateToTextDate(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = format(date, "eee dd MMMM HH:mm", { locale: es });
  return formattedDate;
}
