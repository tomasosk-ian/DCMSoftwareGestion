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
        token: z.array(z.number()),
        precio: z.number(),
        moneda: z.string(),
        cliente: z.string(),
        local: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Email api");
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(env.SENDGRID_API_KEY);
        console.log(input.token);
        input.token.map((x) => console.log(x));
        const msg = {
          to: input.to,
          from: "back@lockersurbanos.com.ar",
          subject: "Confirmación de reserva locker.",
          html: `<body>
          <p>Estimado/a ${input.cliente},</p>
        
          <p>Nos complace confirmar que su reserva en ${
            input.local
          } ha sido exitosamente procesada.</p>
        
          <p>
            ${input.token
              .map((x) => {
                return `Su código de reserva es <strong>${x}</strong><br>`;
              })
              .join("")}
          </p>
        
          <p>El precio total de su reserva es: ${input.precio} ${
            input.moneda
          }</p>
        
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
