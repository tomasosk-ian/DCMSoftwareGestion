import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { RouterOutputs } from "~/trpc/shared";
import nodemailer from "nodemailer";
import { env } from "~/env";
export const emailRouter = createTRPCRouter({
  sendEmail: publicProcedure
    .input(
      z.object({
        to: z.string(),
        token: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Email api");
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(env.SENDGRID_API_KEY);
        const msg = {
          to: input.to,
          from: "anselmo@dcm.com.ar",
          subject: "Confirmación de reserva locker.",
          // text: "and easy to do anywhere, even with Node.js",
          html: `<strong>Su código de reserva es ${input.token}</strong>`,
        };

        await sgMail
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
