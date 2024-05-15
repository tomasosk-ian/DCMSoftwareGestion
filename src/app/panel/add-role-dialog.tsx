"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";

export function AddRoleDialog() {
  const { mutateAsync: createRole, isLoading } = api.roles.create.useMutation();

  const [access, setAccess] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleCreate() {
    try {
      await createRole({
        access,
        description,
      });

      toast.success("Rol creado correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      const error = asTRPCError(e)!;
      toast.error(error.message);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircleIcon className="mr-2" size={20} />
        Crear rol
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo rol</DialogTitle>
            {/* <DialogDescription>
                    
                </DialogDescription> */}
          </DialogHeader>

          <div>
            <Input
              id="Descripcion"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Input
              id="access"
              placeholder="access"
              value={access}
              onChange={(e) => setAccess([...access, e.target.value])}
            />
          </div>
          {/* <div>
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
                // setImage(res.keys.arguments);
                setLoading(false);
                setImage(res[0]!.url);
                toast.success("Se ha subido la imagen.");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div> */}
          <DialogFooter>
            <Button disabled={loading} onClick={handleCreate}>
              {isLoading && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Crear rol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
