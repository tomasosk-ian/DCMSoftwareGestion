import LockerOcupationPage from "./page-client";
import { auth } from "@clerk/nextjs/server";

export default async function Reportes() {
  const isAdmin = auth().protect().sessionClaims.metadata.role == "admin";
  if (!isAdmin) {
    return <div></div>;
  }
  
  return <LockerOcupationPage />;
}