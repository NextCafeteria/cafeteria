"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  calculatePriceForList,
  calculateTotalPriceWithTax,
} from "./utils/price";
import { useTranslation } from "../i18n/client";
const itemsOptions = require("./food_options.json");

export default function Home({ params: { lng } }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0.0);

  // Read cart from local storage
  useEffect(() => {
    let items = JSON.parse(localStorage.getItem("cart") || "[]");
    let cartTotalPrice = calculateTotalPriceWithTax(
      calculatePriceForList(items)
    );
    setCart(items);
    setCartTotalPrice(cartTotalPrice);
  }, []);

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[100px]">
      <div className="max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="block w-full justify-center border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("title")}
          <div className="float-right">
            <a href="/vi" className="text-sm">
              VI
            </a>
            <span className="text-sm"> | </span>
            <a href="/en" className="text-sm">
              EN
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center w-full">
          {itemsOptions.map((foodOption, key) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center w-full p-4 border-[1px] border-gray-600 min-h-[160px] my-1 mx-1 rounded-md"
              onClick={() => {
                router.push(`/${lng}/pick-item-options/${key}`);
              }}
            >
              <div className="flex flex-col items-begin justify-center w-full relative">
                <img
                  src={foodOption.image}
                  alt={t(foodOption.name)}
                  width={128}
                  height={128}
                  className="absolute right-0 top-0 w-24 h-auto max-h-24 rounded-sm"
                />
                <p className="text-xl font-bold">{t(foodOption.name)}</p>
                <p className="text-sm">{t(foodOption.description)}</p>
                <p className="text-sm">${foodOption.price}</p>
                <button className="px-2 py-1 mt-4 text-sm text-gray-800 bg-gray-200 rounded-md w-[140px]">
                  {t("Add to cart")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="w-full max-w-[700px] fixed bottom-0 md:bottom-2 h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-orange-100 md:rounded-md"
        onClick={() => {
          router.push(`/${lng}/cart`);
        }}
      >
        <span className="text-2xl">{t("Cart")}</span>
        <span className="text-sm"> • {cart.length} {t("item")}</span>
        <span className="text-2xl float-right">
          ${cartTotalPrice.toFixed(2)}
        </span>
      </div>
    </main>
  );
}
