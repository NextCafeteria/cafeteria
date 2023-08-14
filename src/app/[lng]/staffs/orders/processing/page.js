"use client";
import { useTranslation } from "@/app/i18n/client";

import {
  CompleteOrder,
  useGetStaffProcessingOrders,
  PrepareOrder,
} from "@/lib/requests/orders";
import { OrderStatus } from "@/lib/order_status";
import OrderCardStaff from "@/components/orders/OrderCardStaff";
import { toast } from "react-toastify";

export default function Cart({ params: { lng } }) {
  const { orderItems, isLoading, mutate } = useGetStaffProcessingOrders();

  function handleCompleteOrder(orderId) {
    mutate(
      async () => {
        await CompleteOrder(
          orderId,
          () => {
            router.push(`/${lng}/staffs/orders/inactive`);
          },
          (e) => {
            console.log(e);
            toast.error("Could not complete order");
          }
        );
      },
      {
        optimisticData: {
          data: orderItems.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: OrderStatus.COMPLETED,
              };
            }
            return order;
          }),
        },
      }
    );
    CompleteOrder(
      orderId,
      () => {
        router.push(`/${lng}/staffs/orders/inactive`);
      },
      (e) => {
        console.log(e);
        toast.error("Could not complete order");
      }
    );
  }

  function handlePrepareOrder(orderId) {
    mutate(
      async () => {
        await PrepareOrder(
          orderId,
          () => {},
          (e) => {
            console.log(e);
            toast.error("Could not prepare order");
          }
        );
      },
      {
        optimisticData: {
          data: orderItems.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: OrderStatus.PREPARING,
              };
            }
            return order;
          }),
        },
        populateCache: false,
      }
    );
  }

  const { t } = useTranslation(lng, "common");
  return (
    <>
      {(orderItems && orderItems.length) > 0 ? (
        orderItems.map((order, orderId) => (
          <OrderCardStaff
            order={order}
            orderId={orderId}
            lng={lng}
            isLoading={order.loading}
            handleActionOrder={
              order.status === OrderStatus.PREPARING
                ? (orderId) => {
                    handleCompleteOrder(orderId);
                  }
                : (orderId) => {
                    handlePrepareOrder(orderId);
                  }
            }
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
