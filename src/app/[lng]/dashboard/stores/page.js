"use client";
import { useTranslation } from "@/app/i18n/client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useGetStores } from "@/lib/requests/stores";
import StoreCard from "@/components/stores/StoreCard";

export default function StoreManagement({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    console.log("Not logged in.");
    router.push(`/${lng}/login`);
  }

  const { stores, error, isLoading } = useGetStores();
  if (error) {
    console.log(e);
    alert("Could not get the stores.");
  }

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[1000px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between pb-3 pt-2 text-3xl px-2 mb-2 mt-4">
          {t("Stores")}
        </div>
        {isLoading ? (
          Array.from({ length: 3 }, (e, i) => i).map((i) => (
            <StoreCard
              key={i}
              order={null}
              orderId={i}
              lng={lng}
              isLoading={true}
            />
          ))
        ) : stores && stores.length > 0 ? (
          stores.map(
            (params, key) => (
              (params.lng = lng), (<StoreCard key={key} {...params} />)
            )
          )
        ) : (
          <p className="text-sm">
            {t("Add a store by clicking the button below.")}
          </p>
        )}
      </div>
      <div
        className="btn btn-primary mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px] h-[50px] md:rounded-md"
        onClick={() => {
          router.push(`/${lng}/dashboard/stores/new-store`);
        }}
      >
        <span className="text-2xl">+ {t("Add store")}</span>
      </div>
    </main>
  );
}
