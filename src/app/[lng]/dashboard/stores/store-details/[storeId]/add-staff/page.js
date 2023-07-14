"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { useSession } from "next-auth/react";

import Rating from "@/components/Rating";
import BackButton from "@/components/buttons/BackButton";

import { GetStore, AddStaff } from "@/lib/requests/stores";

export default function NewStores({ params: { lng, storeId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const [storeData, setstoreData] = useState(null);
  useEffect(() => {
    GetStore(
      storeId,
      (data) => {
        setstoreData(data);
      },
      (e) => {
        console.log(e);
        alert("Could not get stores");
        router.push(`/${lng}/dashboard/stores`);
      }
    );
  }, []);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[1000px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="pb-3 pt-2 border-b-2 border-gray-800">
          <div className="flex w-full bstore-b-2 bstore-gray-800 text-2xl px-2">
            <BackButton href={`/${lng}/dashboard/stores`} />
            {t("Store")}: {storeData?.name}
          </div>
          <div className="flex flex-col items-left w-full pl-[50px] text-sm">
            {storeData?.address} - {storeData?.phone}
          </div>
          <div className="flex flex-row items-left w-full pl-[50px] text-sm">
            <Rating value={storeData?.rating} /> {"  "} {storeData?.rating}/5{" "}
            {t("stars")} - {storeData?.totalRatingTimes || 0} {t("reviews")}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full p-2 min-h-[100px] my-1 mx-0 rounded-md">
          <div className="text-2xl font-bold mt-4 mb-8">{t("Add a Staff")}</div>
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-xl font-bold">{t("Staff email to add")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-xl font-bold">{t("Role")}</p>
            <select
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
              onChange={(e) => {
                setRole(e.target.value);
              }}
              defaultValue={role}
            >
              <option value="staff">{t("Staff")}</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="btn btn-primary mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px] h-[50px] md:rounded-md text-white flex flex-row items-stretch justify-between px-8"
        onClick={() => {
          if (!email) {
            alert("Please fill in all the fields!");
            return;
          }

          // Call API to add staff
          AddStaff(
            storeId,
            email,
            role,
            (data) => {
              router.push(`/${lng}/dashboard/stores/store-details/${storeId}`);
            },
            (e) => {
              console.log(e);
              alert("Could not add staff");
            }
          );
        }}
      >
        <span className="text-2xl">{t("Next")}</span>
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
