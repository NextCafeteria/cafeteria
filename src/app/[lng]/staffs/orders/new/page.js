"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useSession } from "next-auth/react";

import { GetStaffQueuedOrders, ConfirmOrder } from "@/lib/requests/orders";
import XButton from "@/components/buttons/XButton";
import OrderCardStaff from "@/components/orders/OrderCardStaff";

export default function Orders({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }
  if (
    session?.data?.user &&
    !session?.data?.user?.isStaff &&
    !session?.data?.user?.isAdmin
  ) {
    router.push(`/${lng}`);
  }
  const [orderItems, setOrderItems] = useState(null);
  const [loading, setLoading] = useState({});

  function handleConfirmOrder(orderId) {
    setLoading({ ...loading, [orderId]: true });
    ConfirmOrder(
      orderId,
      () => {
        router.push(`/${lng}/staffs/orders/processing`);
      },
      (e) => {
        console.log(e);
        alert("Could not process order");
      }
    );
  }

  useEffect(() => {
    GetStaffQueuedOrders(
      (orders) => {
        setOrderItems(orders);
        orders &&
          orders.length > 0 &&
          setLoading(orders.map((order) => ({ [order.id]: false })));
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
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("Orders")}
          <XButton />
        </div>

        <div className="flex items-center justify-around w-full p-4 min-h-[50px] mx-1 border-b-2">
          <span
            className="w-full text-center p-1 rounded-md bg-gray-200 clickable"
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
            className="w-full text-center p-1 rounded-md hover:bg-gray-200 clickable"
            onClick={() => {
              router.push(`/${lng}/staffs/orders/inactive`);
            }}
          >
            {t("Inactive")}
          </span>
        </div>

        {orderItems && orderItems.length > 0 ? (
          orderItems.map((order, orderId) => (
            <OrderCardStaff
              order={order}
              orderId={orderId}
              lng={lng}
              isLoading={loading[order.id]}
              handleActionOrder={(orderId) => handleConfirmOrder(orderId)}
            />
          ))
        ) : orderItems === null ? (
          Array.from({ length: 3 }, (e, i) => i).map((i) => (
            <OrderCardStaff
              order={null}
              orderId={i}
              lng={lng}
              isLoading={true}
              handleActionOrder={null}
            />
          ))
        ) : (
          <p className="text-sm">{t("No orders")}</p>
        )}
      </div>
    </main>
  );
}
