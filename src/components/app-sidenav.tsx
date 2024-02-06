import Sidenav, { SidenavItem, SidenavSeparator } from "./sidenav";
import {
  ActivityIcon,
  ActivitySquareIcon,
  BanknoteIcon,
  DollarSignIcon,
  FileUpIcon,
  FingerprintIcon,
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  MessageSquareReplyIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react";

export default function AppSidenav() {
  return (
    <Sidenav>
      <SidenavSeparator>Administración</SidenavSeparator>
      <SidenavItem icon={<Settings2Icon />} href="/panel">
        Global
      </SidenavItem>
      <SidenavItem icon={<UsersIcon />} href="/panel/ciudades">
        Ciudades
      </SidenavItem>
      <SidenavItem icon={<FingerprintIcon />} href="/panel/locales">
        Locales
      </SidenavItem>
      <SidenavItem icon={<DollarSignIcon />} href="/panel/tamanos">
        Tamaños
      </SidenavItem>

      <SidenavSeparator>Separador</SidenavSeparator>
      <SidenavItem icon={<FingerprintIcon />} href="/panel/locales">
        Item 1
      </SidenavItem>
      <SidenavItem icon={<DollarSignIcon />} href="/panel/tamanos">
        Item 2
      </SidenavItem>
    </Sidenav>
  );
}
