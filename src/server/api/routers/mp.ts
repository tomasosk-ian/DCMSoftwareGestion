import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import type { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { eq } from "drizzle-orm";
import { schema } from "~/server/db";
import { type PrivateConfigKeys } from "~/lib/config";

// eslint-disable-next-line no-var
var mpClient: MercadoPagoConfig | null = null;
type MpPago = PaymentCreateRequest;

export const mpRouter = createTRPCRouter({
  procesarPago: publicProcedure
    .input(z.custom<MpPago>())
    .mutation(async ({ input: formData, ctx }) => {
      const claveConfigMp: PrivateConfigKeys = 'mercadopaco_private_key';
      const claveMp = await ctx.db.query.privateConfig.findFirst({
        where: eq(schema.privateConfig.key, claveConfigMp)
      });

      if (!claveMp) {
        console.error('No está configurada la clave privada de mercado pago');
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      
      if (!mpClient) {
        mpClient = new MercadoPagoConfig({ accessToken: claveMp.value });
      }

      const payment = new Payment(mpClient);
      const res = await payment.create({ body: formData });
      console.log('mp res', res);

      return {
        status: res.status as "approved" | "authorized" | "in_process" | "pending" | "cancelled" | "charged_back" | "rejected",
        paymentId: res.id,
      };
    }),
});

// export type City = RouterOutputs["city"]["get"][number];
