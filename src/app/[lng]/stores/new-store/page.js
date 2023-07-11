"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { useSession } from "next-auth/react";
import XButton from "@/components/buttons/XButton";

import { CreateStore } from "@/lib/requests/stores";

export default function NewStores({ params: { lng, itemId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("New Store")}
          <XButton />
        </div>
        <div className="flex flex-col items-center justify-center w-full p-2 min-h-[100px] my-1 mx-0 rounded-md">
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-xl font-bold">{t("Store Name")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <p className="text-xl font-bold">{t("Address")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <p className="text-xl font-bold">{t("Phone")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="btn btn-primary mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px] h-[50px] p-2 md:rounded-md flex flex-row items-stretch justify-between px-8"
        onClick={() => {
          if (!name || !address || !phone) {
            alert("Please fill in all the fields!");
            return;
          }

          CreateStore(
            { name, address, phone },
            (store) => {
              router.push(`/${lng}/stores`);
            },
            (e) => {
              console.log(e);
              alert("Could not create store! Please try again.");
            },
          );
        }}
      >
        <span className="text-2xl">{t("Create")}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </div>
    </main>
  );
}
