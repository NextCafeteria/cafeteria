"use client";
import { useTranslation } from "@/app/i18n/client";

import { useGetStaffInactiveOrders } from "@/lib/requests/orders";
import OrderCardStaff from "@/components/orders/OrderCardStaff";

export default function Cart({ params: { lng } }) {
  const { orderItems, isLoading } = useGetStaffInactiveOrders();

  const { t } = useTranslation(lng, "common");
  return (
    <>
      {orderItems && orderItems.length > 0 ? (
        orderItems.map((order, orderId) => (
          <OrderCardStaff
            order={order}
            orderId={orderId}
            lng={lng}
            isLoading={false}
            handleActionOrder={(orderId) => {}}
          />
        ))
      ) : isLoading ? (
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
        <p className="text-sm">{t("No order")}</p>
      )}
    </>
  );
}
