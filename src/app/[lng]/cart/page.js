"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  calculatePriceForList,
  getItemsWithPrice,
  calculateTax,
  calculateTotalPriceWithTax,
} from "@/lib/price";
import { useTranslation } from "@/app/i18n/client";
import { PlaceOrder } from "@/lib/requests/orders";
import { useSession } from "next-auth/react";
import AddressPicker from "@/components/AddressPicker";
const addressOptions = require("@/data/address_options.json");
import XButton from "@/components/buttons/XButton";
import CartItemCard from "@/components/cart/CartItemCard";

export default function Cart({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemsWithPrice, setItemsWithPrice] = useState([]);
  const [storeId, setStoreId] = useState(null);
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

  function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem("cart", "[]"));
    let price = calculatePriceForList(cart);
    setTotalPrice(price);
  }

  function getItemsWithPriceFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("cart", "[]"));
    let items = getItemsWithPrice(cart);
    setItemsWithPrice(items);
    updateTotalPrice();
  }

  useEffect(() => {
    getItemsWithPriceFromLocalStorage();
  }, []);

  const { t } = useTranslation(lng, "common");
  function handlePlaceOrder() {
    const cart = JSON.parse(localStorage.getItem("cart", "[]"));
    localStorage.setItem("lastDeliveryAddress", deliveryAddress);
    if (!storeId) {
      alert(t("Please select a store"));
      return;
    }
    PlaceOrder(
      cart,
      deliveryAddress,
      storeId,
      (data) => {
        localStorage.setItem("cart", "[]");
        router.push(`/${lng}/orders`);
      },
      (e) => {
        alert(t("Order failed"));
      }
    );
  }

  function handeDelete(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart", "[]"));
    cart.splice(itemId, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    setItemsWithPrice(getItemsWithPrice(cart));
    updateTotalPrice();
  }

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("Cart")}
          <XButton href={`/${lng}`} />
        </div>
        {itemsWithPrice.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full min-h-[100px] my-1 mx-1 border-b-2">
            <div className="flex flex-col items-begin justify-center w-full relative">
              <p className="text-md">
                {t("Your cart is empty. Go to Home to pick something.")}
              </p>
            </div>
          </div>
        ) : (
          <>
            {itemsWithPrice &&
              itemsWithPrice.map((item, index) => {
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
                <p className="text-sm font-bold mb-2">${totalPrice}</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-sm font-bold mb-2">{t("Tax")}</p>
                <p className="text-sm font-bold mb-2">
                  ${calculateTax(totalPrice)}
                </p>
              </div>
              <div className="flex justify-between w-full border-b-2 border-gray-800">
                <p className="text-sm font-bold mb-2">{t("Total")}</p>
                <p className="text-sm font-bold mb-2">
                  ${calculateTotalPriceWithTax(totalPrice)}
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
      </div>

      {itemsWithPrice.length != 0 && (
        <div className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[100px] h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-[#A3DE69] md:rounded-md">
          <span className="text-2xl" onClick={handlePlaceOrder}>
            {t("Place Order!")}
          </span>
          <span className="text-2xl float-right">
            ${calculateTotalPriceWithTax(totalPrice).toFixed(2)}
          </span>
        </div>
      )}
    </main>
  );
}
