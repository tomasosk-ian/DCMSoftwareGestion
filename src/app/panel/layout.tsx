import { TRPCReactProvider } from "~/trpc/react";
import { cookies } from "next/headers";
import AppLayout from "~/components/applayout";
import { getServerAuthSession } from "~/server/auth";
import AppSidenav from "~/components/app-sidenav";
import AuthProvider from "~/components/auth-provider";
import { Toaster } from "sonner";
import LayoutContainer from "~/components/layout-container";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  return (
    <html lang="es">
      <body>
        <AppLayout
          title={<h1>DCM Solution</h1>}
          user={session?.user}
          sidenav={<AppSidenav />}
        >
          <div className="mb-10 flex justify-center">
            <AuthProvider>
              <TRPCReactProvider cookies={cookies().toString()}>
                <Toaster />
                <LayoutContainer>{props.children}</LayoutContainer>
              </TRPCReactProvider>
            </AuthProvider>
          </div>
          <div></div>
        </AppLayout>
      </body>
    </html>
  );
}
