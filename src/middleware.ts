import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";

export default async function middleware(request: NextRequest) {
  const result = await db.query.roles.findMany();
  const sessions = await db.query.sessions.findMany({ with: { user: true } });
  const { cookies } = request;

  let cookie = cookies.get("next-auth.session-token");
  const session = sessions.find(
    (session: any) => session.sessionToken === cookie?.value,
  );
  const access = result.find((role) => role.id === session?.user.role)?.access;

  console.log("path is");
  console.log(request.nextUrl.pathname);
  console.log("cookies is");
  console.log(cookies);
  console.log("cokkie is");
  console.log(cookie);
  console.log("session is");
  console.log(session);
  console.log("result is");
  console.log(result);
  console.log("and roles allow to");
  console.log(access);
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
