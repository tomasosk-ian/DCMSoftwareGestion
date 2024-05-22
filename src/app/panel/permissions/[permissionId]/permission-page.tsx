"use client";

import { AxeIcon, CheckIcon, Loader2, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Permission } from "~/server/api/routers/permissions";

export default function PermissionPage({
  permission,
}: {
  permission: Permission;
}) {
  const [access, setAccess] = useState<string>(permission!.access ?? "");
  const [type, setType] = useState<string>(permission!.type);
  const [types, setTypes] = useState(["Ruta", "UX", "Otro"]);

  const [description, setDescription] = useState(permission!.description);
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync: renamePermission, isLoading } =
    api.permissions.change.useMutation();
  const [image, setImage] = useState<string>("");
  const router = useRouter();

  async function handleChange() {
    try {
      await renamePermission({
        id: permission.id!,
        description,
        type,
        access,
      });
      toast.success("Se ha modificado el permiso.");
      router.refresh();
    } catch {
      toast.error("Error");
    }
  }
  function handleAdd() {}

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Modificar permiso</Title>
          <Button
            disabled={
              loading ||
              (type == "Ruta" && (access == "" || !access.startsWith("/")))
            }
            onClick={handleChange}
          >
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
              <h2 className="text-md">Info. del permiso</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-5">
                <div className="flex w-full gap-4 pb-5">
                  <div className="w-1/2">
                    <Label htmlFor="name">Descripción</Label>
                    <Input
                      // className="w-1/2"
                      id="name"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  {/* <div className="w-1/2">
                    <Label htmlFor="name">Descripción</Label>
                    <Input
                      // className="w-1/2"
                      id="name"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div> */}
                </div>
                <div>
                  <div className="flex gap-10">
                    <div className="w-1/2 gap-10 pb-5">
                      <Label>Tipo de rol</Label>
                      <Select
                        onValueChange={(value: string) => {
                          setType(value);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={type ? type : "Seleccione un tipo"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Seleccione un tipo</SelectLabel>

                            {types?.map((e) => {
                              return (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-1/2 gap-4 pb-5">
                      {type == "Ruta" && (
                        <div className="gap-4 p-2">
                          <div>
                            <Label htmlFor="name">Acceso</Label>
                            <Input
                              className="p-2"
                              id="name"
                              value={access}
                              onChange={(e) => setAccess(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                      {type == "UX" && (
                        <div className="gap-4 p-2">
                          <div>
                            <Label htmlFor="name">Código</Label>
                            <Input
                              className="p-2"
                              id="name"
                              value={access}
                              onChange={(e) => setAccess(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-none">
            <AccordionTrigger>
              <h2 className="text-md">Eliminar permiso</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end">
                <DeleteChannel permissionId={permission.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </LayoutContainer>
  );
}

function DeleteChannel(props: { permissionId: string }) {
  const { mutateAsync: deleteChannel, isLoading } =
    api.permissions.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteChannel({ id: props.permissionId }).then(() => {
      toast.success("Se ha eliminado el permiso");
      router.push("../");
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar permiso
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que querés eliminar la permiso?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminar permiso permanentemente.
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
