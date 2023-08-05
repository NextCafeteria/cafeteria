"use client";

import { useEffect, useState } from "react";

import CardOne from "@/components/dashboard/CardOne.tsx";
import CardTwo from "@/components/dashboard/CardTwo.tsx";
import CardThree from "@/components/dashboard/CardThree.tsx";
import CardFour from "@/components/dashboard/CardFour.tsx";
import ChartOne from "@/components/dashboard/ChartOne.tsx";
import ChartTwo from "@/components/dashboard/ChartTwo.tsx";

import { GetRevenueInfo } from "@/lib/requests/dashboard";
import React from "react";

export default function Page() {
  const [revenueInfo, setRevenueInfo] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    async function getRevenueInfo() {
      const data = await GetRevenueInfo();
      setRevenueInfo(data.data);
    }
    getRevenueInfo();
  }, []);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne totalRevenue={revenueInfo.totalRevenue} />
        <CardTwo totalCustomer={revenueInfo.totalCustomers} />
        <CardThree />
        <CardFour />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
      </div>
    </div>
  );
}
