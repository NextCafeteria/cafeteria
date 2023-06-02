"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../i18n/client";
import { useRouter } from "next/navigation";
import { GetOrder, CancelOrder } from "@/lib/requests/orders";
import {
  ORDER_STATUS_TO_BG_COLOR,
  ORDER_STATUS_TO_TEXT,
  OrderStatus,
} from "@/lib/order_status";
import { useSession } from "next-auth/react";
import BackButton from "@/components/buttons/BackButton";
import Rating from "@/components/Rating";
import Comment from "@/components/Comment";

export default function Cart({ params: { lng, orderId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    GetOrder(
      orderId,
      (data) => {
        setOrderData(data);
      },
      (e) => {
        console.log(e);
        alert("Could not get orders");
        router.push(`/${lng}/orders`);
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
  const deliveryAddress = orderData?.deliveryAddress;
  const rating = orderData?.rating;
  const customerComment = orderData?.customerComment;
  const staffComment = orderData?.staffComment;

  function handleCancelOrder() {
    CancelOrder(
      orderId,
      () => {
        router.push(`/${lng}/orders`);
      },
      (e) => {
        console.log(e);
        alert("Could not cancel order");
      }
    );
  }

  function handleReorder() {
    const cart = itemsWithPrice.map((item) => {
      const { id, quantity, selectedOptions } = item;
      return {
        id,
        quantity,
        selectedOptions,
      };
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push(`/${lng}/cart`);
  }

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="flex w-full border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          <BackButton href={`/${lng}/orders`} />
          {t("Order")}
        </div>
        {orderStatusBg && itemStatusText && (
          <p className="text-sm font-bold mb-2 mt-4">
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
              <div
                className={
                  "p-4 border-b-2" + (index % 2 === 0 ? " bg-gray-100" : "")
                }
                key={index}
              >
                <div className="flex justify-between w-full pb-1 pt-2">
                  <p className="text-sm font-bold">{t(name)}</p>
                  <p className="text-sm font-bold">
                    {quantity} x ${price}
                  </p>
                </div>
                <img src={item.image} className="w-16 h-auto rounded-md mb-4" />
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
        {deliveryAddress && (
          <div className="flex flex-col items-begin justify-center w-full mt-4">
            <p className="text-sm font-bold">{t("Delivery Address")}</p>
            <p className="text-sm">{t(deliveryAddress)}</p>
          </div>
        )}
        {orderData?.status === OrderStatus.COMPLETED &&
          (rating ? (
            <div className="flex flex-col items-begin justify-center w-full mt-4 border-t-2 border-gray-800 py-4">
              <p className="text-sm font-bold">{t("Rating")}</p>
              <div className="my-2">
                <Rating value={rating} />
              </div>
              {customerComment && <Comment comment={customerComment} />}
              {staffComment && <Comment comment={staffComment} />}
            </div>
          ) : orderData === null ? (
            <></>
          ) : (
            <div
              className="flex flex-col items-end justify-center w-full mt-4 border-t-2 border-gray-800 py-4 clickable"
              onClick={() => {
                router.push(`/${lng}/order-details/${orderId}/rating`);
              }}
            >
              <p className="text-sm font-bold text-blue-700">
                {t("+ Add a rating")}
              </p>
            </div>
          ))}
      </div>

      <div className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[100px]">
        {orderData?.status === OrderStatus.QUEUED && (
          <div
            className="h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-[#F59191] md:rounded-md"
            onClick={handleCancelOrder}
          >
            <span className="text-2xl">{t("Cancel order")}</span>
          </div>
        )}
        {[OrderStatus.CANCELLED, OrderStatus.COMPLETED].includes(
          orderData?.status
        ) && (
          <div
            className="h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-orange-400 md:rounded-md"
            onClick={handleReorder}
          >
            <span className="text-2xl">{t("Re-order")}</span>
          </div>
        )}
      </div>
    </main>
  );
}
