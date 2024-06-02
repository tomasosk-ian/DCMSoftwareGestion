"use client";

import { useEffect, useState } from "react";
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
import { countries } from "countries-list";
import { Checkbox } from "~/components/ui/checkbox";

export default function UserForm(props: {
  client: Client;
  setClient: (client: Client) => void;
  errors: {
    name: string;
    surname: string;
    email: string;
    prefijo: string;
    telefono: string;
    terms: string;
  };
  setErrors: (errors: {
    name: string;
    surname: string;
    email: string;
    prefijo: string;
    telefono: string;
    terms: string;
  }) => void;
  terms: boolean;
  setTerms: (terms: boolean) => void;
}) {
  const [phones, setPhones] = useState<Record<string, number>[]>();

  useEffect(() => {
    const phoneNumbers: Record<string, number>[] = [];

    Object.entries(countries).forEach(([countryCode, countryData]) => {
      const { phone } = countryData;
      if (countryCode === "AR") {
        phoneNumbers.unshift({ [countryCode]: phone[0]! });
      } else {
        phoneNumbers.push({ [countryCode]: phone[0]! });
      }
    });

    setPhones(phoneNumbers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    props.setClient({ ...props.client, [name]: value });
    props.setErrors({ ...props.errors, [name]: "" });
  };

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg bg-[#F0F0F0] p-6 shadow-md md:grid-cols-12 md:px-3 md:py-6">
      <h2 className="col-span-1 text-lg font-bold text-black md:col-span-12">
        Completá tus datos
      </h2>
      <Input
        className="border-buttonPick focus:border-buttonPick col-span-1 rounded border-2 md:col-span-6"
        placeholder="Nombre"
        name="name"
        value={props.client.name!}
        onChange={handleChange}
      />
      <Input
        className="border-buttonPick focus:border-buttonPick col-span-1 rounded border-2 md:col-span-6"
        placeholder="Apellido"
        name="surname"
        value={props.client.surname!}
        onChange={handleChange}
      />
      <span className="col-span-1 text-red-500 md:col-span-6">
        {props.errors.name}
      </span>
      <span className="col-span-1 text-red-500 md:col-span-6">
        {props.errors.surname}
      </span>
      <Input
        className="border-buttonPick focus:border-buttonPick col-span-1 rounded border-2 md:col-span-12"
        placeholder="Email"
        name="email"
        value={props.client.email!.toLowerCase()}
        onChange={handleChange}
      />
      <span className="col-span-1 text-red-500 md:col-span-12">
        {props.errors.email}
      </span>
      <div className="border-buttonPick focus:border-buttonPick col-span-1 rounded border-2 md:col-span-4">
        <Select
          onValueChange={(value: string) => {
            props.setClient({
              ...props.client,
              prefijo: parseInt(value),
            });
            props.setErrors({ ...props.errors, prefijo: "" });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Elija un prefijo" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-auto">
            <SelectGroup>
              <SelectLabel>Prefijos</SelectLabel>
              {phones?.map((item) => (
                <SelectItem
                  key={Object.keys(item)[0]}
                  value={item[Object.keys(item)[0]!]!.toString()}
                >
                  ({item[Object.keys(item)[0]!]!.toString()}){" "}
                  {Object.keys(item)[0]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Input
        className="border-buttonPick focus:border-buttonPick col-span-1 rounded border-2 md:col-span-8"
        placeholder="Telefono"
        name="telefono"
        value={props.client.telefono ? props.client.telefono : 0}
        onChange={(e) => {
          const { name, value } = e.target;
          props.setClient({ ...props.client, [name]: parseInt(value) });
          props.setErrors({ ...props.errors, [name]: "" });
        }}
      />
      {props.errors.prefijo && (
        <span className="col-span-1 text-red-500 md:col-span-4">
          {props.errors.prefijo}
        </span>
      )}
      {props.errors.telefono && (
        <span className="col-span-1 text-red-500 md:col-span-8">
          {props.errors.telefono}
        </span>
      )}
      <Label className="col-span-1 text-xs italic text-gray-600 md:col-span-12">
        Te enviaremos un código para que puedas abrir tu locker.
      </Label>
      <Label className="text-buttonPick col-span-1 text-xs md:col-span-12">
        Añade tu código de descuento
      </Label>
      <div className="col-span-1 flex md:col-span-12">
        <Input
          className="border-buttonPick focus:border-buttonHover flex-grow rounded-l-md rounded-r-none border-2 border-r-0 px-2 focus:ring-0"
          placeholder="Aplicar cupón de descuento"
        />
        <Button className="bg-buttonPick hover:bg-buttonHover border-buttonPick rounded-l-none rounded-r-md border-2 border-l-0 text-white">
          Aplicar
        </Button>
      </div>
      <div className="col-span-1 flex items-center space-x-2 py-4 md:col-span-12">
        <Checkbox
          id="terms"
          onCheckedChange={(e: boolean) => {
            props.setTerms(e);
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Aceptar los{" "}
          <i
            className="hover:underline"
            onClick={() => {
              open(
                "https://lockersurbanos.com.ar/wp-content/uploads/2024/05/Terminos-y-condiciones-Lockers-Urbanos.pdf",
              );
            }}
          >
            términos y condiciones
          </i>
        </label>
        <span className="text-red-500">{props.errors.terms}</span>
      </div>
      <div className="col-span-1 text-center md:col-span-12">
        <label htmlFor="terms" className="text-sm">
          <strong>¿Necesitas ayuda? Llámanos al +54 9 294 492-7340</strong>
        </label>
      </div>
    </div>
  );
}
