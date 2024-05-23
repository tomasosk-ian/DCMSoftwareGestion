import { TRPCReactProvider } from "~/trpc/react";
import { cookies } from "next/headers";
import AppLayout from "~/components/applayout";
import AppSidenav from "~/components/app-sidenav";
import { Toaster } from "sonner";
import LayoutContainer from "~/components/layout-container";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <main>
            <AppLayout title={<h1>DCM Solution</h1>} sidenav={<AppSidenav />}>
              <div className="mb-10 flex justify-center">
                <TRPCReactProvider cookies={cookies().toString()}>
                  <Toaster />
                  <LayoutContainer>{props.children}</LayoutContainer>
                </TRPCReactProvider>
              </div>
              <div></div>
            </AppLayout>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
