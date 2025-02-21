import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { schema } from "~/server/db";
import { eq } from "drizzle-orm";
import { type PublicConfigKeys } from "~/lib/config";

export const configRouter = createTRPCRouter({
  getKey: publicProcedure
    .input(z.object({ key: z.custom<PublicConfigKeys>() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.publicConfig.findFirst({
        where: eq(schema.publicConfig.key, input.key)
      });
    }),
});
