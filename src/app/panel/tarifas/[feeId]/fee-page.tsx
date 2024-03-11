"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { asTRPCError } from "~/lib/errors";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Fee } from "~/server/api/routers/fee";
import { Size } from "~/server/api/routers/sizes";

export default async function FeePage(props: { fee: Fee; sizes: Size[] }) {
  const { mutateAsync: renameCoin } = api.fee.change.useMutation();
  const router = useRouter();

  const [description, setDescription] = useState(props.fee.description!);
  const [coin, setCoin] = useState(props.fee.coin!);
  const [size, setSize] = useState(props.fee.size!);
  const [value, setValue] = useState<number>(props.fee.value!);
  const selectedSize = api.size.getById.useQuery({
    sizeId: props.fee.size!,
  });
  async function handleChange() {
    try {
      await renameCoin({
        identifier: props.fee!.identifier,
        description,
        value,
        coin,
        size,
      });
      toast.success("Se ha modificado el tarifa.");
      router.refresh();
    } catch {
      toast.error("Error");
    }
  }

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Modificar tarifa</Title>
          <Button onClick={handleChange}>
            <CheckIcon className="mr-2" />
            Aplicar
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h2 className="text-md">Info. de la tarifa</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Input
                      id="name"
                      placeholder="Descripción"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      id="name"
                      placeholder="Valor"
                      value={value}
                      type="number"
                      onChange={(e) => {
                        const intValue = parseInt(e.target.value);
                        setValue(intValue);
                      }}
                    />
                  </div>

                  <div>
                    <Label className="text-right">Tamaño</Label>
                    <Select
                      onValueChange={(value: string) => {
                        const intValue = parseInt(value);
                        setSize(intValue);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={selectedSize?.data?.nombre} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Seleccione un tamaño</SelectLabel>

                          {props.sizes.map((e) => {
                            return (
                              <SelectItem
                                disabled={e.tarifa != null}
                                key={e.id}
                                value={`${e.id}`}
                              >
                                {e.nombre}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-none">
            <AccordionTrigger>
              <h2 className="text-md">Eliminar tarifa</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end">
                <DeleteStore storeId={props.fee.identifier} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </LayoutContainer>
  );
}

function DeleteStore(props: { storeId: string }) {
  const { mutateAsync: deleteChannel, isLoading } =
    api.fee.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteChannel({ id: props.storeId })
      .then(() => {
        router.push("../");
        toast.success("Se ha eliminado la tarifa");
      })
      .catch((e) => {
        const error = asTRPCError(e)!;
        toast.error(error.message);
      });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar tarifa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que querés eliminar el tarifa?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminar tarifa permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 active:bg-red-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
