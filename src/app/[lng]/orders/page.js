"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "../../i18n/client";
import { GetOrders } from "@/lib/requests/orders";
import {
  ORDER_STATUS_TO_BG_COLOR,
  ORDER_STATUS_TO_TEXT,
} from "@/lib/order_status";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { countItemsByName, countTotalItems } from "@/lib/products";
import XButton from "@/components/buttons/XButton";

export default function Cart({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const [orderItems, setOrderItems] = useState(null);

  useEffect(() => {
    GetOrders(
      (orders) => {
        setOrderItems(orders);
      },
      (e) => {
        console.log(e);
      }
    );
  }, []);

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("Order History")}
          <XButton />
        </div>
        {orderItems && orderItems.length > 0 ? (
          orderItems.map((order, orderId) => {
            const status = order.status;
            const totalPrice = order.totalPrice;
            const timestamp = order.timestamp;
            const orderTime = new Date(timestamp).toLocaleString();
            const itemsWithPrice = order.items;
            const orderStatusBg = ORDER_STATUS_TO_BG_COLOR[status];
            const itemStatusText = ORDER_STATUS_TO_TEXT[status];
            const translatedStatus = t(itemStatusText);
            const itemNamesWithCount = countItemsByName(itemsWithPrice);
            const totalNumberOfItems = countTotalItems(itemsWithPrice);

            return (
              <Link href={`/${lng}/order-details/${order.id}`}>
                <div
                  key={orderId}
                  className={
                    "flex flex-col items-center justify-center w-full p-4 min-h-[100px] mx-1 border-b-2 hover:bg-gray-200" +
                    (orderId % 2 === 0 ? " bg-gray-100" : "")
                  }
                >
                  <div className="flex flex-col items-begin justify-center w-full relative">
                    <p className="text-sm font-bold mb-2">
                      <span
                        className="p-1 rounded-md"
                        style={{ background: orderStatusBg }}
                      >
                        {translatedStatus}
                      </span>
                    </p>
                    <p className="text-sm">{orderTime}</p>
                    <p className="text-sm">
                      {t("Number of items")}: {totalNumberOfItems}
                    </p>
                    <p className="text-sm mt-2 mb-2">
                      {itemNamesWithCount &&
                        Object.keys(itemNamesWithCount).map((itemName) => {
                          const count = itemNamesWithCount[itemName];
                          return (
                            <span className="bg-blue-100 mr-1 p-1 rounded-md">
                              {count} x {t(itemName)}
                            </span>
                          );
                        })}
                    </p>
                    <p className="absolute right-0 top-0 text-sm float-right font-bold">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : orderItems === null ? (
          <p className="text-md">{t("Loading...")}</p>
        ) : (
          <p className="text-sm">
            {t("You have no order. Please go to Home to pick something.")}
          </p>
        )}
      </div>
    </main>
  );
}
