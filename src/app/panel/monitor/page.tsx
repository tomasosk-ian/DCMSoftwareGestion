import { Title } from "~/components/title";
import { Locker } from "~/server/api/routers/lockers";
import { api } from "~/trpc/server";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import BoxContent from "~/components/box-content";
import { BriefcaseIcon, Power, Zap, ZapOff } from "lucide-react";

export default async function Home() {
  const lockers = await api.locker.get.query();
  const store = await api.store.get.query();
  const reservas = await api.reserve.list.query();

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {Array.isArray(lockers) &&
                lockers.map((x, index) => (
                  <CarouselItem key={index}>
                    <div className="">
                      <Card>
                        <CardTitle>
                          <div className="flex justify-between p-3">
                            <div className="flex gap-4">
                              <div>Locker: {x.nroSerieLocker}</div>
                              <div>
                                {x.status == "connected" ? (
                                  <Zap size={18} color="green" />
                                ) : (
                                  <ZapOff size={18} color="red" />
                                )}
                              </div>
                            </div>
                            {store.find(
                              (s) => s.serieLocker == x.nroSerieLocker,
                            ) ? (
                              <div>
                                Local:{" "}
                                {
                                  store.find(
                                    (s) => s.serieLocker == x.nroSerieLocker,
                                  )?.name
                                }{" "}
                              </div>
                            ) : (
                              <div className="text-xs text-red-400">
                                No hay local asignado
                              </div>
                            )}
                          </div>
                        </CardTitle>

                        <BoxContent locker={x!} reservas={reservas} />
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* <div className="w-full">
          <Carousel className="max-w-xs">
            <CarouselContent>
              {Array.isArray(lockers) &&
                lockers.map((x, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold">
                            {index + 1}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div> */}
      </div>
    </section>
  );
}
