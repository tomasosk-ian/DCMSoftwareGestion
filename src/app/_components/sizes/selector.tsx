"use client";
import { useState } from "react";
import { RouterOutputs } from "~/trpc/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Size } from "~/server/api/routers/sizes";
export default function SizeSelector(props: {
  sizes: Size[] | undefined;
  size: Size | null;
  setSize: (size: Size) => void;
}) {
  return (
    <main className="flex justify-center">
      {!props.size && (
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <div className="grid grid-cols-4 gap-4 ">
            {props.sizes?.map((size) => {
              return (
                <Card
                  className="grid w-[35vh] overflow-hidden shadow-xl"
                  onClick={() => props.setSize(size)}
                  key={size.id}
                >
                  <CardHeader>
                    <CardTitle> {size.nombre}</CardTitle>
                    <CardDescription>
                      Seleccione el tamaño de su locker.
                    </CardDescription>
                  </CardHeader>
                  <img
                    className="aspect-video object-cover"
                    src="/placeholder.svg"
                  ></img>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
