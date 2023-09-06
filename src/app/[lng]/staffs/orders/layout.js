"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import XButton from "@/components/buttons/XButton";

export default function Page({ children, params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  const currentPath = usePathname();

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
  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[100px]">
      <div className="w-full max-w-[600px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("Orders")}
          <XButton />
        </div>
        <div className="flex items-center justify-around w-full p-4 min-h-[50px] mx-1 border-b-2">
          <span
            className={
              "w-full text-center m-1 rounded-md hover:bg-gray-200" +
              (currentPath === `/${lng}/staffs/orders/new`
                ? " bg-gray-200"
                : "")
            }
          >
            <Link
              class="block p-2 w-full h-full"
              href={`/${lng}/staffs/orders/new`}
            >
              {t("New")}
            </Link>
          </span>
          <span
            className={
              "w-full text-center m-1 rounded-md hover:bg-gray-200" +
              (currentPath === `/${lng}/staffs/orders/processing`
                ? " bg-gray-200"
                : "")
            }
          >
            <Link
              class="block p-2 w-full h-full"
              href={`/${lng}/staffs/orders/processing`}
            >
              {t("Processing")}
            </Link>
          </span>
          <span
            className={
              "w-full text-center m-1 rounded-md hover:bg-gray-200" +
              (currentPath === `/${lng}/staffs/orders/inactive`
                ? " bg-gray-200"
                : "")
            }
          >
            <Link
              class="block p-2 w-full h-full"
              href={`/${lng}/staffs/orders/inactive`}
            >
              {t("Inactive")}
            </Link>
          </span>
        </div>
        {children}
      </div>
    </main>
  );
}
