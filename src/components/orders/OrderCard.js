import { useTranslation } from "@/app/i18n/client";
import {
  ORDER_STATUS_TO_BG_COLOR,
  ORDER_STATUS_TO_TEXT,
} from "@/lib/order_status";
import Link from "next/link";
import { countItemsByName, countTotalItems } from "@/lib/products";
import Skeleton from "react-loading-skeleton";

export default function OrderCard({ lng, order, orderId, isLoading }) {
  const { t } = useTranslation(lng, "common");

  const status = order?.status;
  const totalPrice = order?.totalPrice;
  const timestamp = order?.timestamp;
  const orderTime = new Date(timestamp).toLocaleString();
  const itemsWithPrice = order?.items;
  const orderStatusBg = ORDER_STATUS_TO_BG_COLOR[status];
  const itemStatusText = ORDER_STATUS_TO_TEXT[status];
  const translatedStatus = t(itemStatusText);

  const itemNamesWithCount = isLoading ? [] : countItemsByName(itemsWithPrice);
  // const totalNumberOfItems = countTotalItems(itemsWithPrice);

  return (
    <Link href={isLoading ? "" : `/${lng}/order-details/${order.id}`}>
      <div
        key={orderId}
        className={
          "flex flex-col items-center justify-center w-full p-4 min-h-[100px] mx-1 border-b-2 hover:bg-gray-100" +
          (orderId % 2 === 0 ? " bg-gray-50" : "")
        }
      >
        <div className="flex flex-col items-begin justify-center w-full relative">
          <p className="text-sm font-bold mb-2">
            {isLoading ? (
              <Skeleton width={70} />
            ) : (
              <span
                className="p-1 rounded-md"
                style={{ background: orderStatusBg }}
              >
                {translatedStatus}
              </span>
            )}
          </p>
          <p className="text-sm">
            {" "}
            {isLoading ? <Skeleton width={200} /> : orderTime}
          </p>
          <p className="text-sm">
            {isLoading ? (
              <Skeleton width={170} />
            ) : (
              `${t("Number of items")}: ${countTotalItems(itemsWithPrice)}`
            )}
          </p>

          <p className="text-sm mt-2 mb-2">
            {isLoading ? (
              <Skeleton width={70} />
            ) : (
              itemNamesWithCount &&
              Object.keys(itemNamesWithCount).map((itemName) => {
                const count = itemNamesWithCount[itemName];
                return (
                  <span className="bg-blue-100 mr-1 p-1 rounded-md">
                    {count} x {t(itemName)}
                  </span>
                );
              })
            )}
          </p>
          <p className="absolute right-0 top-0 text-sm float-right font-bold">
            {isLoading ? (
              <Skeleton width={50} />
            ) : (
              totalPrice?.toLocaleString("vi-VN") + "đ"
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
