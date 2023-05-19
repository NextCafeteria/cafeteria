"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "../../i18n/client";
import { GetOrders } from "@/lib/requests/orders";

export default function Cart({ params: { lng } }) {
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    GetOrders((orders) => {
      setOrderItems(orders);
    }, (e) => {
      console.log(e);
      alert("Could not get orders")
    })
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
        {orderItems.map((order, orderId) => {
          const status = order.status;
          const price = order.price;
          const tax = order.tax;
          const totalPrice = order.totalPrice;
          const items = order.items;
          const timestamp = order.timestamp;
          const orderTime = new Date(timestamp).toLocaleString();
          const itemsWithPrice = order.items;

          return (
            <div
              key={orderId}
              className="flex flex-col items-center justify-center w-full p-4 min-h-[100px] my-1 mx-1 border-b-2"
            >
              <div className="flex flex-col items-begin justify-center w-full relative">
                <p className="text-sm">{t("Status")}: {status}</p>
                <p className="text-sm">{orderTime}</p>
                <p className="text-sm">
                  {t("Number of items")}: {itemsWithPrice.length}
                </p>
                <p className="absolute right-0 top-0 text-sm float-right">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
