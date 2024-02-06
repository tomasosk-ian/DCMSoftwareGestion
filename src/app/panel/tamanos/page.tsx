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

export default async function Home() {
  const sizes = await api.size.get.query();
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b  text-black">
      {sizes.map((size) => {
        return <p>{size.description}</p>;
      })}
    </main>
  );
}
