"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { GetStore, UpdateStore } from "@/lib/requests/stores";
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
        router.push(`/${lng}/dashboard/stores`);
      }
    );
  };

  useEffect(() => {
    refetchStaffs();
  }, []);

  const { t } = useTranslation(lng, "common");

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[1000px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="pb-3 pt-2 border-b-2 border-gray-800">
          <div className="flex w-full bstore-b-2 bstore-gray-800 text-2xl px-2">
            <BackButton href={`/${lng}/dashboard/stores`} />
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
        <div className="text-2xl font-bold mt-4 mb-4">
          {t("Store settings")}
        </div>
        <div className="flex flex-col items-center justify-center w-full p-2 min-h-[100px] my-1 mx-0 rounded-md">
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-xl">{t("Store Name")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={storeData?.name}
              onChange={(e) => {
                let newStoreData = { ...storeData };
                newStoreData.name = e.target.value;
                setstoreData(newStoreData);
              }}
            />
            <p className="text-xl">{t("Address")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={storeData?.address}
              onChange={(e) => {
                let newStoreData = { ...storeData };
                newStoreData.address = e.target.value;
                setstoreData(newStoreData);
              }}
            />
            <p className="text-xl">{t("Phone")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={storeData?.phone}
              onChange={(e) => {
                let newStoreData = { ...storeData };
                newStoreData.phone = e.target.value;
                setstoreData(newStoreData);
              }}
            />
            <div className="flex w-full mt-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!storeData?.name) {
                    alert("Please fill the store name!");
                    return;
                  }
                  UpdateStore(storeId, {
                    name: storeData?.name,
                    address: storeData?.address,
                    phone: storeData?.phone,
                  })
                    .then((data) => {
                      alert("Store updated successfully!");
                    })
                    .catch((e) => {
                      console.log(e);
                      alert("Could not update store");
                    });
                }}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
        <div className="text-2xl font-bold mt-4 mb-4">{t("Staffs")}</div>
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
      <div className="btn btn-primary mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px]">
        <div
          className="h-[50px] bstore-t-[1px] md:bstore-[1px] bstore-gray-600 p-2 text-white md:rounded-md"
          onClick={() => {
            router.push(
              `/${lng}/dashboard/stores/store-details/${storeId}/add-staff`
            );
          }}
        >
          <span className="text-2xl">+ {t("Add Staff")}</span>
        </div>
      </div>
    </main>
  );
}
