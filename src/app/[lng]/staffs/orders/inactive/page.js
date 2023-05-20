"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../../i18n/client";
import { GetStaffInactiveOrders } from "@/lib/requests/orders";
import {
  ORDER_STATUS_TO_BG_COLOR,
  ORDER_STATUS_TO_TEXT,
} from "@/lib/order_status";
import Link from "next/link";

export default function Cart({ params: { lng } }) {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState(null);

  useEffect(() => {
    GetStaffInactiveOrders(
      (orders) => {
        setOrderItems(orders);
      },
      (e) => {
        console.log(e);
        alert("Could not get orders");
      }
    );
  }, []);

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[100px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <p className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("Orders")}
          <a href={`/${lng}`}>
            <span>X</span>
          </a>
        </p>

        <div className="flex items-center justify-around w-full p-4 min-h-[50px] mx-1 border-b-2">
          <span
            className="w-full text-center p-1 rounded-md hover:bg-gray-200 clickable"
            onClick={() => {
              router.push(`/${lng}/staffs/orders/new`);
            }}
          >
            {t("New")}
          </span>
          <span
            className="w-full text-center p-1 rounded-md hover:bg-gray-200 clickable"
            onClick={() => {
              router.push(`/${lng}/staffs/orders/processing`);
            }}
          >
            {t("Processing")}
          </span>
          <span
            className="w-full text-center p-1 rounded-md bg-gray-200 clickable"
            onClick={() => {
              router.push(`/${lng}/staffs/orders/inactive`);
            }}
          >
            {t("Inactive")}
          </span>
        </div>

        {orderItems && orderItems.length > 0 ? (
          orderItems.map((order, orderId) => {
            const status = order.status;
            const totalPrice = order.totalPrice;
            const timestamp = order.timestamp;
            const orderTime = new Date(timestamp).toLocaleString();
            const itemsWithPrice = order.items;
            const tax = order.tax;
            const orderStatusBg = ORDER_STATUS_TO_BG_COLOR[status];
            const itemStatusText = ORDER_STATUS_TO_TEXT[status];

            return (
              <Link href={`/${lng}/staffs/order-details/${order.id}`}>
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
                        {itemStatusText}
                      </span>
                    </p>
                    <p className="text-sm">{orderTime}</p>
                    <p className="text-sm">
                      {t("Number of items")}: {itemsWithPrice.length}
                    </p>
                    {itemsWithPrice.map((item, itemId) => {
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
                      <p className="text-sm font-bold">{t("Tax")}</p>
                      <p className="text-sm">${tax.toFixed(2)}</p>
                    </div>
                    <p className="absolute right-0 top-0 text-sm float-right font-bold">
                      {t("Total")}: ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : orderItems === null ? (
          <p className="text-md">{t("Loading...")}</p>
        ) : (
          <p className="text-sm">{t("No orders")}</p>
        )}
      </div>
    </main>
  );
}
