"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import DefaultImage from "@public/default.png";
import Link from "next/link";

export default function Page({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex flex-col justify-center p-2 pb-[100px] w-full max-w-[600px] md:w-[600px] mx-auto relative">
      <div className="block w-full justify-centerpb-3 pt-2 text-2xl px-2 mb-2">
        <div className="float-right">
          <a href="/vi" className="text-sm">
            <span className={lng === "vi" ? " font-bold" : ""}>VI</span>
          </a>
          <span className="text-sm"> | </span>
          <a href="/en" className="text-sm">
            <span className={lng === "en" ? " font-bold" : ""}>EN</span>
          </a>
        </div>
      </div>
      <div className="min-h-20 p-2 mt-4 border-b-2 border-gray-800 relative mb-8">
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
            <p className="text-left text-gray-800 font-bold text-2xl">
              {session?.status === "authenticated"
                ? session.data.user.name
                : t("Loading...")}
            </p>
            <p className="text-left text-gray-800">
              {session?.status === "authenticated"
                ? session.data.user.email
                : "user@example.com"}
            </p>
          </div>
        </div>
      </div>
      <div className="min-h-20 p-4 border-b-2 text-xl hover:bg-gray-200">
        <Link href={`/${lng}`}>{t("Browse products")}</Link>
      </div>
      <div className="min-h-20 p-4 border-b-2 text-xl hover:bg-gray-200">
        <Link href={`/${lng}/orders`}>{t("My orders")}</Link>
      </div>
      <div className="min-h-20 p-4 border-b-2 text-xl hover:bg-gray-200">
        <Link href={`/${lng}/cart`}>{t("Cart")}</Link>
      </div>
      <div className="min-h-20 p-4 border-b-2 text-xl hover:bg-gray-200">
        <Link
          href="https://github.com/vietanhdev/cafeteria/issues"
          target="_blank"
        >
          {t("Support & Bug report")}
        </Link>
      </div>
      <button
        className="bottom-0 absolute w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded mt-4"
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
