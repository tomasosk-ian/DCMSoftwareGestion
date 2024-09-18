"use client";

import { Title } from "@radix-ui/react-toast";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Store } from "~/server/api/routers/store";

export default function StoreSelector(props: {
  stores: Store[] | undefined;
  store: Store | null;
  setStore: (store: Store) => void;
}) {
  if (!props.stores || props.stores.length === 0) {
    return <Title>No hay locales disponibles.</Title>;
  } else {
    return (
      <main className="flex justify-center sm:p-4 md:p-6 lg:p-8">
        {!props.store && (
          <div className="container flex flex-col items-center justify-center gap-4 sm:gap-6">
            <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl">
              Selecciona tu local favorito.
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {props.stores.map((store) => {
                const key =
                  store.identifier ?? store.identifier ?? Math.random();
                return (
                  <Card
                    className="w-full max-w-xs cursor-pointer overflow-hidden p-0 shadow-xl"
                    onClick={() => {
                      props.setStore(store);
                    }}
                    key={store.identifier}
                  >
                    <CardHeader className="p-2">
                      <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl">
                        {store.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {store.address}
                        <br />
                        {store.description}
                      </CardDescription>
                    </CardHeader>
                    <img
                      className="aspect-video w-full object-cover"
                      src={store.image ? store.image : "/placeholder.svg"}
                      alt={`Image of ${store.name}`}
                    />
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
