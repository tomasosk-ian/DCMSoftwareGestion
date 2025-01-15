import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { api } from "~/trpc/server";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

export default async function Home() {
  const cupones = await api.cupones.get.query();
  const router = useRouter();
  return (
    <section className="space-y-2">
      <div className="flex justify-between">
        <Title>Cupones</Title>
        <Button onClick={() => router.push("/panel/cupones/create")}>
          <PlusCircleIcon className="mr-2" size={20} />
          Crear cupón
        </Button>{" "}
      </div>
      <List>
        {}
        {cupones &&
          cupones.map((cupon) => {
            return (
              <ListTile
                href={`/panel/cupones/${cupon.identifier}`}
                title={cupon.codigo}
              />
            );
          })}
      </List>
    </section>
  );
}
