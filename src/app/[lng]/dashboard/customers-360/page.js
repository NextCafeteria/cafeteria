"use client";
import { useState, useRef } from "react";
import { useTranslation } from "@/app/i18n/client";
import { GetCustomer } from "@/lib/requests/customers360";
import { useGetOrders } from "@/lib/requests/orders";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
        <div className="flex w-full justify-between pb-3 pt-2 text-3xl mb-2 mt-4">
          {t("Customers 360°")}
        </div>
        <div className="text-md mb-4">
          {t("View customer profile and recent orders.")}
        </div>
        <div className="flex mb-2 max-w-[1000px]">
          <input
            ref={customerEmail}
            className="w-full border-[1px] border-gray-600 p-2 rounded-md max-w-[500px]"
            type="text"
            placeholder={t("Customer email")}
          />
          <button
            className="btn btn-primary text-white p-2.5 ml-1 rounded-md"
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
              class="object-cover w-full h-96 md:h-auto md:w-48 rounded-xl m-2"
              src={customer.image}
              alt=""
            ></img>
            <div class="flex flex-col justify-between p-4 leading-normal">
              <div className="text-2xl text-bold mb-2">{t("Customer")}</div>
              <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
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
              <div className="flex justify-between items-center mb-2 max-w-[1000px]">
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
