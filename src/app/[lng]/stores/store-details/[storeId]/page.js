"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { GetStore } from "@/lib/requests/stores";
import { useSession } from "next-auth/react";
import Rating from "@/components/RatingWithNumbers";
import BackButton from "@/components/buttons/BackButton";
import StaffCard from "@/components/stores/StaffCard";

export default function ({ params: { lng, storeId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const [storeData, setstoreData] = useState(null);

  const refetchStaffs = () => {
    GetStore(
      storeId,
      (data) => {
        setstoreData(data);
      },
      (e) => {
        console.log(e);
        alert("Could not get stores");
        router.push(`/${lng}/stores`);
      }
    );
  };

  useEffect(() => {
    refetchStaffs();
  }, []);

  const { t } = useTranslation(lng, "common");

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="pb-3 pt-2 border-b-2 border-gray-800">
          <div className="flex w-full bstore-b-2 bstore-gray-800 text-2xl px-2">
            <BackButton href={`/${lng}/stores`} />
            {t("Store")}: {storeData?.name}
          </div>
          <div className="flex flex-col items-left pl-[50px] w-full text-sm mb-2">
            {storeData?.address} {storeData?.phone && " - "} {storeData?.phone}
          </div>
          <div className="flex flex-row items-left pl-[50px] w-full text-sm">
            <Rating
              lng={lng}
              totalRatingStars={storeData?.totalRatingStars}
              totalRatingTimes={storeData?.totalRatingTimes}
            />
          </div>
        </div>
        <div className="text-xl font-bold mt-4 mb-4">{t("Staffs")}</div>
        {storeData?.staffs?.map((staff, id) => (
          <StaffCard
            key={id}
            {...staff}
            lng={lng}
            storeId={storeId}
            refetchList={refetchStaffs}
          />
        ))}
        {!storeData?.staffs?.length && (
          <p className="text-sm">
            {t("Add a staff by clicking the button below.")}
          </p>
        )}
      </div>
      <div className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[20px]">
        <div
          className="h-[50px] bstore-t-[1px] md:bstore-[1px] bstore-gray-600 p-2 bg-green-600 text-white md:rounded-md"
          onClick={() => {
            router.push(`/${lng}/stores/store-details/${storeId}/add-staff`);
          }}
        >
          <span className="text-2xl">+ {t("Add Staff")}</span>
        </div>
      </div>
    </main>
  );
}
