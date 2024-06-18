import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import Sidenav, { SidenavItem, SidenavSeparator } from "./sidenav";
import {
  AlignStartVerticalIcon,
  CloudIcon,
  CogIcon,
  DollarSignIcon,
  GroupIcon,
  KeyRound,
  ReceiptIcon,
  Settings2Icon,
  UserIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { About } from "./about-dialog";
import { Button } from "./ui/button";

export default function AppSidenav(props: { isAdmin: boolean }) {
  console.log(props.isAdmin);
  return (
    <Sidenav>
      <SidenavSeparator>Administración</SidenavSeparator>
      <SidenavItem icon={<DashboardIcon />} disabled={false}>
        Dashboard
      </SidenavItem>
      <SidenavItem icon={<Settings2Icon />} href="/panel/global">
        Global
      </SidenavItem>
      <SidenavItem icon={<CloudIcon />} disabled={false}>
        Ciudades{" "}
      </SidenavItem>
      {props.isAdmin && (
        <SidenavItem icon={<UserIcon />} href="/panel/usuarios">
          Usuarios
        </SidenavItem>
      )}
      {props.isAdmin && (
        <SidenavItem icon={<CogIcon />} disabled={false}>
          Roles
        </SidenavItem>
      )}
      {props.isAdmin && (
        <SidenavItem icon={<KeyRound />} disabled={false}>
          Permisos
        </SidenavItem>
      )}
      <SidenavItem icon={<AlignStartVerticalIcon />} href="/panel/locales">
        Locales
      </SidenavItem>
      <SidenavItem icon={<GroupIcon />} href="/panel/tamanos">
        Tamaños
      </SidenavItem>
      <SidenavItem icon={<DollarSignIcon />} href="/panel/tarifas">
        Tarifas
      </SidenavItem>
      <SidenavItem icon={<CloudIcon />} href="/panel/clientes">
        Clientes{" "}
      </SidenavItem>
      <SidenavItem icon={<ReceiptIcon />} href="/panel/reservas">
        Reservas
      </SidenavItem>
      {/* <SidenavSeparator>Separador</SidenavSeparator>
      <SidenavItem icon={<FingerprintIcon />} href="/panel/locales">
        Item 1
      </SidenavItem>
      <SidenavItem icon={<DollarSignIcon />} href="/panel/tamanos">
        Item 2
      </SidenavItem> */}
      <div className="absolute bottom-0 right-0 px-5">
        <About />
      </div>
    </Sidenav>
  );
}
