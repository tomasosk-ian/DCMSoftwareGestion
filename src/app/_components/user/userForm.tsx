"use client";

import { Title } from "@radix-ui/react-toast";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Client } from "~/server/api/routers/clients";

export default function UserForm(props: {
  client: Client;
  setClient: (client: Client) => void;
  errors: {
    name: string;
    surname: string;
    email: string;
    prefijo: string;
    telefono: string;
  };
  setErrors: (errors: {
    name: string;
    surname: string;
    email: string;
    prefijo: string;
    telefono: string;
  }) => void;
}) {
  // console.log(myCountryCodesObject);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    props.setClient({ ...props.client, [name]: value });
    props.setErrors({ ...props.errors, [name]: "" });
  };

  return (
    <div className="grid h-10 grid-cols-12 gap-4 px-3">
      <Input
        className="col-span-6 border-4 border-indigo-300/50"
        placeholder={"Nombre"}
        name="name"
        value={props.client.name!}
        onChange={handleChange}
      />
      <Input
        className="col-span-6 border-4 border-indigo-300/50"
        placeholder={"Apellido"}
        name="surname"
        value={props.client.surname!}
        onChange={handleChange}
      />
      <span className="col-span-6 text-red-500">{props.errors.name}</span>

      <span className="col-span-6 text-red-500">{props.errors.surname}</span>

      <Input
        className="col-span-12 border-4 border-indigo-300/50"
        placeholder={"Email"}
        name="email"
        value={props.client.email!}
        onChange={handleChange}
      />
      <span className="col-span-12 text-red-500">{props.errors.email}</span>

      <Input
        className="col-span-4 border-4 border-indigo-300/50"
        placeholder={"Prefijo"}
        name="prefijo"
        value={props.client.prefijo!}
        onChange={(e) => {
          const { name, value } = e.target;
          props.setClient({ ...props.client, [name]: parseInt(value) });
          props.setErrors({ ...props.errors, [name]: "" });
        }}
      />

      <div>
        <Label className="text-right">Prefijo</Label>
        {/* <Select
          name="prefijo"
          onValueChange={(value) => {
            props.setClient({ ...props.client, prefijo: parseInt(value) });
            props.setErrors({ ...props.errors, prefijo: "" });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"Prefijo"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Lockers</SelectLabel>
              {myCountryCodesObject.map((e: any) => {
                console.log(e[0]);
                return (
                  // <SelectItem key={e[0]} value={e[0]}>
                  //   {e.}
                  // </SelectItem>

                  <p>hola</p>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select> */}
      </div>
      <span className="col-span-10 text-red-500">{props.errors.prefijo}</span>

      <Input
        className="col-span-8 border-4 border-indigo-300/50"
        placeholder={"Telefono"}
        name="telefono"
        value={props.client.telefono!}
        onChange={(e) => {
          const { name, value } = e.target;
          props.setClient({ ...props.client, [name]: parseInt(value) });
          props.setErrors({ ...props.errors, [name]: "" });
        }}
      />
      <span className="col-span-8 text-red-500">{props.errors.telefono}</span>

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
