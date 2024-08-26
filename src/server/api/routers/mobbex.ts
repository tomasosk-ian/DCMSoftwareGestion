import { mobbex } from "mobbex";
import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const mobbexRouter = createTRPCRouter({
  test: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        reference: z.string(),
        mail: z.string(),
        name: z.string(),
        identification: z.number(),
        cantidad: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const randomNum = Math.floor(Math.random() * 10000);
      const fourDigitString = randomNum.toString().padStart(4, "0");
      mobbex.configurations.configure({
        apiKey: "MG6cQtZdWShlZ9MObv98AloWZKUVBv3WwYmpfzOS",
        accessToken: "a4a78473-14cb-4810-b716-02f003c183bb",
      });
      const test = env.NODE_ENV == "test" || env.NODE_ENV == "development";
      console.log("test node env", test);
      const checkout = {
        total: input.amount!,
        currency: "ARS",
        reference: `REF${input.reference}${fourDigitString}`,
        description: "Descripción de la Venta",
        test,
        customer: {
          email: `${input.mail}`,
          name: `${input.name}`,
          identification: `${input.identification}`,
        },
        items: [
          {
            image:
              "https://www.mobbex.com/wp-content/uploads/2019/03/web_logo.png",
            quantity: input.cantidad,
            description: "Lockers",
            total: input.amount,
          },
        ],
        options: { domain: "https://lockersurbanos.com.ar/" },
        return_url: "https://mobbex.com/sale/return?session=56789",
        webhook: "https://mobbex.com/sale/webhook?user=1234",
      };

      let checkoutNumber;
      const a = await mobbex.checkout
        .create(checkout)
        .then((result: any) => {
          checkoutNumber = result.data.id;
        })
        .catch((error) => console.log(error));
      console.log("checkoutNumber", checkoutNumber);
      return checkoutNumber;
    }),
});

// export type City = RouterOutputs["city"]["get"][number];
