"use client";
import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import DefaultImage from "@public/default.png";
import Link from "next/link";
import LangSelector from "@/components/LangSelector";
import { UpdateAccount } from "@/lib/requests/account";

export default function Page({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }
  const [nameEditing, setNameEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  function handleAccountUpdate() {
    setIsUpdating(true);
    const name = document.getElementById("update-account-name").value;
    UpdateAccount(
      name,
      (data) => {
        setNameEditing(false);
        setIsUpdating(false);
        session.data.user.name = data.user.name;
      },
      (error) => {
        console.log(error);
        setNameEditing(false);
        setIsUpdating(false);
      }
    );
  }
  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex flex-col justify-center p-2 pb-[200px] w-full max-w-[600px] md:w-[600px] mx-auto relative">
      <div className="block w-full justify-centerpb-3 pt-2 text-2xl px-2 mb-2">
        <div className="float-right">
          <LangSelector />
        </div>
      </div>
      <div className="min-h-20 p-4 mt-4 border-b-2 border-gray-800 relative mb-8">
        <div className="flex flex-row">
          <Image
            alt={
              session?.status === "authenticated"
                ? session.data.user.name
                : t("Loading...")
            }
            src={
              session?.status === "authenticated"
                ? session?.data?.user?.image
                : DefaultImage
            }
            width={100}
            height={100}
            className="overflow-hidden rounded-full shadow-md w-[75px] h-[75px]"
          />
          <div className="p-4">
            <div className="text-left">
              {session?.status === "authenticated" ? (
                !nameEditing ? (
                  <>
                    <span className="text-gray-800 font-bold text-2xl">
                      {session.data.user.name}
                    </span>
                    <button
                      className="float-right ml-2"
                      onClick={() => {
                        setNameEditing(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <input
                      id="update-account-name"
                      type="text"
                      className="text-gray-800 font-bold text-xl bg-gray-50 border border-gray-300  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={session.data.user.name}
                      required
                      readOnly={isUpdating}
                    />
                    {isUpdating ? (
                      <button
                        type="submit"
                        className="ml-1 inline-flex items-center py-2 px-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {t("Updating...")}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="ml-1 inline-flex items-center py-2 px-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => {
                          handleAccountUpdate();
                        }}
                      >
                        {t("Save")}
                      </button>
                    )}
                  </div>
                )
              ) : (
                t("Loading...")
              )}
            </div>
            <div className="text-left text-gray-800">
              {session?.status === "authenticated"
                ? session.data.user.email
                : "user@example.com"}
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-20 p-4 border-b-2 text-md hover:bg-gray-200">
        <Link href={`/${lng}`}>{t("Browse products")}</Link>
      </div>
      <div className="min-h-20 p-4 border-b-2 text-md hover:bg-gray-200">
        <Link href={`/${lng}/orders`}>{t("My orders")}</Link>
      </div>
      <div className="min-h-20 p-4 border-b-2 text-md hover:bg-gray-200">
        <Link href={`/${lng}/cart`}>{t("Cart")}</Link>
      </div>
      {session?.data?.user?.isStaff && (
        <div className="min-h-20 p-4 border-b-2 text-md hover:bg-gray-200">
          <Link href={`/${lng}/staffs/orders`}>
            {t("Manage orders (Staff Only)")}
          </Link>
        </div>
      )}
      <div className="min-h-20 p-4 border-b-2 text-md hover:bg-gray-200">
        <Link
          href="https://github.com/vietanhdev/cafeteria/issues"
          target="_blank"
        >
          {t("Support & Bug report")}
        </Link>
      </div>
      <button
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded mt-4"
        onClick={() => {
          signOut().then(() => {
            router.push(`/${lng}/login`);
          });
        }}
      >
        {t("Sign out")}
      </button>
    </main>
  );
}
