import { api } from "~/trpc/server";
import React from "react";
import { Title } from "~/components/title";
import UserPage from "./user-page";

export default async function User(props: { params: { userId: string } }) {
  const user = await api.user.getById.query({
    userId: props.params.userId,
  });
  if (!user) {
    return <Title>No se encontró el canal</Title>;
  }

  return <UserPage user={user} />;
}
