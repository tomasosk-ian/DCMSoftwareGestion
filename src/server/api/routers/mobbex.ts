import { mobbex } from "mobbex";
import { env } from "process";
import { z } from "zod";

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
        uid: z.number(),
        phone: z.string(),
        name: z.string(),
        identification: z.string(),
        cantidad: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const timeOutResult = await fetch(
        `${env.SERVER_URL}/api/token/GetTimeDeleter`,
      );

      if (!timeOutResult.ok) {
        const errorResponse = await timeOutResult.json();
        throw new Error(errorResponse.message || "Unknown error");
      }

      const timeOutJsonData = await timeOutResult.json(); // Obtener el JSON con el valor
      const timeOutValidatedResult = z.number().safeParse(timeOutJsonData);

      if (!timeOutValidatedResult.success) {
        throw new Error("The result is not a valid number");
      }

      const randomNum = Math.floor(Math.random() * 10000);
      const fourDigitString = randomNum.toString().padStart(4, "0");
      mobbex.configurations.configure({
        apiKey: "MG6cQtZdWShlZ9MObv98AloWZKUVBv3WwYmpfzOS",
        accessToken: "a4a78473-14cb-4810-b716-02f003c183bb",
      });
      const test = env.APP_ENV == "test" || env.APP_ENV == "development";
      const checkout = {
        total: input.amount!,
        currency: "ARS",
        reference: `REF${input.reference}${fourDigitString}`,
        description: "Descripción de la Venta",
        test,
        customer: {
          email: `${input.mail}`,
          name: `${input.name}`,
          uid: `${input.uid}`,
          identification: input.identification,
          phone: `${input.phone}`,
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
        options: { domain: "https://iguazulockers.com/" },
        return_url: "https://mobbex.com/sale/return?session=56789",
        webhook: "https://mobbex.com/sale/webhook?user=1234",
        timeout: timeOutValidatedResult.data,
      };

      let checkoutNumber;
      const a = await mobbex.checkout
        .create(checkout)
        .then((result: any) => {
          checkoutNumber = result.data.id;
        })
        .catch((error) => console.log(error));
      return checkoutNumber;
    }),
});

// export type City = RouterOutputs["city"]["get"][number];
