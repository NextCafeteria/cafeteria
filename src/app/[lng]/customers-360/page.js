"use client";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/app/i18n/client";
import { GetCustomer } from "@/lib/requests/customers360";
import { useGetOrders } from "@/lib/requests/orders";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import XButton from "@/components/buttons/XButton";
import OrderCard from "@/components/orders/OrderCard";

export default function Cart({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
    return <></>;
  }

  const customerEmail = useRef(null);
  const [customer, setCustomer] = useState(null);
  const { orderItems, error, isLoading } = useGetOrders(
    customer?.id ? customer?.id : null
  );
  if (error) {
    console.log(error);
  }

  const handleFindCustomer = async () => {
    if (customerEmail.current) {
      console.log(customerEmail.current.value);
      await GetCustomer(customerEmail.current.value)
        .then((data) => {
          setCustomer(data);
        })
        .catch((error) => {
          alert("Không tìm thấy khách hàng");
        });
    }
  };

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("Customer 360°")}
          <XButton />
        </div>
        {/* Input customer email to find Id */}
        <div className="flex justify-between items-center mb-2">
          <input
            ref={customerEmail}
            className="w-full border-2 border-gray-800 rounded-md p-2"
            type="text"
            placeholder={t("Customer email")}
          />
          <button
            className="bg-blue-500 text-white rounded-md p-2.5 ml-1"
            onClick={handleFindCustomer}
          >
            {t("Find")}
          </button>
        </div>

        {customer &&
          (isLoading ? (
            Array.from({ length: 3 }, (e, i) => i).map((i) => (
              <OrderCard order={null} orderId={i} lng={lng} isLoading={true} />
            ))
          ) : orderItems.length > 0 ? (
            orderItems.map((order, orderId) => (
              <OrderCard
                lng={lng}
                order={order}
                orderId={orderId}
                isLoading={false}
              />
            ))
          ) : (
            <p className="text-sm">
              {t("The customer has not placed any orders yet")}
            </p>
          ))}
      </div>
    </main>
  );
}
