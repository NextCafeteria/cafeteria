"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { PlaceOrder, useGetOrder } from "@/lib/requests/orders";
import { PopulateCart } from "@/lib/requests/cart";
import { useSession } from "next-auth/react";
import AddressPicker from "@/components/AddressPicker";
const addressOptions = require("@/data/address_options.json");
import XButton from "@/components/buttons/XButton";
import CartItemCard from "@/components/cart/CartItemCard";
import Payment from "@/components/cart/Payment";
import { toast } from "react-toastify";
import { useGetCommonSettings } from "@/lib/requests/settings";
import { formatPrice } from "@/lib/utils";

export default function Cart({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
    return <></>;
  }

  const { data: commonSettings } = useGetCommonSettings();
  const [hidePayment, setHidePayment] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState({});

  const { order, mutateOrder } = useGetOrder(orderPlaced?.id);
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    let address = localStorage.getItem("lastDeliveryAddress", null);
    if (address) {
      return address;
    }
    if (session?.data?.user?.lastDeliveryAddress) {
      address = session.data.user.lastDeliveryAddress;
    } else {
      address = addressOptions[0];
    }
    localStorage.setItem("lastDeliveryAddress", address);
    return address;
  });

  function getItemsWithPrice(cart) {
    PopulateCart(cart)
      .then((data) => {
        setCartData(data);
      })
      .catch((e) => {
        router.push(`/${lng}/login`);
      });
  }

  function getItemsWithPriceFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("cart", "[]"));
    getItemsWithPrice(cart);
  }

  async function handlePay() {
    mutateOrder();
    if (order?.paid) {
      setHidePayment(true);
      localStorage.setItem("cart", "[]");
      router.push(`/${lng}/orders`);
    } else {
      return { error: true };
    }
  }
  useEffect(() => {
    getItemsWithPriceFromLocalStorage();
  }, []);

  const { t } = useTranslation(lng, "common");
  function handlePlaceOrder() {
    const cart = JSON.parse(localStorage.getItem("cart", "[]"));
    localStorage.setItem("lastDeliveryAddress", deliveryAddress);
    if (!storeId) {
      toast.error(t("Please select a store"));
      return;
    }
    PlaceOrder(
      cart,
      deliveryAddress,
      storeId,
      (data) => {
        setOrderPlaced(data);
        setHidePayment(false);
      },
      (e) => {
        toast.error(t("Order failed"));
      }
    );
  }

  function handeDelete(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart", "[]"));
    cart.splice(itemId, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    getItemsWithPrice(cart);
  }

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("Cart")}
          <XButton href={`/${lng}`} />
        </div>
        {cartData && !cartData?.items?.length ? (
          <div className="flex flex-col items-center justify-center w-full min-h-[100px] my-1 mx-1 border-b-2">
            <div className="flex flex-col items-begin justify-center w-full relative">
              <p className="text-md">
                {t("Your cart is empty. Go to Home to pick something.")}
              </p>
            </div>
          </div>
        ) : (
          <>
            {cartData?.items && (
              <>
                {cartData?.items.map((item, index) => {
                  return (
                    <CartItemCard
                      lng={lng}
                      item={item}
                      index={index}
                      handeDelete={handeDelete}
                    />
                  );
                })}
                <>
                  <div className="flex justify-between w-full pt-4">
                    <p className="text-sm font-bold mb-2">{t("Before Tax")}</p>
                    <p className="text-sm font-bold mb-2">
                      {cartData?.price &&
                        formatPrice(
                          cartData?.price,
                          commonSettings?.currencyPrefix,
                          commonSettings?.currencySuffix,
                          commonSettings?.currencyDecimal
                        )}
                    </p>
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-bold mb-2">{t("Tax")}</p>
                    <p className="text-sm font-bold mb-2">
                      {cartData?.tax &&
                        formatPrice(
                          cartData?.tax,
                          commonSettings?.currencyPrefix,
                          commonSettings?.currencySuffix,
                          commonSettings?.currencyDecimal
                        )}
                    </p>
                  </div>
                  <div className="flex justify-between w-full border-b-2 border-gray-800">
                    <p className="text-sm font-bold mb-2">{t("Total")}</p>
                    <p className="text-sm font-bold mb-2">
                      {cartData?.tax &&
                        formatPrice(
                          cartData?.total,
                          commonSettings?.currencyPrefix,
                          commonSettings?.currencySuffix,
                          commonSettings?.currencyDecimal
                        )}
                    </p>
                  </div>
                </>
                <AddressPicker
                  lng={lng}
                  addressOptions={addressOptions}
                  defaultAddress={deliveryAddress}
                  setAddressCb={setDeliveryAddress}
                  setStoreIdCb={setStoreId}
                ></AddressPicker>
              </>
            )}
          </>
        )}
      </div>
      {cartData && cartData?.items?.length != 0 && (
        <div className="btn btn-primary btn-shadow mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px] h-[50px] p-2md:rounded-md">
          <span className="text-2xl" onClick={handlePlaceOrder}>
            {t("Place Order!")}
          </span>
          <span className="text-2xl float-right">
            {cartData?.total &&
              formatPrice(
                cartData?.total,
                commonSettings?.currencyPrefix,
                commonSettings?.currencySuffix,
                commonSettings?.currencyDecimal
              )}
          </span>
        </div>
      )}
      {cartData && cartData?.items?.length != 0 && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center ${
            !hidePayment ? "block" : "hidden"
          }`}
        >
          <div className="fixed self-center p-2 bg-white md:rounded-md mx-2 my-4">
            <Payment
              lng={lng}
              orderId={orderPlaced.id}
              orderAmount={orderPlaced.amount}
              handleCancel={() => {
                setHidePayment(true);
              }}
              handlePay={handlePay}
            ></Payment>
          </div>
        </div>
      )}
    </main>
  );
}
