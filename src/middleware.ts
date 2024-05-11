import { NextResponse, type NextRequest } from "next/server";
import { env } from "process";
import { db } from "~/server/db";

export default async function middleware(request: NextRequest) {
  const result = await db.query.roles.findMany();
  const sessions = await db.query.sessions.findMany({ with: { user: true } });
  const { cookies } = request;

  let cookie = cookies.get("next-auth.session-token");

  if (env.VERCE_ENV == "PRODUCITION") {
    let cookie = cookies.get("__Secure-next-auth.session-token");
  }
  const session = sessions.find(
    (session: any) => session.sessionToken === cookie?.value,
  );
  const access = result.find((role) => role.id === session?.user.role)?.access;

  if (access === undefined) {
    return NextResponse.redirect(new URL("/accessdenied", request.url));
  }

  if (
    !access.some(
      (path: string) =>
        path === request.nextUrl.pathname ||
        (request.nextUrl.pathname.startsWith(path.slice(0, -2)) &&
          path.endsWith("/*")),
    )
  ) {
    return NextResponse.redirect(new URL("/accessdenied", request.url));
  }
}

export const config = {
  matcher: ["/panel/:path*"],
};
