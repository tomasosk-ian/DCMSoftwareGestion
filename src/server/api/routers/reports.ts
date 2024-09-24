// import { eq } from "drizzle-orm";
// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { db } from "~/server/db";
// import { lockerValidator } from "./lockers";
// import { checkBoxAssigned } from "./reserves";
// import { env } from "process";

// export const reportRouter = createTRPCRouter({
//   getUsageReport: publicProcedure
//     .input(
//       z.object({
//         startDate: z.string(),
//         endDate: z.string(),
//       })
//     )
//     .query(async ({ input }) => {
//       const { startDate, endDate } = input;

//       const locerResponse = await fetch(
//         `${env.SERVER_URL}/api/locker/byTokenEmpresa/${env.TOKEN_EMPRESA}`,
//       );
//       if (!locerResponse.ok) {
//         const errorResponse = await locerResponse.json();
//         return { error: errorResponse.message || "Unknown error" };
//       }

//       const reservedBoxData = await locerResponse.json();
//       // Validate the response data against the lockerValidator schema
//       const validatedData = z.array(lockerValidator).safeParse(reservedBoxData);
//       if (!validatedData.success) {
//         // If the data is not an array, wrap it in an array
//         const singleLocker = lockerValidator.safeParse(reservedBoxData);

//         throw null;
//       }
//       await checkBoxAssigned();
//       const totalLockers= validatedData.data.length;

//       const sizeDistribution = ["a",2];

//       return {
//         totalLockers,
//         sizeDistribution,
//         totalAvgRentPeriod,
//         totalAvgRentPeriodByLocker,
//         totalRevenue,
//         totalRevenueByLocker,
//         totalRevenueByBox,
//       };
//     }),
// });

// export const reportsValidator = z.object({
//     totalLockers: z.number().nullable().optional(),
//     sizeDistribution: z.tuple([z.string(), z.number()]);
//     idSize: z.number().nullable().optional(),
//     idBox: z.number().nullable().optional(),
//     token1: z.string().nullable().optional(),
//     fechaCreacion: z.string().nullable().optional(),
//     fechaInicio: z.string().nullable().optional(),
//     fechaFin: z.string().nullable().optional(),
//     contador: z.number().nullable().optional(),
//     cantidad: z.number().nullable().optional(),
//     confirmado: z.boolean().nullable().optional(),
//     modo: z.string().nullable().optional(),
//     idBoxNavigation: z.any().nullable().optional(),
//     idLockerNavigation: z.any().nullable().optional(),
//     idSizeNavigation: z.any().nullable().optional(),
//   });
// export type Reports = z.infer<typeof reportsValidator>;
