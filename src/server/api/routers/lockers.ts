import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

// Define boxesValidator schema
const boxesValidator = z.object({
  id: z.number(),
  idFisico: z.number(),
  idLocker: z.number(),
  idSize: z.number().nullable(),
  box1: z.string().nullable(),
  puerta: z.boolean(),
  ocupacion: z.boolean(),
  libre: z.string().nullable(),
  lastUpdateTime: z.string().nullable(),
  status: z.string().nullable(),
  enable: z.boolean(),
  idSizeNavigation: z
    .object({
      id: z.number(),
      nombre: z.string(),
      alto: z.number(),
      ancho: z.number(),
      profundidad: z.number(),
    })
    .nullable(),
  tokens: z.array(z.any()),
});

// Define lockerValidator schema
const lockerValidator = z.object({
  id: z.number(),
  nroSerieLocker: z.string(),
  lastUpdateTime: z.string().nullable(),
  status: z.string().nullable(),
  boxes: z.array(boxesValidator),
  empresaNavigation: z
    .object({
      id: z.number(),
      nombre: z.string(),
      active: z.number(),
      tokenEmpresa: z.string(),
      lockers: z.array(z.any()).nullable(),
    })
    .nullable(),
  tokens: z.array(z.any()).nullable(),
});

export type Locker = z.infer<typeof lockerValidator>;
export type Boxes = z.infer<typeof boxesValidator>;

export const lockerRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const sizeResponse = await fetch(
      `${env.SERVER_URL}/api/locker/byTokenEmpresa/${env.TOKEN_EMPRESA}`,
    );
    console.log("sizeResponse.ok", sizeResponse.ok);
    if (!sizeResponse.ok) {
      const errorResponse = await sizeResponse.json();
      return { error: errorResponse.message || "Unknown error" };
    }

    const reservedBoxData = await sizeResponse.json();
    console.log("reservedBoxData", reservedBoxData);
    // Validate the response data against the lockerValidator schema
    const validatedData = z.array(lockerValidator).safeParse(reservedBoxData);
    console.log("validatedData.success", validatedData.success);
    if (!validatedData.success) {
      // If the data is not an array, wrap it in an array
      const singleLocker = lockerValidator.safeParse(reservedBoxData);

      throw null;
    }
    console.log("validatedData.data", validatedData.data);
    return validatedData.data;
  }),
});
