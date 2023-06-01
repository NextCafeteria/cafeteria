"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../../i18n/client";
import { useSession } from "next-auth/react";
import XButton from "@/components/buttons/XButton";

export default function NewStores({ params: { lng, itemId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("New Store")}
          <XButton />
        </div>
        <div className="flex flex-col items-center justify-center w-full p-4 min-h-[100px] my-1 mx-1 rounded-md">
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-xl font-bold">{t("Store Name")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
            />
            <p className="text-xl font-bold">{t("Address")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
            />
            <p className="text-xl font-bold">{t("Phone")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
            />
          </div>
        </div>
      </div>

      <div
        className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[100px] h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-[#0398EC] md:rounded-md"
      >
        <span className="text-2xl">+ {t("Create")}</span>
      </div>
    </main>
  )
}
