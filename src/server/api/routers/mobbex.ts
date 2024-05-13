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
        apiKey: "MG6cQtZdWShlZ9MObv98AloWZKUVBv3WwYmpfzOS",
        accessToken: "a4a78473-14cb-4810-b716-02f003c183bb",
      });
      const checkout = {
        total: 10000,
        currency: "ARS",
        reference: "123ASKFJR5132342348",
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
            total: 10000,
          },
        ],
        options: { domain: "test.com" },
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
