import Sidenav, { SidenavItem, SidenavSeparator } from "./sidenav";
import {
  AlignStartVerticalIcon,
  CloudIcon,
  CogIcon,
  DollarSignIcon,
  GroupIcon,
  KeyRound,
  ReceiptIcon,
  UserIcon,
  LayoutDashboardIcon,
  PercentCircleIcon,
  AreaChartIcon,
  BanIcon,
} from "lucide-react";
import { About } from "./about-dialog";
import { useRouter } from "next/router";

export default function AppSidenav(props: { isAdmin: boolean }) {
  const router = useRouter();
  return (
    <div className="text-xs">
      <Sidenav>
        {props.isAdmin && <SidenavSeparator>Mantenimiento</SidenavSeparator>}
        {props.isAdmin && (
          <SidenavItem icon={<UserIcon />} href="/panel/usuarios">
            Usuarios
          </SidenavItem>
        )}
        {props.isAdmin && (
          <SidenavItem icon={<BanIcon />} disabled={true}>
            Roles
          </SidenavItem>
        )}
        {props.isAdmin && (
          <SidenavItem icon={<KeyRound />} disabled={true}>
            Permisos
          </SidenavItem>
        )}
        {props.isAdmin && (
          <SidenavItem
            icon={<AreaChartIcon />}
            disabled={false}
            href="/panel/reportes"
          >
            Reportes
          </SidenavItem>
        )}{" "}
        {props.isAdmin && (
          <SidenavItem
            icon={<CogIcon />}
            disabled={false}
            href="/panel/parametros"
          >
            Parámetros
          </SidenavItem>
        )}
        <SidenavSeparator>Administración</SidenavSeparator>
        <SidenavItem
          icon={<LayoutDashboardIcon />}
          onClick={() => router.push("/panel/monitor")}
        >
          Monitor
        </SidenavItem>
        {/* <SidenavItem icon={<CloudIcon />} disabled={true}>
          Ciudades{" "}
        </SidenavItem> */}
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
    </div>
  );
}
