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
        coin: z.string(),
        client: z.string(),
        local: z.string(),
        nReserve: z.number(),
        from: z.string(),
        until: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(env.SENDGRID_API_KEY);
        console.log(input.token);
        input.token.map((x) => console.log(x));
        const msg = {
          to: input.to,
          from: `${env.MAIL_SENDER}`,
          subject: `Confirmación de reserva locker N° ${input.nReserve}.`,
          html: `
         
          <body>
          <p>Estimado/a ${input.client},</p>
          <p>Nos complace confirmar que tu reserva en ${input.local} ha sido exitosamente procesada.</p>


          <p><strong>N° Reserva</strong></p>
          <p><strong>${input.nReserve}</strong></p>


          <p><strong>Período</strong></p>
          <p>Entrega desde              ${input.from}</p>
          <p>Recogida hasta             ${input.until}</p>
        
          <p><strong>Códigos de acceso (Tokens)</strong></p>

          <p>
            ${input.token
              .map((x) => {
                return `Su código de reserva es <strong>${x[0]} (${x[1]})</strong><br>`;
              })
              .join("")}
          </p>

          <hr>

          <p><strong>Precio Total</strong>         ${input.coin} ${input.price}</p>

          
          <p>Atentamente,</p>
          <p>Lockers Urbanos</p>
          
        </body>`,
          // attachments: [
          //   {
          //     content: pdfBuffer.toString("base64"),
          //     filename: "nombre-del-archivo.pdf",
          //     type: "application/pdf",
          //     disposition: "attachment",
          //   },
          // ],
        };
        console.log(msg);
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((e: Error) => {
            console.log(e);
          });
      } catch (error) {
        console.log(error);
      }
      //   sendMail({
      //     to: "anselmo@dcm.com.ar",
      //     name: "Anselmo",
      //     subject: "Test",
      //     body: "This is a test email body.",
      //   });
    }),
});

// export async function sendMail({
//   to,
//   name,
//   subject,
//   body,
// }: {
//   to: string;
//   name: string;
//   subject: string;
//   body: string;
// }) {
//   const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

//   const transport = nodemailer.createTransport({
//     service: "hotmail",
//     auth: {
//       user: SMTP_EMAIL,
//       pass: SMTP_PASSWORD,
//     },
//   });
//   try {
//     const testResult = await transport.verify();
//     console.log(testResult);
//   } catch (error) {
//     console.error({ error });
//     return;
//   }

//   try {
//     const sendResult = await transport.sendMail({
//       from: SMTP_EMAIL,
//       to,
//       subject,
//       // html,
//     });
//     console.log(sendResult);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export type City = RouterOutputs["city"]["get"][number];
