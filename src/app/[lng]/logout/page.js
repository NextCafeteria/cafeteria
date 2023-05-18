"use client";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  signOut();
  redirect(`/en`);

  return <></>;
}
