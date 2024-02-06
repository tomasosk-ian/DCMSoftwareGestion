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
import { City } from "~/server/api/routers/city";
import { Store } from "~/server/api/routers/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
export default function CitySelector(props: {
  cities: City[];
  city: City | null;
  setCity: (city: City) => void;
  setStores: (stores: Store[] | undefined) => void;
}) {
  const router = useRouter();
  if (props.city != null) {
    const stores = api.store.getByCity.useQuery({
      cityId: props.city.identifier,
    });
    props.setStores(stores.data);
  }
  async function handleChange(city: City) {
    try {
      props.setCity(city);
      toast.success("Se ha modificado la ciudad.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  }
  return (
    <main className="flex justify-center p-8">
      {!props.city && (
        <div className="container flex flex-col items-center justify-center gap-12 px-4 ">
          <div className="grid grid-cols-4 gap-4 ">
            {props.cities.map((city) => {
              return (
                <Card
                  className="grid w-[35vh] overflow-hidden shadow-xl"
                  onClick={() => handleChange(city)}
                  key={city.identifier}
                >
                  <CardHeader>
                    <CardTitle> {city.name}</CardTitle>
                    <CardDescription>
                      Seleccione la ciudad donde desea alquilar.
                    </CardDescription>
                  </CardHeader>
                  <img
                    className="aspect-video object-cover"
                    src={city.image ? city.image : "/placeholder.svg"}
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
