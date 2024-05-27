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
import { continents, countries, languages } from "countries-list";
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
      if (countryCode == "AR") {
        phoneNumbers.unshift({ [countryCode]: phone[0]! });
      } else {
        phoneNumbers.push({ [countryCode]: phone[0]! });
      }
    }, []);

    setPhones(phoneNumbers);
  }, []);
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
        value={props.client.email!.toLowerCase()}
        onChange={handleChange}
      />
      <span className="col-span-12 text-red-500">{props.errors.email}</span>
      <div className="col-span-4 max-h-60 border-4 border-indigo-300/50">
        <Select
          onValueChange={(value: string) => {
            props.setClient({
              ...props.client,
              ["prefijo"]: parseInt(value),
            });
            props.setErrors({ ...props.errors, ["prefijo"]: "" });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={"Elija un prefijo"} />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-auto">
            <SelectGroup>
              <SelectLabel>Prefijos</SelectLabel>
              {phones?.map((item) => {
                return (
                  <SelectItem
                    key={Object.keys(item)[0]}
                    value={item[Object.keys(item!)[0]!]!.toString()}
                  >
                    ({item[Object.keys(item!)[0]!]!.toString()}){" "}
                    {Object.keys(item)[0]}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Input
        className="col-span-8 border-4 border-indigo-300/50"
        placeholder={"Telefono"}
        name="telefono"
        value={props.client.telefono ? props.client.telefono : 0}
        onChange={(e) => {
          const { name, value } = e.target;
          props.setClient({ ...props.client, [name]: parseInt(value) });
          props.setErrors({ ...props.errors, [name]: "" });
        }}
      />
      <div className="col-span-4 ">
        <span className="col-span-6 w-full text-red-500">
          {props.errors.prefijo}
        </span>
      </div>

      <div className="col-span-4  ">
        <span className="col-span-6 w-full text-red-500">
          {props.errors.telefono}
        </span>
      </div>

      <Label className="col-span-12 p-3 text-xs italic">
        Te enviaremos un código para que puedas abrir tu Locker.
      </Label>
      <Label className="col-span-12 p-3 text-xs italic text-red-500">
        Añade tu codigo de descuento
      </Label>
      <div className="col-12">
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
      <div className="col-span-12">
        <div className="flex items-center space-x-2 py-4">
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
          <br></br>
          <div className="col-span-4 ">
            <span className="col-span-6 w-full text-red-500">
              {props.errors.terms}
            </span>
          </div>
        </div>
        <div className="content-center pt-4">
          <label htmlFor="terms" className="text-sm">
            <strong>¿Necesitas ayuda? Llámanos al +54 9 294 492-7340</strong>
          </label>
        </div>
      </div>
    </div>
  );
}
