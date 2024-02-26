import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
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
import { Size } from "~/server/api/routers/sizes";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddFeeDialog } from "../add-fee-dialog";
import { AddCoinDialog } from "../add-coin-dialog";

export default async function Home() {
  // const sizes = await api.size.get.query();
  const fee = await api.fee.get.query();
  const coin = await api.coin.get.query();
  const sizes = await api.size.get.query();
  return (
    <div>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Tarifas</Title>
          <AddFeeDialog coins={coin} sizes={sizes} />
        </div>
        <List>
          {fee.map((fee) => {
            return (
              <ListTile
                href={`/panel/tarifas/${fee.identifier}`}
                title={fee.description}
              />
            );
          })}
        </List>
      </section>
      <hr />
      <br />
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Monedas</Title>
          <AddCoinDialog />
        </div>
        <List>
          {coin.map((coin) => {
            return (
              <ListTile
                href={`/panel/monedas/${coin.identifier}`}
                title={coin.description}
              />
            );
          })}
        </List>
      </section>
    </div>
  );
}
