import { PersonIcon } from "@radix-ui/react-icons";
import Sidenav, { SidenavItem, SidenavSeparator } from "./sidenav";
import {
  ActivityIcon,
  ActivitySquareIcon,
  AlignStartVerticalIcon,
  BanknoteIcon,
  CloudIcon,
  CogIcon,
  DnaIcon,
  DollarSignIcon,
  DotIcon,
  FileUpIcon,
  FingerprintIcon,
  GroupIcon,
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  MessageSquareReplyIcon,
  PersonStanding,
  Settings2Icon,
  TagsIcon,
  TentIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export default function AppSidenav() {
  return (
    <Sidenav>
      <SidenavSeparator>Administración</SidenavSeparator>
      <SidenavItem icon={<Settings2Icon />} href="/panel/global">
        Global
      </SidenavItem>
      <SidenavItem icon={<UserIcon />} href="/panel/users">
        Usuarios
      </SidenavItem>
      <SidenavItem icon={<DnaIcon />} href="/panel/roles">
        Roles
      </SidenavItem>{" "}
      <SidenavItem icon={<CogIcon />} href="/panel/permissions">
        Permisos
      </SidenavItem>
      <SidenavItem icon={<CloudIcon />} href="/panel/ciudades">
        Ciudades
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
      <SidenavItem icon={<TagsIcon />} href="/panel/clientes">
        Clientes
      </SidenavItem>
      {/* <SidenavSeparator>Separador</SidenavSeparator>
      <SidenavItem icon={<FingerprintIcon />} href="/panel/locales">
        Item 1
      </SidenavItem>
      <SidenavItem icon={<DollarSignIcon />} href="/panel/tamanos">
        Item 2
      </SidenavItem> */}
    </Sidenav>
  );
}
