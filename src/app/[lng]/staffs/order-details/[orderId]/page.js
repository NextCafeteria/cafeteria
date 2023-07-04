"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import {
  GetStaffOrder,
  PrepareOrder,
  ConfirmOrder,
  CompleteOrder,
  ResponseOrder,
} from "@/lib/requests/orders";
import {
  ORDER_STATUS_TO_BG_COLOR,
  ORDER_STATUS_TO_TEXT,
  OrderStatus,
} from "@/lib/order_status";
import { useSession } from "next-auth/react";
import BackButton from "@/components/buttons/BackButton";
import Rating from "@/components/Rating";
import Comment from "@/components/Comment";

export default function StaffOrder({ params: { lng, orderId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }
  const isStaff = session?.data?.user?.isStaff;
  const isAdmin = session?.data?.user?.isAdmin;
  if (session?.data?.user && !isStaff && !isAdmin) {
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

  function handleSendResponse() {
    const responseValue = document.getElementById("response").value;
    ResponseOrder(
      orderId,
      responseValue,
      (data) => {
        fetchOrder();
      },
      (e) => {
        console.log(e);
        alert("Could not send response");
      }
    );
  }

  function fetchOrder() {
    GetStaffOrder(
      orderId,
      (data) => {
        setOrderData(data);
      },
      (e) => {
        console.log(e);
        alert("Could not get orders");
        router.push(`/${lng}/staffs/orders`);
      }
    );
  }

  useEffect(() => {
    fetchOrder();
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
  const rating = orderData?.rating;
  const customerComment = orderData?.customerComment;
  const staffComment = orderData?.staffComment;

  return (
    <main className="flex justify-center p-2 pb-[100px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <p className="flex w-full border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          <BackButton />
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
                {Object.keys(item.customizations)
                  .sort(
                    (a, b) =>
                      item.customizations[a].order -
                      item.customizations[b].order
                  )
                  .map((customizationId) => {
                    if (item.selectedOptions[customizationId] === undefined)
                      return;
                    return (
                      <p
                        key={item.customizations[customizationId].order}
                        className="text-sm"
                      >
                        {t(item.customizations[customizationId].name)}:{" "}
                        {t(
                          item.customizations[customizationId].options[
                            item.selectedOptions[customizationId]
                          ]?.name
                        )}
                      </p>
                    );
                  })}
              </div>
            );
          })}
        {price && (
          <>
            <div className="flex justify-between w-full pt-4">
              <p className="text-sm font-bold mb-2">{t("Before Tax")}</p>
              <p className="text-sm font-bold mb-2">{price}đ</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-sm font-bold mb-2">{t("Tax")}</p>
              <p className="text-sm font-bold mb-2">{tax}đ</p>
            </div>
            <div className="flex justify-between w-full border-b-2 border-gray-800">
              <p className="text-sm font-bold mb-2">{t("Total")}</p>
              <p className="text-sm font-bold mb-2">{totalPrice}đ</p>
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

        {rating && (
          <div className="flex flex-col items-begin justify-center w-full mt-4">
            <p className="text-sm font-bold">{t("Rating")}</p>
            <div className="my-2">
              <Rating value={rating} />
            </div>
            {customerComment && <Comment comment={customerComment} />}
            {staffComment ? (
              <Comment comment={staffComment} />
            ) : (
              <div className="flex flex-col mt-4">
                <span>{t("Write your response to this review")}</span>
                <textarea
                  className="border-2 border-gray-800 rounded-md w-full h-20 mt-2"
                  id="response"
                />
                <button
                  className="rounded-md w-[100px] h-10 mt-2 self-end text-sm font-medium text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300:bg-blue-700"
                  onClick={() => {
                    handleSendResponse();
                  }}
                >
                  {t("Send")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {orderData?.status === OrderStatus.QUEUED && (
        <div
          className="flex justify-center w-full max-w-[700px] fixed bottom-[90px] md:bottom-[20px] h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 md:rounded-md"
          onClick={() => {
            handleConfirmOrder({ orderId: orderId });
          }}
          style={{
            background: ORDER_STATUS_TO_BG_COLOR[OrderStatus.CONFIRMED],
          }}
        >
          <span className="text-center text-2xl">{t("Confirm")}</span>
        </div>
      )}

      {orderData?.status === OrderStatus.CONFIRMED && (
        <div
          className="flex justify-center w-full max-w-[700px] fixed bottom-[90px] md:bottom-[20px] h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 md:rounded-md"
          onClick={() => {
            handlePrepareOrder({ orderId: orderId });
          }}
          style={{
            background: ORDER_STATUS_TO_BG_COLOR[OrderStatus.PREPARING],
          }}
        >
          <span className="text-center text-2xl">{t("Prepare")}</span>
        </div>
      )}

      {orderData?.status === OrderStatus.PREPARING && (
        <div
          className="flex justify-center w-full max-w-[700px] fixed bottom-[90px] md:bottom-[20px] h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 md:rounded-md"
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
