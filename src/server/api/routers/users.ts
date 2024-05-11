import { eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { RouterOutputs } from "~/trpc/shared";
import { db, schema } from "~/server/db";

export const userRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    ctx.db.select().from(users);
    const result = ctx.db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.id)],
      with: { roles: true },
    });
    return result;
  }),

  getUser: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, input),
      with: {
        roles: true,
      },
    });
  }),

  getById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.users.findFirst({
        where: eq(schema.users.id, input.userId),
        with: {
          roles: true,
        },
      });

      return channel;
    }),
  getByToken: publicProcedure
    .input(
      z.object({
        tokenSession: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.sessions.findFirst({
        where: eq(schema.sessions.sessionToken, input.tokenSession),
        with: {
          user: true,
        },
      });

      return channel?.user;
    }),
  change: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        role: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.identifier));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.delete(schema.users).where(eq(schema.users.id, input.id));
    }),
});

export type User = RouterOutputs["user"]["get"][number];
