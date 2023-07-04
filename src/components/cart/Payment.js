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
    <div className="flex-col">
      <span className="text-xl mb-4">{t("Scan to pay")}</span>
      <img
        src={`${NEXT_PUBLIC_VIETQR_IMAGE}?accountName=${NEXT_PUBLIC_VIETQR_MERCHANT_ACCOUNT_NAME}&amount=1000&addInfo=${NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX}${orderId}`}
        className="w-60 h-auto mb-4"
      />

      <div className="flex justify-around">
        <div className="flex w-5/12 bottom-[90px] md:bottom-[20px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-[#F59191] md:rounded-md clickable">
          <span className="w-full text-center text-l" onClick={handleCancel}>
            {t("Cancel")}
          </span>
        </div>
        <div className="flex w-5/12 bottom-[90px] md:bottom-[20px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-[#A3DE69] md:rounded-md clickable">
          <span
            className="w-full text-center text-l"
            onClick={async () => {
              let result = await handlePay();
              if (result) {
                console.log("result: ", result);
                if (result?.err) {
                  setShowError(true);
                }
              }
            }}
          >
            {t("Complete")}
          </span>
        </div>
      </div>
      <div className="flex">
        <span className="w-full text-l text-red-600 text-center">
          {showError && t("Please pay the exact amount!")}
        </span>
      </div>
    </div>
  );
}
