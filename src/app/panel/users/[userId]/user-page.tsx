"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useEffect, useState } from "react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
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
import { User } from "~/server/api/routers/users";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Role } from "~/server/api/routers/roles";

export default function UserPage({ user }: { user: User }) {
  const [role, setRole] = useState<string>(user!.role!);
  console.log(user);
  const [oldrole] = useState<string>(user!.role!);
  const [adminToOtherRole, setATOR] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: reRolUser, isLoading } = api.user.change.useMutation();
  // const roles = ["admin", "user", "lockersurbanos"];
  const router = useRouter();
  const { data: roles } = api.roles.get.useQuery();

  useEffect(() => {
    if (role !== "admin" && oldrole === "admin") {
      setATOR(true);
    }
    if (role === "admin") {
      setATOR(false);
    }
    console.log(adminToOtherRole);
  }, [role]);
  async function handleChange() {
    try {
      await reRolUser({
        identifier: user!.id,
        role,
      });
      toast.success("Se ha modificado el usuario.");
      router.refresh();
    } catch {
      toast.error("Error");
    }
  }

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Modificar usuario</Title>
          {adminToOtherRole && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={loading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 animate-spin" />
                  ) : (
                    <CheckIcon className="mr-2" />
                  )}
                  Aplicar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Estás seguro que querés cambiar el rol?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Puede perder acceso.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600 active:bg-red-700"
                    onClick={handleChange}
                    disabled={isLoading}
                  >
                    Aceptar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {!adminToOtherRole && (
            <Button disabled={loading} onClick={handleChange}>
              {isLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <CheckIcon className="mr-2" />
              )}
              Aplicar
            </Button>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h2 className="text-md">Info. del usuario</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">{user.name}</Label>{" "}
                  </div>
                  <div>
                    <Label>{user.email}</Label>
                  </div>
                  <div>
                    <Label htmlFor="name" className="py-3">
                      Rol
                    </Label>
                    <Select
                      onValueChange={(value: string) => {
                        setRole(value);
                        console.log(role);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={user.roles[0]?.description} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Seleccione un rol</SelectLabel>

                          {roles?.map((e) => {
                            return (
                              <SelectItem key={e.id} value={e.id}>
                                {e.description}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="col-span-2">
                    <Label htmlFor="description">Imagen</Label>
                    <UploadButton
                      appearance={{
                        button: "btn btn-success w-full",
                        container:
                          "w-max flex-row rounded-md border-cyan-200 px-3 bg-slate-800 text-xs",
                        allowedContent: "text-white text-xs",
                      }}
                      endpoint="imageUploader"
                      onUploadProgress={() => {
                        setLoading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        setLoading(false);
                        setImage(res[0]?.url!);
                        toast.success("Imagen cargada con éxito.");
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div> */}
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-none">
            <AccordionTrigger>
              <h2 className="text-md">Eliminar usuario</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end">
                <DeleteChannel userId={user.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </LayoutContainer>
  );
}

function DeleteChannel(props: { userId: string }) {
  const { mutateAsync: deleteChannel, isLoading } =
    api.user.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteChannel({ id: props.userId }).then(() => {
      toast.success("Se ha eliminado la usuario");
      router.push("../");
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar usuario
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que querés eliminar el usuario?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminar usuario permanentemente.
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
