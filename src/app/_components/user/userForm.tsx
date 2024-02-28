"use client";

import { Title } from "@radix-ui/react-toast";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Store } from "~/server/api/routers/store";

export default function UserForm() {
  return (
    <div className="grid h-10 grid-cols-12 gap-4  px-3">
      <Input
        className="col-span-6 border-4 border-indigo-300/50"
        placeholder={"Nombre"}
      />
      <Input
        className="col-span-6 border-4 border-indigo-300/50"
        placeholder={"Apellido"}
      />
      <Input
        className="col-span-12 border-4 border-indigo-300/50  "
        placeholder={"Email"}
      />
      <Input
        className="col-span-4 border-4 border-indigo-300/50"
        placeholder={"prefijo"}
      />
      <Input
        className="col-span-8 border-4 border-indigo-300/50"
        placeholder={"Telefono"}
      />
      <Label className="col-span-12 p-3 text-xs italic">
        Te enviaremos un código para que puedas abrir tu taquilla.
      </Label>
      <Label className="col-span-12 p-3 text-xs italic text-red-500">
        Añade tu codigo de descuento
      </Label>

      <div className="flex">
        <div dir="ltr">
          <div className="col-span-4 w-96 rounded-s-lg px-2">
            <Input placeholder={"Aplicar cupón de descuento"}></Input>
          </div>
        </div>
        <div dir="rtl">
          <div>
            <Button className="col-span-4 p-2">Aplicar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
