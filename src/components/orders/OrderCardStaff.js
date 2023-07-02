import { useTranslation } from "@/app/i18n/client";
import {
  ORDER_STATUS_TO_BG_COLOR,
  ORDER_STATUS_TO_TEXT,
  ORDER_STATUS_TO_PRIMARY_ACTION,
} from "@/lib/order_status";
import { countTotalItems } from "@/lib/products";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrderCardStaffStaff({
  order,
  lng,
  orderId,
  isLoading,
  handleActionOrder,
}) {
  const { t } = useTranslation(lng, "common");

  const status = order?.status;
  const totalPrice = order?.totalPrice;
  const timestamp = order?.timestamp;
  const orderTime = new Date(timestamp).toLocaleString();
  const itemsWithPrice = order?.items;
  const tax = order?.tax;
  const orderStatusBg = ORDER_STATUS_TO_BG_COLOR[status];
  const itemStatusText = ORDER_STATUS_TO_TEXT[status];
  const translatedStatus = t(itemStatusText);

  return (
    <Link href={isLoading ? "" : `/${lng}/staffs/order-details/${order.id}`}>
      <div
        key={orderId}
        className={
          "flex flex-col items-center justify-center w-full p-4 min-h-[100px] mx-1 border-b-2 hover:bg-gray-200" +
          (orderId % 2 === 0 ? " bg-gray-100" : "")
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
            {isLoading ? <Skeleton width={200} /> : orderTime}
          </p>
          <p className="text-sm">
            {isLoading ? (
              <Skeleton width={170} />
            ) : (
              `${t("Number of items")}: ${countTotalItems(itemsWithPrice)}`
            )}
          </p>

          {isLoading
            ? Array.from({ length: 2 }, (e, i) => i).map((i) => (
                <div
                  key={i}
                  className="flex flex-row items-center justify-between w-full"
                >
                  <Skeleton width={50} />
                  <Skeleton width={200} />
                </div>
              ))
            : itemsWithPrice.map((item, itemId) => {
                const price = item.price;
                const name = item.name;
                const quantity = item.quantity;
                const itemTotalPrice = price * quantity;

                return (
                  <div
                    key={itemId}
                    className="flex flex-row items-center justify-between w-full"
                  >
                    <p className="text-sm">{name}</p>
                    <p className="text-sm">
                      {quantity} x ${price.toFixed(2)} = $
                      {itemTotalPrice.toFixed(2)}
                    </p>
                  </div>
                );
              })}
          <div className="flex flex-row items-center justify-between w-full">
            {isLoading ? (
              <Skeleton width={70} />
            ) : (
              <p className="text-sm font-bold">{t("Tax")}</p>
            )}
            {isLoading ? (
              <Skeleton width={70} />
            ) : (
              <p className="text-sm">${tax.toFixed(2)}</p>
            )}
          </div>
          <p className="absolute right-0 top-0 text-sm float-right font-bold">
            {isLoading ? (
              <Skeleton width={70} />
            ) : (
              `${t("Total")}: ${totalPrice.toFixed(2)}`
            )}
          </p>
          {ORDER_STATUS_TO_PRIMARY_ACTION[status] &&
            (isLoading ? (
              <Skeleton width={100} />
            ) : (
              <button
                className="px-2 py-1 mt-4 text-sm text-gray-800 bg-green-700 text-white rounded-md w-[140px]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleActionOrder(order.id);
                }}
              >
                {t(ORDER_STATUS_TO_PRIMARY_ACTION[status])}
              </button>
            ))}
        </div>
      </div>
    </Link>
  );
}
