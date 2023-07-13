"use client";
import React from "react";
import { useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
export default function Page({ children, params: { lng } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-gray-300-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          lng={lng}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
