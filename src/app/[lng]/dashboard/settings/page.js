"use client";

import {
  useGetCommonSettings,
  UpdateCommonSettings,
} from "@/lib/requests/settings";

import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/app/i18n/client";
import { toast } from "react-toastify";
export default function ({ params: { lng, storeId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const {
    data: commonSettings,
    error,
    mutateSettings,
  } = useGetCommonSettings();
  if (error) {
    console.log(error);
  }

  const { t } = useTranslation(lng, "common");

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between pb-3 pt-2 text-3xl px-2 mb-2 mt-4">
          {t("Common Settings")}
        </div>
        <div className="flex flex-col items-center justify-center w-full p-2 min-h-[100px] my-1 mx-0 rounded-md">
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-md">{t("Brand name")}</p>
            {commonSettings === null ? (
              <Skeleton height={30} className="mb-2" />
            ) : (
              <input
                placeholder={t("Brand name")}
                type="text"
                className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2 input"
                value={commonSettings?.brandName}
                onChange={(e) => {
                  let newCommonSettings = { ...commonSettings };
                  newCommonSettings.brandName = e.target.value;
                  mutateSettings(newCommonSettings, { revalidate: false });
                }}
              />
            )}
            <p className="text-md">{t("Description")}</p>
            {commonSettings === null ? (
              <Skeleton height={30} className="mb-2" />
            ) : (
              <input
                placeholder={t("Description")}
                type="text"
                className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2 input"
                value={commonSettings?.brandDescription}
                onChange={(e) => {
                  let newCommonSettings = { ...commonSettings };
                  newCommonSettings.brandDescription = e.target.value;
                  mutateSettings(newCommonSettings, { revalidate: false });
                }}
              />
            )}
            <p className="text-md">{t("Theme")}</p>
            {commonSettings === null ? (
              <Skeleton height={30} className="mb-2" />
            ) : (
              <select
                className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2 input"
                value={commonSettings?.theme}
                onChange={(e) => {
                  let newCommonSettings = { ...commonSettings };
                  newCommonSettings.theme = e.target.value;
                  mutateSettings(newCommonSettings, { revalidate: false });
                }}
              >
                <option value="cupcake">
                  <span role="img" aria-label="cupcake">
                    🧁
                  </span>{" "}
                  Cupcake
                </option>
                <option value="light">
                  <span role="img" aria-label="light">
                    💡
                  </span>{" "}
                  Light
                </option>
                <option value="valentine">
                  <span role="img" aria-label="valentine">
                    💖
                  </span>{" "}
                  Valentine
                </option>
                <option value="fantasy">
                  <span role="img" aria-label="fantasy">
                    🧚‍♀️
                  </span>{" "}
                  Fantasy
                </option>
                <option value="retro">
                  <span role="img" aria-label="retro">
                    ⌛
                  </span>{" "}
                  Retro
                </option>
              </select>
            )}
            <div className="flex w-full justify-between pb-3 pt-2 text-xl mb-2 mt-4">
              {t("Currency Settings")}
            </div>
            {commonSettings === null ? (
              <Skeleton height={30} className="mb-2" />
            ) : (
              <div className="relative">
                <div className="w-[100px]">{t("Prefix")} </div>
                <input
                  placeholder={t("Currency Prefix")}
                  type="text"
                  className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2 input"
                  value={commonSettings?.currencyPrefix}
                  onChange={(e) => {
                    let newCommonSettings = { ...commonSettings };
                    newCommonSettings.currencyPrefix = e.target.value;
                    mutateSettings(newCommonSettings, { revalidate: false });
                  }}
                />
                <div>{t("Suffix")} </div>
                <input
                  placeholder={t("Currency Suffix")}
                  type="text"
                  className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2 input"
                  value={commonSettings?.currencySuffix}
                  onChange={(e) => {
                    let newCommonSettings = { ...commonSettings };
                    newCommonSettings.currencySuffix = e.target.value;
                    mutateSettings(newCommonSettings, { revalidate: false });
                  }}
                />
                <div>{t("Decimal")} </div>
                <input
                  placeholder={t("Currency Decimal")}
                  type="number"
                  min={0}
                  max={2}
                  className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2 input"
                  value={commonSettings?.currencyDecimal || 0}
                  onChange={(e) => {
                    let newCommonSettings = { ...commonSettings };
                    newCommonSettings.currencyDecimal = e.target.value;
                    mutateSettings(newCommonSettings, { revalidate: false });
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex w-full mt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!commonSettings?.brandName) {
                  toast.error(t("Please fill the brand name!"));
                  return;
                }

                UpdateCommonSettings("common", commonSettings)
                  .then((data) => {
                    toast.success(t("Common settings updated successfully!"));
                    // Save to local storage
                    localStorage.setItem(
                      "commonSettings",
                      JSON.stringify(commonSettings)
                    );
                  })
                  .catch((e) => {
                    console.log(e);
                    toast.error(t("Could not update common settings"));
                  });
              }}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
