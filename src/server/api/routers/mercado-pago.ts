import { MercadoPagoConfig, Preference } from "mercadopago";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cities } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";
import { BackUrls } from "mercadopago/dist/clients/preference/commonTypes";
import { z } from "zod";

export const mercadopago = new MercadoPagoConfig({
  accessToken:
    "APP_USR-6825002901939818-112010-10d61eb4a74181bda34550df12b65f8a-2109812108",
});

export const MPRouter = createTRPCRouter({
  test: publicProcedure
    .input(
      z.object({
        nroReserve: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const back_urls: BackUrls = {
        success: `localhost:3000/success/${input.nroReserve}`,
        pending: "facebook.com",
        failure: "yahoo.com",
      };
      // Creamos la preferencia incluyendo el precio, titulo y metadata. La información de `items` es standard de Mercado Pago. La información que nosotros necesitamos para nuestra DB debería vivir en `metadata`.
      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: "message",
              unit_price: 100,
              quantity: 1,
              title: "Mensaje de muro",
            },
          ],
          back_urls,
          auto_return: "approved",
        },
      });

      // Devolvemos el init point (url de pago) para que el usuario pueda pagar

      return preference.init_point!;
    }),
});
