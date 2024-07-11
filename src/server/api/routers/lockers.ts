import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

const tokenValidator = z.object({
  id: z.number().nullable().optional(),
  idLocker: z.number().nullable().optional(),
  idSize: z.number().nullable().optional(),
  idBox: z.number().nullable().optional(),
  token1: z.string().nullable().optional(),
  fechaCreacion: z.string().nullable().optional(),
  fechaInicio: z.string().nullable().optional(),
  fechaFin: z.string().nullable().optional(),
  contador: z.number().nullable().optional(),
  cantidad: z.number().nullable().optional(),
  confirmado: z.boolean().nullable().optional(),
  modo: z.string().nullable().optional(),
  idBoxNavigation: z.any().nullable().optional(),
  idLockerNavigation: z.any().nullable().optional(),
  idSizeNavigation: z.any().nullable().optional(),
});
const boxesValidator = z.object({
  id: z.number().nullable().optional(),
  idFisico: z.number().nullable().optional(),
  idLocker: z.number(),
  idSize: z.number().nullable().optional(),
  box1: z.string().nullable().optional(),
  puerta: z.boolean().nullable().optional(),
  ocupacion: z.boolean().nullable().optional(),
  libre: z.string().nullable().optional(),
  lastUpdateTime: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  enable: z.boolean().nullable().optional(),
  idSizeNavigation: z
    .object({
      id: z.number().nullable().optional(),
      nombre: z.string().nullable().optional(),
      alto: z.number().nullable().optional(),
      ancho: z.number().nullable().optional(),
      profundidad: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  tokens: z.array(tokenValidator), // Use the token schema here
});

// Define lockerValidator schema
const lockerValidator = z.object({
  id: z.number(),
  nroSerieLocker: z.string(),
  lastUpdateTime: z.string().nullable().optional(),
  status: z.string().nullable().nullable().optional(),
  boxes: z.array(boxesValidator),
  empresaNavigation: z
    .object({
      id: z.number(),
      nombre: z.string(),
      active: z.number(),
      tokenEmpresa: z.string(),
      lockers: z.array(z.any()).nullable(),
    })
    .nullable()
    .nullable()
    .optional(),
  tokens: z.array(tokenValidator).nullable().optional(), // Use the token schema here
});

export type Locker = z.infer<typeof lockerValidator>;
export type Boxes = z.infer<typeof boxesValidator>;
export type Token = z.infer<typeof tokenValidator>;

export const lockerRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    console.log(
      "sizeResponsssssse",
      `${env.SERVER_URL}/api/locker/byTokenEmpresa/${env.TOKEN_EMPRESA}`,
    );
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
    console.log("validatedData.data", validatedData.data[0]?.boxes);
    return validatedData.data;
  }),
});
