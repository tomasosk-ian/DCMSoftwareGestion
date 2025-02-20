import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import type { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";

const mpClient = new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_SERVER_TOKEN });
type MpPago = PaymentCreateRequest;

export const mpRouter = createTRPCRouter({
  procesarPago: publicProcedure
    .input(z.custom<MpPago>())
    .mutation(async ({ input: formData }) => {
      if (!env.NEXT_PUBLIC_HABILITAR_MERCADOPAGO) {
        throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
      }

      const payment = new Payment(mpClient);
      const res = await payment.create({ body: formData });
      console.log('mp res', res);

      return res.status as "approved" | "authorized" | "in_process" | "pending" | "cancelled" | "charged_back" | "rejected";
    }),
});

// export type City = RouterOutputs["city"]["get"][number];
