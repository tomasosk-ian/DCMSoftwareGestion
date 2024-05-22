import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";
import { env } from "./env";
import { api } from "~/trpc/server";
import { permissions } from "./server/db/schema";

export default async function middleware(request: NextRequest) {
  const result = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.id)],
    with: {
      roles: { with: { rolesToPermissions: { with: { permissions: true } } } },
    },
  });
  console.log(result);
  // const result = await db.query.roles.findMany();
  const sessions = await db.query.sessions.findMany({ with: { user: true } });
  const { cookies } = request;
  const tokenKey =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  let cookie = cookies.get(tokenKey);
  const session = sessions.find(
    (session: any) => session.sessionToken === cookie?.value,
  );
  // const access = result.find((role) => role.id === session?.user.role)?.;

  // if (access === undefined) {
  //   return NextResponse.redirect(new URL("/accessdenied", request.url));
  // }

  // if (
  //   !access.some(
  //     (path: string) =>
  //       path === request.nextUrl.pathname ||
  //       (request.nextUrl.pathname.startsWith(path.slice(0, -2)) &&
  //         path.endsWith("/*")),
  //   )
  // ) {
  //   return NextResponse.redirect(new URL("/accessdenied", request.url));
  // }
}

export const config = {
  matcher: ["/panel/:path*"],
};
