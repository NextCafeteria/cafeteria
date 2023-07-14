"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Page({ children, params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    console.log("Not logged in.");
    router.push(`/${lng}/login`);
  }
  if (
    session &&
    session.status === "authenticated" &&
    !session?.data?.user?.isAdmin
  ) {
    console.log(session?.data?.user);
    router.push(`/${lng}`);
  }

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
