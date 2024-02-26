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
    <div className="grid grid-cols-2 gap-8 p-8">
      <div className="grid grid-cols-12 gap-4 px-3">
        <Input className="col-span-6" placeholder={"Nombre"} />
        <Input className="col-span-6" placeholder={"Apellido"} />
        <Input className="col-span-12" placeholder={"Email"} />
        <Input className="col-span-4" placeholder={"prefijo"} />
        <Input className="col-span-8" placeholder={"Telefono"} />
        <Label className="col-span-12 p-3">
          Te enviaremos un código para que puedas abrir tu taquilla.
        </Label>

        <div className="flex">
          <div dir="ltr">
            <div className="col-span-4 w-full rounded-s-lg px-2">
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

      <div className="grid-cols-12 gap-4 bg-green-200 px-8 pt-3">
        <Title>Tu reserva</Title>
        <div className="rounded pt-5">
          <Card className="rounded bg-gray-50 pl-5 pr-5 ">
            <CardHeader className="">
              <CardTitle> LOCAL CENTRAL</CardTitle>
              <CardDescription>
                <div className=" flex justify-between pt-4">
                  <div className="right-64 grid-cols-6">
                    <div className="grid-cols-6">
                      <Label>Entrega desde ...</Label>
                    </div>
                    <div className="grid-cols-6">
                      <Label>Entrega hasta ...</Label>
                    </div>
                  </div>
                  <div className="grid-cols-6  items-end		">
                    <div className="grid-cols-6">
                      <Label>Mie 14 Noviembre</Label>
                    </div>
                    <div className="grid-cols-6">
                      <Label>Mie 14 Noviembre</Label>
                    </div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div>
          <div className="grid-cols-12  pt-3">
            <Title>Taquilla XXL</Title>
            <div className=" flex justify-between pt-4">
              <div className="right-64 grid-cols-6">
                <div className="grid-cols-6">
                  <Label>Primer día</Label>
                </div>
                <div className="grid-cols-6">
                  <Label>Segundo día </Label>
                </div>
              </div>
              <div className="grid-cols-6 ">
                <div className="grid-cols-6">
                  <Label>5 pesos</Label>
                </div>
                <div className="grid-cols-6">
                  <Label>6 pesos</Label>
                </div>
              </div>
            </div>
          </div>
          <hr className=" h-1 w-full rounded border-0 bg-gray-400 dark:bg-gray-700 md:my-5" />
          <div className="grid-cols-12 pb-3">
            <div className=" flex justify-between">
              <div className="right-64 grid-cols-6">
                <div className="grid-cols-6">
                  <Label>Subtotal </Label>
                </div>
              </div>
              <div className="grid-cols-6  items-end		">
                <div className="grid-cols-6">
                  <Label>11 pesos</Label>
                </div>
              </div>
            </div>
          </div>
          <hr className=" h-1 w-full rounded border-0 bg-gray-400 dark:bg-gray-700 md:my-5" />
          <div className="grid-cols-12 pb-3">
            <div className=" flex justify-between">
              <div className="right-64 grid-cols-6">
                <div className="grid-cols-6">
                  <Label>Total </Label>
                </div>
              </div>
              <div className="grid-cols-6  items-end		">
                <div className="grid-cols-6">
                  <Label>11 pesos</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
