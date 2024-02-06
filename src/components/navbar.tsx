import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/components/ui/menubar";

export default function Navbar() {
  return (
    <Menubar>
      <MenubarMenu>
        <Link href={"/panel"}>
          <MenubarTrigger>Panel</MenubarTrigger>
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <Link href={"/panel/ciudades"}>
          <MenubarTrigger>Ciudades</MenubarTrigger>
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <Link href={"/panel/locales"}>
          <MenubarTrigger>Locales</MenubarTrigger>
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <Link href={"/panel/tamanos"}>
          <MenubarTrigger>Tamaños</MenubarTrigger>
        </Link>
      </MenubarMenu>
    </Menubar>
  );
}
