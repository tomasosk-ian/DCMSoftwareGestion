"use client";

import LayoutContainer from "~/components/layout-container";
import { api } from "~/trpc/react";

import { PrivateConfigClaves, type PrivateConfigKeys, PublicConfigClaves, type PublicConfigKeys, PublicConfigMetodoPago, type PublicConfigMetodoPagoKeys } from "~/lib/config";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2Icon, PlusCircleIcon, XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

function InsertClavePublica({ invalidate }: { invalidate: () => void }) {
  const [open, setOpen] = useState(false);
  const [clave, setClave] = useState<PublicConfigKeys | "">("");
  const [value, setValue] = useState("");
  const { mutateAsync, isLoading } = api.config.setPublicKeyAdmin.useMutation();

  useEffect(() => {
    if (clave === 'metodo_pago') {
      setValue("");
    }
  }, [clave]);

  useEffect(() => {
    if (open) {
      setClave("");
      setValue("");
    }
  }, [open]);

  async function handle() {
    if (clave === "") {
      return;
    }

    await mutateAsync({
      key: clave,
      value: value
    });

    invalidate();
    setOpen(false);
  }

  return <div className="m-2">
    <Button onClick={() => setOpen(true)} className="rounded-full gap-1 px-4 py-5 text-base text-[#3E3E3E] bg-[#d0d0d0]">
      {isLoading ? (
        <Loader2Icon className="h-4 mr-1 animate-spin" size={20} />
      ) : (
        <PlusCircleIcon className="h-5 mr-1 stroke-1" />
      )}
      Configurar clave pública
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurar clave pública</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="name" className="mb-2">Clave</Label>
            <Select onValueChange={v => setClave(v as PublicConfigKeys)}>
              <SelectTrigger className="font-bold">
                <SelectValue placeholder="Clave" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PublicConfigClaves).map(v => 
                  <SelectItem key={`clave-id-${v}`} value={v}>{PublicConfigClaves[v as PublicConfigKeys]}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="font-bold">
            {clave === 'metodo_pago' && <>
              <Label htmlFor="valor" className="mb-2">Método de pago</Label>
              <Select onValueChange={v => setValue(v as PublicConfigMetodoPagoKeys)}>
              <SelectTrigger className="font-bold">
                <SelectValue placeholder="Método de pago" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PublicConfigMetodoPago).map(v => 
                  <SelectItem key={`mp-id-${v}`} value={v}>{PublicConfigMetodoPago[v as PublicConfigMetodoPagoKeys]}</SelectItem>
                )}
              </SelectContent>
            </Select>
            </>}
            {clave !== 'metodo_pago' && <>
              <Label htmlFor="valor" className="mb-2">Valor</Label>
              <Input
                id="valor"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </>}
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            disabled={isLoading || value === "" || clave === ""}
            onClick={handle}
            className="flex rounded-full w-fit justify-self-center text-[#3E3E3E] bg-[#d0d0d0]"
          >
            {isLoading ? (
              <Loader2Icon className="h-4 mr-1 animate-spin" size={20} />
            ) : (
              <PlusCircleIcon className="h-4 mr-1 stroke-1" />
            )}
            Configurar clave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
}

function InsertClavePrivada({ invalidate }: { invalidate: () => void }) {
  const [open, setOpen] = useState(false);
  const [clave, setClave] = useState<PrivateConfigKeys | "">("");
  const [value, setValue] = useState("");
  const { mutateAsync, isLoading } = api.config.setPrivateKeyAdmin.useMutation();

  useEffect(() => {
    if (open) {
      setClave("");
      setValue("");
    }
  }, [open]);

  async function handle() {
    if (clave === "") {
      return;
    }

    await mutateAsync({
      key: clave,
      value: value
    });

    invalidate();
    setOpen(false);
  }

  return <div className="m-2">
    <Button onClick={() => setOpen(true)} className="rounded-full gap-1 px-4 py-5 text-base text-[#3E3E3E] bg-[#d0d0d0]">
      {isLoading ? (
        <Loader2Icon className="h-4 mr-1 animate-spin" size={20} />
      ) : (
        <PlusCircleIcon className="h-5 mr-1 stroke-1" />
      )}
      Configurar clave privada
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurar clave privada</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="name" className="mb-2">Clave</Label>
            <Select onValueChange={v => setClave(v as PrivateConfigKeys)}>
              <SelectTrigger className="font-bold">
                <SelectValue placeholder="Clave" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PrivateConfigClaves).map(v => 
                  <SelectItem key={`clave-id-${v}`} value={v}>{PrivateConfigClaves[v as PrivateConfigKeys]}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="font-bold">
            <Label htmlFor="brandCode">Valor</Label>
            <Input
              id="valor"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            disabled={isLoading || value === "" || clave === ""}
            onClick={handle}
            className="flex rounded-full w-fit justify-self-center text-[#3E3E3E] bg-[#d0d0d0]"
          >
            {isLoading ? (
              <Loader2Icon className="h-4 mr-1 animate-spin" size={20} />
            ) : (
              <PlusCircleIcon className="h-4 mr-1 stroke-1" />
            )}
            Configurar clave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
}

export default function LockerOcupationPage() {
  // Consulta de datos con fechas seleccionadas
  const { data: timeOut } = api.params.getTimeOut.useQuery();
  const { data: privateConfigs, refetch: refetchPrivate } = api.config.listPrivateAdmin.useQuery();
  const { data: publicConfigs, refetch: refetchPublic } = api.config.listPublicAdmin.useQuery();
  const { mutateAsync: deletePrivateKey } = api.config.deletePrivateKeyAdmin.useMutation();
  const { mutateAsync: deletePublicKey } = api.config.deletePublicKeyAdmin.useMutation();

  async function invalidate() {
    await refetchPrivate();
    await refetchPublic();
  }

  return (
    <LayoutContainer>
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-semibold mb-3"></h2>
        <div className="flex flex-row">
          <InsertClavePublica invalidate={invalidate} />
          <InsertClavePrivada invalidate={invalidate} />
        </div>
      </div>
      <section className="space-y-2">
        <div>(Servidor) TimeOut Mobbex: {timeOut}</div>
        {(privateConfigs ?? []).map(v => <div key={`pc-${v.key}`}>
          <Button onClick={async () => {
            await deletePrivateKey({ key: v.key as PrivateConfigKeys });
            await invalidate();
          }}><XIcon /></Button> (Configuración privada) {PrivateConfigClaves[v.key as PrivateConfigKeys]}: {v.value}
        </div>)}
        {(publicConfigs ?? []).map(v => <div key={`pc-${v.key}`}>
          <Button onClick={async () => {
            await deletePublicKey({ key: v.key as PublicConfigKeys });
            await invalidate();
          }}><XIcon /></Button> (Configuración pública) {PublicConfigClaves[v.key as PublicConfigKeys]}: {v.value}
        </div>)}
      </section>
    </LayoutContainer>
  );
}
