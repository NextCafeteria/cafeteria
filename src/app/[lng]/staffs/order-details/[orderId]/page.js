"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../../i18n/client";
import { useRouter } from "next/navigation";
import {
  GetStaffOrder,
  PrepareOrder,
  ConfirmOrder,
  CompleteOrder,
} from "@/lib/requests/orders";
import {
  ORDER_STATUS_TO_BG_COLOR,
  ORDER_STATUS_TO_TEXT,
  OrderStatus,
} from "@/lib/order_status";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function StaffOrder({ params: { lng, orderId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }
  const isStaff = session?.data?.user?.isStaff;
  if (session?.data?.user && !isStaff) {
    router.push(`/${lng}`);
  }
  const [orderData, setOrderData] = useState(null);

  function handleConfirmOrder({ orderId }) {
    ConfirmOrder(
      orderId,
      () => {
        router.push(`/${lng}/staffs/orders/new`);
      },
      (e) => {
        console.log(e);
        alert("Could not process order");
      }
    );
  }

  function handleCompleteOrder({ orderId }) {
    CompleteOrder(
      orderId,
      () => {
        router.push(`/${lng}/staffs/orders/processing`);
      },
      (e) => {
        console.log(e);
        alert("Could not complete order");
      }
    );
  }

  function handlePrepareOrder({ orderId }) {
    PrepareOrder(
      orderId,
      () => {
        router.push(`/${lng}/staffs/orders/processing`);
      },
      (e) => {
        console.log(e);
        alert("Could not prepare order");
      }
    );
  }

  useEffect(() => {
    GetStaffOrder(
      orderId,
      (data) => {
        console.log("data", data);
        setOrderData(data);
      },
      (e) => {
        console.log(e);
        alert("Could not get orders");
        router.push(`/${lng}/staffs/orders`);
      }
    );
  }, []);

  const { t } = useTranslation(lng, "common");
  const orderStatusBg = ORDER_STATUS_TO_BG_COLOR[orderData?.status];
  const itemStatusText = ORDER_STATUS_TO_TEXT[orderData?.status];
  const translatedStatus = t(itemStatusText);
  const orderTime = new Date(orderData?.timestamp).toLocaleString();
  const price = orderData?.price;
  const tax = orderData?.tax;
  const totalPrice = orderData?.totalPrice;
  const itemsWithPrice = orderData?.items;

  // function handleCancelOrder() {
  //   CancelOrder(
  //     orderId,
  //     () => {
  //       router.push(`/${lng}/orders`);
  //     },
  //     (e) => {
  //       console.log(e);
  //       alert("Could not cancel order");
  //     }
  //   );
  // }

  return (
    <main className="flex justify-center p-2 pb-[100px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <p className="flex w-full border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          <Link href={`/${lng}/staffs/orders`} className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </Link>
          {t("Order")}
        </p>
        {orderStatusBg && itemStatusText && (
          <p className="text-sm font-bold mb-2">
            <span
              className="p-1 rounded-md mr-2"
              style={{ background: orderStatusBg }}
            >
              {translatedStatus}
            </span>
            <span>{orderTime}</span>
          </p>
        )}
        {itemsWithPrice &&
          itemsWithPrice.map((item, index) => {
            const { name, price, quantity } = item;
            return (
              <div className="border-b-2  mb-2 pb-2" key={index}>
                <div className="flex justify-between w-full pb-3 pt-2">
                  <p className="text-sm font-bold">{t(name)}</p>
                  <p className="text-sm font-bold">
                    {quantity} x ${price}
                  </p>
                </div>
                {item.customizations.map(
                  (customization, customizationIndex) => {
                    return (
                      <p key={customizationIndex} className="text-sm">
                        {t(customization.name)}:{" "}
                        {t(
                          customization.options[
                            item.selectedOptions[customizationIndex]
                          ]?.name
                        )}
                      </p>
                    );
                  }
                )}
              </div>
            );
          })}
        {price && (
          <>
            <div className="flex justify-between w-full pt-4">
              <p className="text-sm font-bold mb-2">{t("Before Tax")}</p>
              <p className="text-sm font-bold mb-2">${price.toFixed(2)}</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-sm font-bold mb-2">{t("Tax")}</p>
              <p className="text-sm font-bold mb-2">${tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between w-full border-b-2 border-gray-800">
              <p className="text-sm font-bold mb-2">{t("Total")}</p>
              <p className="text-sm font-bold mb-2">${totalPrice.toFixed(2)}</p>
            </div>
          </>
        )}
        {orderData ? (
          <></>
        ) : orderData === null ? (
          <p className="text-md">{t("Loading...")}</p>
        ) : (
          <p className="text-sm">{t("No data")}</p>
        )}
      </div>

      {orderData?.status === OrderStatus.QUEUED && (
        <div
          className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[100px h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 md:rounded-md"
          onClick={() => {
            handleConfirmOrder({ orderId: orderId });
          }}
          style={{
            background: ORDER_STATUS_TO_BG_COLOR[OrderStatus.CONFIRMED],
          }}
        >
          <span className="text-2xl">{t("Confirm")}</span>
        </div>
      )}

      {orderData?.status === OrderStatus.CONFIRMED && (
        <div
          className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[100px h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 md:rounded-md"
          onClick={() => {
            handlePrepareOrder({ orderId: orderId });
          }}
          style={{
            background: ORDER_STATUS_TO_BG_COLOR[OrderStatus.PREPARING],
          }}
        >
          <span className="text-2xl">{t("Prepare")}</span>
        </div>
      )}

      {orderData?.status === OrderStatus.PREPARING && (
        <div
          className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[100px h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 md:rounded-md"
          onClick={() => {
            handleCompleteOrder({ orderId: orderId });
          }}
          style={{
            background: ORDER_STATUS_TO_BG_COLOR[OrderStatus.COMPLETED],
          }}
        >
          <span className="text-2xl">{t("Complete")}</span>
        </div>
      )}
    </main>
  );
}
