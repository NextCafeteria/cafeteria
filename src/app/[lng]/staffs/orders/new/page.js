"use client";
import { useTranslation } from "@/app/i18n/client";

import { useGetStaffQueuedOrders, ConfirmOrder } from "@/lib/requests/orders";
import OrderCardStaff from "@/components/orders/OrderCardStaff";
import { OrderStatus } from "@/lib/order_status";
import { toast } from "react-toastify";

export default function Orders({ params: { lng } }) {
  const { orderItems, isLoading, error, mutate } = useGetStaffQueuedOrders();
  if (error) {
    console.log(error);
    toast.error("Could not get orders");
  }

  function handleConfirmOrder(orderId) {
    const optmisticOrders = [...orderItems];

    mutate(
      async () => {
        await ConfirmOrder(
          orderId,
          () => {
            router.push(`/${lng}/staffs/orders/processing`);
          },
          (e) => {
            console.log(e);
            toast.error("Could not process order");
          }
        );
      },
      {
        optimisticData: {
          data: orderItems.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: OrderStatus.CONFIRMED,
              };
            }
            return order;
          }),
        },
      }
    );
  }

  const { t } = useTranslation(lng, "common");
  return (
    <>
      {orderItems && orderItems.length > 0 ? (
        orderItems.map((order, orderId) => (
          <OrderCardStaff
            order={order}
            orderId={orderId}
            lng={lng}
            isLoading={order.loading}
            handleActionOrder={(orderId) => handleConfirmOrder(orderId)}
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
