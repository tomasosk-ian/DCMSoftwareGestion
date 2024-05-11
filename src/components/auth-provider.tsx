import { Loader2Icon } from "lucide-react";
import { Suspense, useEffect } from "react";
import { getServerAuthSession } from "~/server/auth";
import { SignInButton } from "./sign-in-out-buttons";
import { headers } from "next/headers";
import { api } from "~/trpc/server";

export default function AuthProvider(props: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <AuthProviderContent>{props.children}</AuthProviderContent>
    </Suspense>
  );
}

async function AuthProviderContent(props: { children: React.ReactNode }) {
  // console.log(pathname);

  const session = await getServerAuthSession();
  // console.log(session);

  if (!session?.user) {
    return <SignInPage />;
  }
  // if (session) {
  //   const access = await api.roles.getAccess.query({
  //     roleId: session.user.role,
  //   });

  //   if (pathname === access) {
  //   } else {
  //     return Denied();
  //   }
  // }

  return <>{props.children}</>;
}

function SignInPage() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center">
      <SignInButton />
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center">
      <Loader2Icon className="h-10 w-10 animate-spin" />
    </div>
  );
}

function Denied() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center">
      Acceso denegado.
    </div>
  );
}
