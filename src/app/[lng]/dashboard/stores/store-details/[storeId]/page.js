"use client";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { useGetStore, UpdateStore, DeleteStore } from "@/lib/requests/stores";
import { useSession } from "next-auth/react";
import Rating from "@/components/RatingWithNumbers";
import BackButton from "@/components/buttons/BackButton";
import StaffCard from "@/components/stores/StaffCard";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function ({ params: { lng, storeId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const { store, error, isLoading, mutateStore } = useGetStore(storeId);
  function setStore(store) {
    mutateStore(store, { revalidate: false });
  }
  if (error) {
    console.log(error);
    toast.error("Could not get store");
    router.push(`/${lng}/dashboard/stores`);
  }

  const { t } = useTranslation(lng, "common");

  const modalRef = useRef();
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[1000px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="pb-3 pt-2 border-b-2 border-gray-800">
          <div className="flex w-full bstore-b-2 bstore-gray-800 text-2xl px-2">
            <BackButton href={`/${lng}/dashboard/stores`} />
            {t("Store")}: {store?.name}
          </div>
          <div className="flex flex-col items-left pl-[50px] w-full text-sm mb-2">
            {store?.address} {store?.phone && " - "} {store?.phone}
          </div>
          <div className="flex flex-row items-left pl-[50px] w-full text-sm">
            <Rating
              lng={lng}
              totalRatingStars={store?.totalRatingStars}
              totalRatingTimes={store?.totalRatingTimes}
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
              value={store?.name}
              onChange={(e) => {
                setStore({
                  ...store,
                  name: e.target.value,
                });
              }}
            />
            <p className="text-xl">{t("Address")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={store?.address}
              onChange={(e) => {
                setStore({
                  ...store,
                  address: e.target.value,
                });
              }}
            />
            <p className="text-xl">{t("Phone")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={store?.phone}
              onChange={(e) => {
                setStore({
                  ...store,
                  phone: e.target.value,
                });
              }}
            />
            <div className="flex w-full mt-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!store?.name) {
                    toast.error("Please fill the store name!");
                    return;
                  }
                  UpdateStore(storeId, {
                    name: store?.name,
                    address: store?.address,
                    phone: store?.phone,
                  })
                    .then((data) => {
                      toast.success("Store updated successfully!");
                    })
                    .catch((e) => {
                      console.log(e);
                      toast.error("Could not update store");
                    });
                }}
              >
                {t("Save")}
              </button>
              <button
                className="btn bg-red-500 text-white ml-2"
                onClick={() => {
                  modalRef.current.showModal();
                }}
              >
                {t("Delete store")}
              </button>
            </div>
          </div>
        </div>
        <div className="text-2xl font-bold mt-4 mb-4">{t("Staffs")}</div>
        {store?.staffs?.map((staff, id) => (
          <StaffCard
            key={id}
            {...staff}
            lng={lng}
            storeId={storeId}
            refetchList={mutateStore}
          />
        ))}
        {!store?.staffs?.length && (
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
      <ConfirmModal
        lng={lng}
        title={"Confirm Delete"}
        msg={
          "Are you sure you want to delete this store? This action cannot be undone."
        }
        handleConfirm={() => {
          DeleteStore(storeId)
            .then((data) => {
              toast.success("Store deleted successfully!");
              router.push(`/${lng}/dashboard/stores`);
            })
            .catch((e) => {
              console.log(e);
              toast.error("Could not delete store");
            });
        }}
        modalRef={modalRef}
      />
    </main>
  );
}
