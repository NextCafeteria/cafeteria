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

  const [errorMessage, setErrorMessage] = useState(null);
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
          console.log(data);
          setCustomer(data);
        })
        .catch((error) => {
          setErrorMessage(t("Customer not found"));
        });
    }
  };

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full md:w-full md:px-10 mx-auto font-mono text-sm">
        <div className="flex w-full justify-between pb-3 pt-2 text-3xl mb-2">
          {t("Customer 360°")}
        </div>
        <div className="text-md mb-4">
          “Một mục tiêu luôn luôn đồng hành với sự phát triển của doanh nghiệp
          đó là sở hữu được dịch vụ khách hàng không chỉ tốt mà phải biến nó
          thành huyền thoại” –{" "}
          <i>
            Sam Walton là người thành lập tập đoàn bán lẻ Wal – Mart, ông được
            mệnh danh là “ông vua bán lẻ ở Mỹ.
          </i>
        </div>
        <div className="flex justify-between items-center mb-2 max-w-[600px]">
          <input
            ref={customerEmail}
            className="w-full border-2 border-gray-400 p-2"
            type="text"
            placeholder={t("Customer email")}
          />
          <button
            className="bg-blue-600 text-white p-2.5 ml-1 w-[250px]"
            onClick={handleFindCustomer}
          >
            {t("View Customer Profile")}
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-500 text-white p-2 mb-2">{errorMessage}</div>
        )}

        {customer && (
          <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 w-full mb-6">
            <img
              class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
              src={customer.image}
              alt=""
            ></img>
            <div class="flex flex-col justify-between p-4 leading-normal">
              <div className="text-2xl text-bold">
                {t("Customer Profile")} &#128142;&#128142;&#128142;
              </div>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {customer.name}
              </h5>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {customer.email}
              </p>
            </div>
          </div>
        )}

        {customer &&
          (isLoading ? (
            Array.from({ length: 3 }, (e, i) => i).map((i) => (
              <OrderCard order={null} orderId={i} lng={lng} isLoading={true} />
            ))
          ) : orderItems.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-2 max-w-[600px]">
                <div className="text-2xl">{t("Recent Orders")}</div>
              </div>
              {orderItems.map((order, orderId) => (
                <OrderCard
                  lng={lng}
                  order={order}
                  orderId={orderId}
                  isLoading={false}
                />
              ))}
            </>
          ) : (
            <p className="text-sm">
              {t("The customer has not placed any orders yet")}
            </p>
          ))}
      </div>
    </main>
  );
}
