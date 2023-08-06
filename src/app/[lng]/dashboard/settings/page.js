"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import {
  GetCommonSettings,
  UpdateCommonSettings,
} from "@/lib/requests/settings";

export default function ({ params: { lng, storeId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const [commonSettings, setCommonSettings] = useState(null);

  useEffect(() => {
    GetCommonSettings()
      .then((data) => {
        setCommonSettings(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const { t } = useTranslation(lng, "common");

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[1000px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between pb-3 pt-2 text-3xl px-2 mb-2 mt-4">
          {t("Common Settings")}
        </div>
        <div className="flex flex-col items-center justify-center w-full p-2 min-h-[100px] my-1 mx-0 rounded-md">
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-xl">{t("Brand name")}</p>
            {commonSettings === null ? (
              <Skeleton height={30} className="mb-2" />
            ) : (
              <input
                placeholder={t("Brand name")}
                type="text"
                className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
                value={commonSettings?.brandName}
                onChange={(e) => {
                  let newCommonSettings = { ...commonSettings };
                  newCommonSettings.brandName = e.target.value;
                  setCommonSettings(newCommonSettings);
                }}
              />
            )}
            <p className="text-xl">{t("Description")}</p>
            {commonSettings === null ? (
              <Skeleton height={30} className="mb-2" />
            ) : (
              <input
                placeholder={t("Description")}
                type="text"
                className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
                value={commonSettings?.brandDescription}
                onChange={(e) => {
                  let newCommonSettings = { ...commonSettings };
                  newCommonSettings.brandDescription = e.target.value;
                  setCommonSettings(newCommonSettings);
                }}
              />
            )}
            <p className="text-xl">{t("Theme")}</p>
            {commonSettings === null ? (
              <Skeleton height={30} className="mb-2" />
            ) : (
              <select
                className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
                value={commonSettings?.theme}
                onChange={(e) => {
                  let newCommonSettings = { ...commonSettings };
                  newCommonSettings.theme = e.target.value;
                  setCommonSettings(newCommonSettings);
                  // Set theme
                  document.documentElement.setAttribute(
                    "data-theme",
                    e.target.value
                  );
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
              </select>
            )}
          </div>
          <div className="flex w-full mt-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!commonSettings?.brandName) {
                  alert(t("Please fill the brand name!"));
                  return;
                }

                UpdateCommonSettings("common", commonSettings)
                  .then((data) => {
                    alert(t("Common settings updated successfully!"));
                    // Save to local storage
                    localStorage.setItem(
                      "commonSettings",
                      JSON.stringify(commonSettings)
                    );
                  })
                  .catch((e) => {
                    console.log(e);
                    alert(t("Could not update common settings"));
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
