import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
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
  ReceiptIcon,
  Settings2Icon,
  TagsIcon,
  TentIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { About } from "./about-dialog";
import { Button } from "./ui/button";

export default function AppSidenav() {
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
      <SidenavItem icon={<ReceiptIcon />} disabled={false}>
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
