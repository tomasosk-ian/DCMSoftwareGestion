"use client";

import { Title } from "@radix-ui/react-toast";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Store } from "~/server/api/routers/store";

export default function UserForm() {
  return (
    <div className="grid grid-cols-2 p-8">
      <div className="grid grid-cols-12 gap-4 px-3">
        <Input className="col-span-6" placeholder={"Nombre"} />
        <Input className="col-span-6" placeholder={"Apellido"} />
        <Input className="col-span-12" placeholder={"Email"} />
        <Input className="col-span-4" placeholder={"prefijo"} />
        <Input className="col-span-8" placeholder={"Telefono"} />
        <Label className="col-span-12 p-3">
          Te enviaremos un código para que puedas abrir tu taquilla.
        </Label>

        <div className="col-span-12">
          <div dir="ltr">
            <div className="col-span-4 rounded-s-lg px-2">
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

      <div className="grid grid-cols-12 gap-4 px-3"></div>
    </div>
  );
}
