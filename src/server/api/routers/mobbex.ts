import { mobbex } from "mobbex";
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
        name: z.string(),
        identification: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      mobbex.configurations.configure({
        apiKey: "zJ8LFTBX6Ba8D611e9io13fDZAwj0QmKO1Hn1yIj",
        accessToken: "d31f0721-2f85-44e7-bcc6-15e19d1a53cc",
      });
      const checkout = {
        total: input.amount,
        currency: "ARS",
        reference: `123ASKFJR5${input.reference}`,
        description: "Descripción de la Venta",
        test: true,
        customer: {
          email: `${input.mail}`,
          name: `${input.name}`,
          identification: `${input.identification}`,
        },
        items: [
          {
            image:
              "https://www.mobbex.com/wp-content/uploads/2019/03/web_logo.png",
            quantity: 2,
            description: "Mi Producto",
            total: input.amount,
          },
        ],
        options: {
          domain: "test.com",
        },
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
      return checkoutNumber;
    }),
});

// export type City = RouterOutputs["city"]["get"][number];
