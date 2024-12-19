import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";

export const emailRouter = createTRPCRouter({
  sendEmail: publicProcedure
    .input(
      z.object({
        to: z.string(),
        token: z.array(z.tuple([z.number(), z.string()])),
        price: z.number(),
        coin: z.string().optional().nullable(),
        client: z.string(),
        local: z.string(),
        address: z.string(),
        nReserve: z.number(),
        from: z.string(),
        until: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      sendEmail(
        input.to,
        input.token,
        input.price,
        input.coin,
        input.client,
        input.local,
        input.address,
        input.nReserve,
        input.from,
        input.until,
      );
    }),
});

export async function sendEmail(
  to: string,
  token: Array<[number, string]>,
  price: number,
  coin: string | null | undefined,
  client: string,
  local: string,
  address: string,
  nReserve: number,
  from: string,
  until: string,
) {
  try {
    var QRCode = require("qrcode");
    const attachments: {
      filename: string;
      content: any;
      type: string;
      disposition: string;
      contentId: string;
    }[] = [];
    await Promise.all(
      token.map(async (token, index) => {
        const img = await QRCode.toDataURL(token[0]!.toString(), {
          type: "png",
        });

        const qrCode = img.split(";base64,").pop();
        if (qrCode) {
          attachments.push({
            filename: `QR_${token[0]}_${token[1]}.png`,
            content: qrCode,
            type: "image/png",
            disposition: "attachment",
            contentId: `qr_code_${index}`,
          });
        }
      }),
    );
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(env.SENDGRID_API_KEY);
    const msg = {
      to: to,
      from: `${env.MAIL_SENDER}`,
      subject: `Confirmación de reserva locker N° ${nReserve}.`,
      html: `
     
      <body>
      <p>Estimado/a ${client},</p>
      <p>Nos complace confirmar que tu reserva en ${local} en ${address} ha sido exitosamente procesada. </p>


      <p><strong>N° Reserva</strong></p>
      <p><strong>${nReserve}</strong></p>


      <p><strong>Período</strong></p>
      <p>Entrega desde              ${from}</p>
      <p>Recogida hasta             ${until}</p>
    
      <p><strong>Códigos de acceso (Tokens)</strong></p>

      <p>
        ${token
          .map((x) => {
            return `Su código de reserva es <strong>${x[0]} (${x[1]})</strong><br>`;
          })
          .join("")}
      </p>

      <hr>

      <p><strong>Precio Total</strong>         ${coin ?? ""} ${price}</p>

      
      <p>Atentamente,</p>
      <p><strong>M: +54 9 294 492-7340</strong></p>
      <p><img src="https://utfs.io/f/4993f452-6f46-4f15-9c4b-bd63722923d8-i5bkwc.jpg"/></p>
      
    </body>`,
      attachments: attachments,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((e: any) => {
        console.log(e);
      });
  } catch (error: any) {
    console.log(error);
  }
}
