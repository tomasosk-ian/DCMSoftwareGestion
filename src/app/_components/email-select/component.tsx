"use client";

import { useState } from "react";
import ButtonCustomComponent from "~/components/buttonCustom";
import { Input } from "~/components/ui/input";
import { Client } from "~/server/api/routers/clients";

export default function SelectEmail(props: {
  email: string;
  setEmail: (email: string) => void;
}) {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="mt-10 flex w-full items-center justify-center">
      <div className="w-full px-4 text-center md:w-1/2 lg:w-1/4">
        <Input
          className="mb-4 w-full rounded border-2 border-buttonPick focus:border-buttonPick"
          placeholder="Inserte el mail con el que realizó la reserva"
          name="email"
          value={email.toLowerCase()}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />
        <ButtonCustomComponent
          onClick={() => {
            if (isValidEmail(email)) {
              props.setEmail(email);
            } else {
              setError("mail inválido");
            }
          }}
          text={`Enviar`}
        />
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
