"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Card } from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadButton } from "~/utils/uploadthing";
import { Size } from "~/server/api/routers/sizes";
import { Reserves } from "~/server/api/routers/reserves";
import { Badge } from "~/components/ui/badge";

export default function ReservePage(props: { reserve: Reserves; size: Size }) {
  const [tamaño, setTamaño] = useState(props.size);
  const [token, setToken] = useState(props.reserve.Token1);
  const [fechaCreacion, setCreacion] = useState(props.reserve.FechaCreacion);
  const [fechaFin, setFin] = useState(props.reserve.FechaFin);
  const [fechaInicio, setInicio] = useState(props.reserve.FechaInicio);
  const [idTransaction, setIdTransaction] = useState(
    props.reserve.IdTransaction,
  );

  const router = useRouter();

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h2 className="text-md">Info. de la reserva</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="Locker">Locker</Label>
                    <Input
                      id="Locker"
                      value={props.reserve.NroSerie!}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label htmlFor="Tamaño">Tamaño</Label>
                    <Input id="Tamaño" value={tamaño.nombre!} disabled={true} />
                  </div>
                  <div>
                    <Label htmlFor="Token">Token</Label>
                    <Input id="Token" value={token!} disabled={true} />
                  </div>
                  <div>
                    <Label htmlFor="creacion">Fecha de creación</Label>
                    <Input
                      id="creacion"
                      value={fechaCreacion!}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inicio">Fecha de inicio</Label>
                    <Input id="inicio" value={fechaInicio!} disabled={true} />
                  </div>
                  <div>
                    <Label htmlFor="fin">Fecha de fin</Label>
                    <Input id="fin" value={fechaFin!} disabled={true} />
                  </div>
                  <div>
                    <Label htmlFor="transaccion">Id. de la transacción</Label>
                    <Input
                      id="transaccion"
                      value={idTransaction!}
                      disabled={true}
                    />
                  </div>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </LayoutContainer>
  );
}

function DeleteChannel(props: { reserveId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={true}>
        <Button variant="destructive" className="w-[160px]">
          Eliminar reserva
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que querés eliminar la reserva?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminar reserva permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 active:bg-red-700"
            // onClick={handleDelete}
            // disabled={isLoading}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
