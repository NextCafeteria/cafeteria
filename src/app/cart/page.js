"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculatePriceForList, getItemsWithPrice } from "../utils/price";

export default function Cart() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemsWithPrice, setItemsWithPrice] = useState([]);

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

  return (
    <main className="flex justify-center p-2 pb-[100px]">
      <div className="max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <p className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          Cart
          <Link href="/">
            <span>X</span>
          </Link>
        </p>
        {itemsWithPrice.map((item, itemId) => {
          return (
            <div key={itemId} className="flex flex-col items-center justify-center w-full p-4 min-h-[100px] my-1 mx-1 border-b-2">
              <div className="flex flex-col items-begin justify-center w-full relative">
                <p className="text-xl font-bold">{item.name}</p>
                <p className="text-sm">{item.description}</p>
                {
                  item.customizations.map((customization, customizationIndex) => {
                    return (
                      <p key={customizationIndex} className="text-sm">{customization.name}: {customization.options[item.selectedOptions[customizationIndex]].name}</p>
                    );
                  }
                  )
                }
                <p className="absolute right-0 top-0 text-sm float-right">${item.price}</p>
                {/* Remove button */}
                <button className="absolute right-0 bottom-0 text-md text-gray-500 float-right" onClick={() => {
                  let cart = JSON.parse(localStorage.getItem("cart", "[]"));
                  cart.splice(itemId, 1);
                  localStorage.setItem("cart", JSON.stringify(cart));
                  setItemsWithPrice(getItemsWithPrice(cart));
                  updateTotalPrice();
                }}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-[700px] fixed bottom-2 h-[50px] border-2 border-gray-600 p-2 bg-blue-200 rounded-md">
        <span className="text-2xl">Total</span>
        <span className="text-2xl float-right">${totalPrice?.toFixed(2)}</span>
      </div>
    </main>
  );
}
