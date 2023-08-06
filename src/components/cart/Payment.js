"use client";
import { useTranslation } from "@/app/i18n/client";
import { useState } from "react";

const NEXT_PUBLIC_VIETQR_IMAGE = process.env.NEXT_PUBLIC_VIETQR_IMAGE;
const NEXT_PUBLIC_VIETQR_MERCHANT_ACCOUNT_NAME = encodeURIComponent(
  process.env.NEXT_PUBLIC_VIETQR_MERCHANT_ACCOUNT_NAME
);
const NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX = encodeURIComponent(
  process.env.NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX
);

export default function Payment({
  lng,
  handleCancel,
  handlePay,
  orderId,
  orderAmount,
}) {
  const [showError, setShowError] = useState(false);
  const { t } = useTranslation(lng, "common");
  return (
    <div className="flex-col text-center w-[20rem] p-3">
      <p className="text-xl mb-3">{t("Scan to pay")}</p>
      <img
        src={`${NEXT_PUBLIC_VIETQR_IMAGE}?accountName=${NEXT_PUBLIC_VIETQR_MERCHANT_ACCOUNT_NAME}&amount=1000&addInfo=${NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX}${orderId}`}
        className="w-full h-auto mb-5 mx-auto"
      />

      <div className="flex justify-center gap-5">
        <div className="btn btn-cancel flex w-5/12 bottom-[90px] md:bottom-[20px] md:rounded-md clickable">
          <span className="w-full text-center text-l" onClick={handleCancel}>
            {t("Go back")}
          </span>
        </div>
        <div className="btn btn-primary flex w-5/12 bottom-[90px] md:bottom-[20px] border-t-[1px] md:border-[1px] border-gray-600 md:rounded-md clickable p-2 mb-3">
          <span
            className="w-full text-center text-l"
            onClick={async () => {
              let result = await handlePay();
              if (result) {
                console.log("result: ", result);
                if (result?.error) {
                  setShowError(true);
                }
              }
            }}
          >
            {t("Complete")}
          </span>
        </div>
      </div>
      <div className="flex mb-1">
        <span className="w-full text-l text-red-600">
          {showError && t("Please pay the exact amount!")}
        </span>
      </div>
    </div>
  );
}
