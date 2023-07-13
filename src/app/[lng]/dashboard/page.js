"use client";
import React from "react";
import CardFour from "@/components/dashboard/CardFour.tsx";
import CardOne from "@/components/dashboard/CardOne.tsx";
import CardThree from "@/components/dashboard/CardThree.tsx";
import CardTwo from "@/components/dashboard/CardTwo.tsx";
import ChartOne from "@/components/dashboard/ChartOne.tsx";
import ChartThree from "@/components/dashboard/ChartThree.tsx";
import ChartTwo from "@/components/dashboard/ChartTwo.tsx";

export default function Page() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </div>
  );
}
