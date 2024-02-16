"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import AppSidenav from "~/components/app-sidenav";
import AppLayout from "~/components/applayout";
import LayoutContainer from "~/components/layout-container";
import { List, ListTile } from "~/components/list";
import { NavUserData } from "~/components/nav-user-section";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
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
import { City } from "~/server/api/routers/city";
import { toast } from "sonner";
import { UploadButton } from "~/utils/uploadthing";
import { Store } from "~/server/api/routers/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Locker } from "~/server/api/routers/lockers";

export default function StorePage(props: {
  store: Store;
  cities: City[];
  lockers: Locker[];
}) {
  const [name, setName] = useState(props.store.name);
  const [cityId, setCity] = useState(props.store.cityId!);
  const [serieLocker, setSerieLocker] = useState(props.store.serieLocker);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: renameStore, isLoading } =
    api.store.change.useMutation();
  const [image, setImage] = useState<string>("");
  const router = useRouter();

  async function handleChange() {
    try {
      await renameStore({
        identifier: props.store!.identifier,
        name,
        image,
        cityId,
        serieLocker,
      });
      toast.success("Se ha modificado el local.");
      router.refresh();
    } catch {
      toast.error("Error");
    }
  }

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Modificar local</Title>
          <Button disabled={isLoading} onClick={handleChange}>
            {isLoading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <CheckIcon className="mr-2" />
            )}
            Aplicar
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h2 className="text-md">Info. del local</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-right">Ciudad</Label>
                    <Select
                      onValueChange={(value: string) => {
                        setCity(value);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={props.store.city?.name} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Ciudades</SelectLabel>
                          {props.cities.map((e) => {
                            return (
                              <SelectItem
                                key={e.identifier}
                                value={e.identifier}
                              >
                                {e.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-right">Locker</Label>
                    <Select
                      onValueChange={(value: string) => {
                        setSerieLocker(value);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={props.store.serieLocker} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Lockers</SelectLabel>
                          {props.lockers.map((e) => {
                            return (
                              <SelectItem key={e.id} value={e.nroSerieLocker}>
                                {e.nroSerieLocker}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Imagen</Label>
                    <UploadButton
                      appearance={{
                        button: "btn btn-success ",
                        container:
                          "w-max flex-row rounded-md border-cyan-300 px-3 bg-slate-800 text-xs",
                        allowedContent: "text-white text-xs",
                      }}
                      endpoint="imageUploader"
                      onUploadProgress={() => {
                        setLoading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Files: ", res[0]?.url);
                        // setImage(res.keys.arguments);
                        setLoading(false);
                        setImage(res[0]!.url);
                        toast.success("Imagen cargada con éxito.");
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-none">
            <AccordionTrigger>
              <h2 className="text-md">Eliminar local</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end">
                <DeleteStore storeId={props.store.identifier} />
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
    api.store.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteChannel({ id: props.storeId })
      .then(() => {
        toast.success("Se ha eliminado la ciudad");
        router.push("../");
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
          Eliminar local
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que querés eliminar el local?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminar local permanentemente.
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
