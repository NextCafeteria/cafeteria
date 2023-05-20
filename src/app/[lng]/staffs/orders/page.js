"use client";
import { redirect } from "next/navigation";

export default function StaffsOrders({ params: { lng } }) {
  redirect(`/${lng}/staffs/orders/new`);
}
