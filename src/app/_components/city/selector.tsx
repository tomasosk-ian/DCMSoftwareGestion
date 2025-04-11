"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { City } from "~/server/api/routers/city";
import type { Store } from "~/server/api/routers/store";
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
    <main className="flex justify-center ">
      {!props.city && (
        <div className="container flex flex-col items-center justify-center gap-6 ">
          <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl">
            ¿Dónde quieres reservar tu locker?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {props.cities.length === 0 && <div className="col-span-full text-center">No hay ciudades disponibles.</div>}
            {props.cities.map((city) => {
              return (
                <div key={"div-" + city.identifier} className="px-5 pb-5">
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
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
