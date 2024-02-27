"use client";

import { Title } from "@radix-ui/react-toast";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Store } from "~/server/api/routers/store";

export default function storeSelector(props: {
  stores: Store[] | undefined;
  store: Store | null;
  setStore: (store: Store) => void;
}) {
  if (props.stores?.length == 0) {
    return <Title>No hay locales disponibles.</Title>;
  } else {
    return (
      <main className="flex justify-center">
        {!props.store && (
          <div className="container flex flex-col items-center justify-center gap-6 ">
            <h2 className="text-3xl font-semibold">
              Selecciona tu local favorito.
            </h2>
            <div className="grid grid-cols-4 gap-4 ">
              {props.stores?.map((store) => {
                return (
                  <Card
                    className="grid w-[35vh] overflow-hidden shadow-xl"
                    onClick={() => {
                      props.setStore(store);
                    }}
                    key={store.identifier}
                  >
                    <CardHeader>
                      <CardTitle> {store.name}</CardTitle>
                      <CardDescription>
                        Seleccione local preferido.
                      </CardDescription>
                    </CardHeader>
                    <img
                      className="aspect-video object-cover"
                      src={store.image ? store.image : "/placeholder.svg"}
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
}
