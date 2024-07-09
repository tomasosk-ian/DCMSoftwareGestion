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
  LayoutDashboardIcon,
  PercentCircleIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { About } from "./about-dialog";
import { Button } from "./ui/button";

export default function AppSidenav(props: { isAdmin: boolean }) {
  console.log(props.isAdmin);
  return (
    <Sidenav>
      {props.isAdmin && <SidenavSeparator>Mantenimiento</SidenavSeparator>}
      {props.isAdmin && (
        <SidenavItem icon={<UserIcon />} href="/panel/usuarios">
          Usuarios
        </SidenavItem>
      )}
      {props.isAdmin && (
        <SidenavItem icon={<CogIcon />} disabled={true}>
          Roles
        </SidenavItem>
      )}
      {props.isAdmin && (
        <SidenavItem icon={<KeyRound />} disabled={true}>
          Permisos
        </SidenavItem>
      )}
      <SidenavSeparator>Administración</SidenavSeparator>

      <SidenavItem icon={<LayoutDashboardIcon />} href="/panel/monitor">
        Monitor
      </SidenavItem>
      <SidenavItem icon={<CloudIcon />} disabled={true}>
        Ciudades{" "}
      </SidenavItem>

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
      <SidenavItem icon={<PercentCircleIcon />} href="/panel/cupones">
        Cupones{" "}
      </SidenavItem>

      <div className="absolute bottom-0 right-0 px-5">
        <About />
      </div>
    </Sidenav>
  );
}
