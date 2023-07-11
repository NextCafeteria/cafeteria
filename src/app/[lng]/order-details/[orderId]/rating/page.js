"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { GetOrder, RateOrder } from "@/lib/requests/orders";

import BackButton from "@/components/buttons/BackButton";
import RatingInput from "@/components/RatingInput";
export default function OrderRating({ params: { lng, orderId } }) {
  const router = useRouter();
  const { t } = useTranslation(lng, "common");

  const [orderData, setOrderData] = useState(null);
  const [rating, setRating] = useState(0);

  function handleSendRating() {
    const commentValue = document.getElementById("comment").value;
    RateOrder(
      orderId,
      rating,
      commentValue,
      (data) => {
        router.push(`/${lng}/order-details/${orderId}`);
      },
      (e) => {
        console.log(e);
        alert("Could not create rating");
      }
    );
  }

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

  const orderTime = new Date(orderData?.timestamp).toLocaleString();
  const itemsWithPrice = orderData?.items;

  // implement a rating page for order
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="flex w-full border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          <BackButton href={`/${lng}/order-details/${orderId}`} />
          {t("Rating")}
        </div>
        <div className="flex w-full pb-3 pt-2 text-2xl px-2 mb-2">
          <span>
            {t("Order")} {orderTime}
          </span>
        </div>
        <p className="text-sm font-bold mb-2 mt-4">
          {
            ///print items in the order in one line
            itemsWithPrice?.map((item) => {
              return (
                <span key={item.id} className="bg-blue-100 mr-1 p-1 rounded-md">
                  {item.name} x {item.quantity}
                </span>
              );
            })
          }
        </p>
        <RatingInput value={rating} setValue={setRating} />
        <div className="flex flex-col justify-center mt-4">
          <span>{t("Share more about your experience")}</span>
          <textarea
            className="border-2 border-gray-800 rounded-md w-full h-20 mt-2"
            id="comment"
          />
        </div>
      </div>
      <div className="btn btn-primary mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px]">
        <div
          onClick={() => {
            handleSendRating();
          }}
        >
          <span className="text-2xl">{t("Send")}</span>
        </div>
      </div>
    </main>
  );
}
